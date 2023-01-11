const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 0, height: 0});
    await page.setJavaScriptEnabled(false);

    await page.goto('https://www.ritzcinemas.com.au/now-showing', { waitUntil: 'networkidle0' });

    let movieTitles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('span.Title > a'), el => el.textContent)
    });
    console.log(movieTitles);

    let ratings = [];
    let summaries = [];
    for (let index = 0; index < movieTitles.length; index++) {
        // search tmdb for film
        await page.goto('https://www.themoviedb.org/', { waitUntil: 'networkidle0' });
        await page.type('#inner_search_v4', movieTitles[index], { delay: 100 });
        await Promise.all([
            page.waitForNavigation({ waitUntil: "load" }),
            page.keyboard.press("Enter")
        ]);

        // click on first search result
        // brittle, but works for now
        const searchResults = await page.$$('.image');
        if (searchResults.length > 0) {
            await Promise.all([
                page.waitForNavigation({ waitUntil: "load" }),
                await searchResults[0].click()
            ]);
        } else {
            console.log(`${movieTitles[index]} not found`);
            movieTitles = movieTitles.filter(item => item !== movieTitles[index]);
            continue;
            // throw new Error(`${movieTitles[index]} not found`);
        }

        const rating = await page.$$eval(".user_score_chart", el => el.map(x => x.getAttribute("data-percent")));
        ratings.push(rating[0].slice(0, -2) + "/100");

        // get summary
        const summaryParentElem = await page.$('.overview');
        const summaryChildElem = await summaryParentElem.$$(':scope > *');
        const summary = await page.evaluate(el => el.textContent, summaryChildElem[0]);
        summaries.push(summary);
    }

    // create array of objects containing film title and rating
    let output = movieTitles.map((movie,i) => ({ movie, rating: ratings[i], summary: summaries[i] }));
    console.log('output', output);

    // end
    await browser.close();

    const outputToJSON = JSON.stringify(output);
    fs.writeFile('./data.json', outputToJSON, (err) => {
        if (!err) {
            console.log('done');
        }
    });
})();