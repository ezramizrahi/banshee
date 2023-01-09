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
            throw new Error('film not found');
        }

        // get film rating
        // const selector = '[data-testid="hero-rating-bar__aggregate-rating__score"]';
        // let ratingScoreParentElement = await page.$(selector);
        // let ratingScoreChildrenElements = await ratingScoreParentElement.$$(':scope > *');
        // let rating = await page.evaluate(el => el.textContent, ratingScoreChildrenElements[0]);
        const rating = await page.$$eval(".user_score_chart", el => el.map(x => x.getAttribute("data-percent")));
        ratings.push(rating[0].slice(0, -2) + "/100");

        // get summary
        const summaryParentElem = await page.$('.overview');
        const summaryChildElem = await summaryParentElem.$$(':scope > *');
        const summary = await page.evaluate(el => el.textContent, summaryChildElem[0]);
        summaries.push(summary);
    }

    // create array of objects
    let output = movieTitles.map((movie,i) => ({ movie, rating: ratings[i] }));

    // more formatting
    const newOutput = output.map((item, i)=>({ ...item, Summary: summaries[i] }));
    console.log(newOutput)


    // end
    await browser.close();
})();