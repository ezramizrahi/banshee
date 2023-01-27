require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const dayjs = require('dayjs');
const axios = require('axios');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    // console.log('user agent', browser.userAgent());
    const page = await browser.newPage();
    await page.setViewport({ width: 0, height: 0});
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(req.resourceType() === 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });
    await page.goto('https://www.ritzcinemas.com.au/now-showing', { waitUntil: 'load' });

    // Store movie titles from the Ritz now-showing page
    let movieTitles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('span.Title > a'), el => el.textContent)
    });

    const allLinks = await page.evaluate(
        () => Array.from(
          document.querySelectorAll('a[href]'),
          a => a.getAttribute('href')
        )
    );
    const movieLinks = [...new Set( allLinks.filter(link => link.includes('/movies/')) )];
    console.log('links', movieLinks)

    // Get today's show times
    // TODO: we can build the URL below from link attributes
    let nowShowingSessions = [];
    for (let index = 0; index < movieTitles.length; index++) {
        await page.goto('https://www.ritzcinemas.com.au/now-showing', { waitUntil: 'load' });
        let titles = await page.$$('span.Title > a');
        await Promise.all([
            page.waitForNavigation({ waitUntil: "load" }),
            titles[index].click(),
        ]);

        // Check for session count today
        if (await page.$('.Sessions')) {
            let sessionsParent = await page.$('.Sessions');
            let sessionsChildren = await sessionsParent.$$(':scope > *');
            let sessionsLength = sessionsChildren.length;
            let allSessions = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('span.Time'), el => el.textContent)
            });
            nowShowingSessions.push(allSessions.slice(0, sessionsLength));
        } else {
            nowShowingSessions.unshift(['no sessions left today'])
        }
    }

    // close browser
    await browser.close();

    let summaries = [];
    let cast = [];
    const config = {
        header: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin" : "*"
        },
    };
    for (let index = 0; index < movieTitles.length; index++) {
        const uriEncodedComponentTitle = encodeURIComponent(movieTitles[index].trim());
        const searchMovieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${uriEncodedComponentTitle}&page=1&include_adult=false`;
        const searchResponse = await axios.get(searchMovieURL, config);
        const movieDetails = searchResponse.data.results.find((r) => r.title.normalize('NFD').replace(/\p{Diacritic}/gu, "").trim() === movieTitles[index].trim());
        const movieSummary = movieDetails ? movieDetails.overview : 'n/a';
        summaries.push(movieSummary);
        const movieID = movieDetails ? movieDetails.id.toString() : 'n/a';
        if (movieID !== 'n/a') {
            const creditsQueryURL = `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${process.env.API_KEY}&language=en-US`;
            const creditsResponse = await axios.get(creditsQueryURL, config);
            const movieCast = creditsResponse.data.cast.slice(0, 5).map(c => c.name);
            cast.push(movieCast);
        } else {
            cast.push(['n/a']);
        }
    }

    const scrapedAt = dayjs().format('dddd, MMMM D, YYYY h:mmA');
    // Create an array of objects containing film title and rating
    let output = movieTitles.map((movie,i) => ({ movie, summary: summaries[i], times: nowShowingSessions[i], cast: cast[i], scraped_at: scrapedAt }));
    console.log('output', output);
    let nowShowingBotText = output.map(m => {
        let nowShowingJoined;
        if (m.times && m.times !== null) {
            nowShowingJoined = m.times.join(", ");
        }
        return `<b>${m.movie.trim()}</b> showing at: <b>${nowShowingJoined}</b>.\n<b>Summary:</b> ${m.summary}\n<b>Cast:</b> <i>${m.cast.join(", ")}</i>`;
    });
    let newoutput = output.map((movie, i) => ({ ...movie, bot_text: nowShowingBotText[i] }));


    // Write json file
    const outputToJSON = JSON.stringify(newoutput);
    fs.writeFile('./data.json', outputToJSON, (err) => {
        if (!err) {
            console.log('done');
        }
    });
})();