const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 0, height: 0});
    await page.setJavaScriptEnabled(false);

    await page.goto('https://www.ritzcinemas.com.au/now-showing', { waitUntil: 'networkidle0' });

    const movieTitles = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('span.Title > a'), el => el.textContent)
    });

    await page.goto('https://www.imdb.com/', { waitUntil: 'networkidle0' });

    let ratings = [];
    let summaries = [];
    for (let index = 0; index < movieTitles.length; index++) {
        // search imdb for film
        await page.type('#suggestion-search', movieTitles[index], { delay: 100 });
        await Promise.all([
            page.waitForNavigation({ waitUntil: "load" }),
            page.keyboard.press("Enter")
        ]);

        // const searchResults = await page.evaluate(() => {
        //     return Array.from(document.querySelectorAll('a.ipc-metadata-list-summary-item__t'), el => el.textContent)
        // });

        // click on first search result
        // brittle, but works for now
        const searchResults = await page.$$('a.ipc-metadata-list-summary-item__t');
        if (searchResults.length > 0) {
            await Promise.all([
                page.waitForNavigation({ waitUntil: "load" }),
                await searchResults[0].click()
            ]);
        } else {
            throw new Error('film not found');
        }

        // get film rating
        const selector = '[data-testid="hero-rating-bar__aggregate-rating__score"]';
        let ratingScoreParentElement = await page.$(selector);
        let ratingScoreChildrenElements = await ratingScoreParentElement.$$(':scope > *');
        let rating = await page.evaluate(el => el.textContent, ratingScoreChildrenElements[0]);
        ratings.push(Number(rating));

        // get summary
        let elements = await page.$$('.ipc-html-content-inner-div');
        let summary = await page.evaluate(el => el.textContent, elements[0]);
        summaries.push(summary);
    }
    console.log(summaries);

    // create array of objects
    let output = movieTitles.map((movie,i) => ({ movie, rating: ratings[i] }));
    console.log(output);
    // sort
    output.sort((a, b) => a.rating - b.rating);

    // end
    await browser.close();
})();