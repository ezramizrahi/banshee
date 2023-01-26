require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const dayjs = require('dayjs');
const axios = require('axios');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
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

    // Get today's show times
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

    let ratings = [];
    let summaries = [];
    const config = {
        header: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin" : "*"
        },
    };
    for (let index = 0; index < movieTitles.length; index++) {
        const uriEncodedComponentTitle = encodeURIComponent(movieTitles[index].trim());
        const queryURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${uriEncodedComponentTitle}&page=1&include_adult=false`;
        const res = await axios.get(queryURL, config);
        const movieObj = res.data.results.find((r) => r.title.normalize('NFD').replace(/\p{Diacritic}/gu, "").trim() === movieTitles[index].trim());
        const tempRating = movieObj ? movieObj.popularity.toString() : 'unknown';
        const tempSummary = movieObj ? movieObj.overview : 'unknown';
        ratings.push(tempRating);
        summaries.push(tempSummary);
    }

    const scrapedAt = dayjs().format('dddd, MMMM D, YYYY h:mm A');
    // Create an array of objects containing film title and rating
    let output = movieTitles.map((movie,i) => ({ movie, rating: ratings[i], summary: summaries[i], times: nowShowingSessions[i], scraped_at: scrapedAt }));
    console.log('output', output);

    // Write json file
    const outputToJSON = JSON.stringify(output);
    fs.writeFile('./data.json', outputToJSON, (err) => {
        if (!err) {
            console.log('done');
        }
    });
})();