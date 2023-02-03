require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const dayjs = require('dayjs');
const axios = require('axios');
const utils = require('./lib/utils.js');
const puppeteerLib = require('./lib/puppeteerLib');

(async () => {
    const { RITZ_URL, TMDB_URL, API_KEY } = process.env;
    const { browser, page } = await puppeteerLib.launchWithConfig();
    const nowShowingURL = await utils.buildURL(RITZ_URL, '/now-showing');
    await page.goto(nowShowingURL, { waitUntil: 'load' });

    // Store movie titles from the Ritz now-showing page
    const movieTitles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('span.Title > a'), el => el.textContent)
    });

    // Get today's show times
    let nowShowingSessions = [];
    let movieLinks = [];
    for (let index = 0; index < movieTitles.length; index++) {
        await page.goto(nowShowingURL, { waitUntil: 'load' });
        const titles = await page.$$('span.Title > a');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'load' }),
            titles[index].click(),
        ]);
        const sessionsElem = await page.$('.Sessions:not(.Hidden)') ? true : false;
        if (sessionsElem) {
            const sessionsToday = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('.Sessions:not(.Hidden) > li > a > span.Time'), el => el.textContent)
            });
            nowShowingSessions.push(sessionsToday);
        } else {
            nowShowingSessions.unshift(['no sessions left today']);
        }
        let currURL = page.url();
        movieLinks.push(currURL);
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
        const searchMovieURL = `${TMDB_URL}/3/search/movie?api_key=${API_KEY}&language=en-US&query=${uriEncodedComponentTitle}&page=1&include_adult=false`;
        const searchResponse = await axios.get(searchMovieURL, config);
        const movieDetails = searchResponse.data.results.find((r) => r.title.normalize('NFD').replace(/\p{Diacritic}/gu, "").trim() === movieTitles[index].trim());
        const movieSummary = movieDetails ? movieDetails.overview : 'n/a';
        summaries.push(movieSummary);
        const movieID = movieDetails ? movieDetails.id.toString() : 'n/a';
        if (movieID !== 'n/a') {
            const creditsQueryURL = `${TMDB_URL}/3/movie/${movieID}/credits?api_key=${API_KEY}&language=en-US`;
            const creditsResponse = await axios.get(creditsQueryURL, config);
            const movieCast = creditsResponse.data.cast.slice(0, 5).map(c => c.name);
            cast.push(movieCast);
        } else {
            cast.push(['n/a']);
        }
    }

    // TODO: CLEAN UP BELOW
    const scrapedAt = dayjs().format('dddd, MMMM D, YYYY h:mm A');
    // Create an array of objects containing film title and rating
    const output = movieTitles.map((movie,i) => ({ movie, summary: summaries[i], times: nowShowingSessions[i], cast: cast[i], url: movieLinks[i], scraped_at: scrapedAt }));
    const nowShowingBotText = output.map(m => {
        let nowShowingJoined;
        if (m.times && m.times !== null) {
            nowShowingJoined = m.times.join(", ");
        }
        return `<b>${m.movie.trim()}</b> showing at: <b>${nowShowingJoined}</b>.\n<b>Cast:</b> <i>${m.cast.join(", ")}</i>\n<b>Buy Tickets:</b> ${m.url}`;
    });
    const newoutput = output.map((movie, i) => ({ ...movie, bot_text: nowShowingBotText[i] }));
    console.log(newoutput)

    // Write json file
    const outputToJSON = JSON.stringify(newoutput);
    await fs.writeFile('./data.json', outputToJSON, (err) => {
        if (!err) {
            console.log('done');
        }
    });
})();