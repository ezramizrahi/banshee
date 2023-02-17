require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const utils = require('./lib/utils.js');
const puppeteerLib = require('./lib/puppeteerLib');
const launchOptions = require('./puppeteer.config.js');

(async () => {
    const { RITZ_URL, TMDB_URL, API_KEY } = process.env;
    const { browser, page } = await puppeteerLib.launchWithOptions(launchOptions);
    const nowShowingURL = await utils.buildURL(RITZ_URL, '/now-showing');
    await page.goto(nowShowingURL, { waitUntil: 'load' });

    // Store movie titles from the Ritz now-showing page
    const movieTitles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('span.Title > a'), el => el.textContent)
    });

    // Get today's show times and movie urls
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

    // grab additional info like summary and cast
    let summaries = [];
    let cast = [];
    for (let index = 0; index < movieTitles.length; index++) {
        const searchResponse = await utils.searchMovieURL(movieTitles[index].trim(), TMDB_URL, API_KEY)
        const movieDetails = searchResponse.data.results.find((r) => r.title.normalize('NFD').replace(/\p{Diacritic}/gu, "").trim() === movieTitles[index].trim());
        const movieSummary = movieDetails ? movieDetails.overview : 'n/a';
        summaries.push(movieSummary);
        const movieID = movieDetails ? movieDetails.id.toString() : 'n/a';
        if (movieID !== 'n/a') {
            const creditsResponse = await utils.getCredits(TMDB_URL, movieID, API_KEY);
            const movieCast = creditsResponse.data.cast.slice(0, 5).map(c => c.name);
            cast.push(movieCast);
        } else {
            cast.push(['n/a']);
        }
    }
    const output = await utils.formatData(movieTitles, summaries, nowShowingSessions, cast, movieLinks);
    console.log('output', output)

   // Write json file
    const outputToJSON = JSON.stringify(output);
    await fs.writeFile('./data.json', outputToJSON, (err) => {
        if (!err) {
            console.log('done');
        }
    });
    // await utils.writeData(output);
})();