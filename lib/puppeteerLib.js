const puppeteer = require('puppeteer');

async function launchWithConfig() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 0, height: 0});
    // we don't need JS or images
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
    return { browser, page };
};

module.exports = {
    launchWithConfig
};