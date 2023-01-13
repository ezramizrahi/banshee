const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 0, height: 0});
    await page.setJavaScriptEnabled(false);
    await page.goto('https://www.ritzcinemas.com.au/now-showing', { waitUntil: 'load' });

    // Store movie titles from the Ritz now-showing page
    let movieTitles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('span.Title > a'), el => el.textContent)
    });

    let ratings = [];
    let summaries = [];
    for (let index = 0; index < movieTitles.length; index++) {
        // Search themoviedb for each film
        await page.goto('https://www.themoviedb.org/', { waitUntil: 'load' });
        await page.type('#inner_search_v4', movieTitles[index], { delay: 100 });
        await Promise.all([
            page.waitForNavigation({ waitUntil: "load" }),
            page.keyboard.press("Enter")
        ]);

        // Click on the first search result
        // brittle, but works for now
        const searchResults = await page.$$('.image');
        if (searchResults.length > 0) {
            await Promise.all([
                page.waitForNavigation({ waitUntil: "load" }),
                await searchResults[0].click()
            ]);
        } else {
            console.log(`${movieTitles[index]} not found`);
            ratings.push(`Rating for ${movieTitles[index]} not found`);
            summaries.push(`Summary for ${movieTitles[index]} not found`);
            // Finish here and continue with the next iteration
            continue;
        }

        // Get film rating
        let rating = await page.$$eval(".user_score_chart", el => el.map(x => x.getAttribute("data-percent")));
        ratings.push(rating[0].slice(0, -2) + "/100");
        // Get film summary
        let summaryParentElem = await page.$('.overview');
        let summaryChildElem = await summaryParentElem.$$(':scope > *');
        let summary = await page.evaluate(el => el.textContent, summaryChildElem[0]);
        summaries.push(summary);
    }
    // Close the browser
    await browser.close();

    // Create an array of objects containing film title and rating
    let output = movieTitles.map((movie,i) => ({ movie, rating: ratings[i], summary: summaries[i] }));
    console.log('output', output);

    // Write json file
    const outputToJSON = JSON.stringify(output);
    fs.writeFile('./data.json', outputToJSON, (err) => {
        if (!err) {
            console.log('done');
        }
    });
})();