const puppeteer = require('puppeteer');

async function disableJavascript(page) {
    await page.setJavaScriptEnabled(false);
    console.log('JavaScript disabled.');
};

async function disableImages(page) {
    await page.setRequestInterception(true);
    console.log('Images disabled.');
    page.on('request', (req) => {
        if (req.resourceType() === 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });
};

/**
 * @param {object} configObj configuration object
 */
async function setConfig(configObj, page) {
    for (const [key, value] of Object.entries(configObj)) {
        if (key === 'javascript' && value === false) disableJavascript(page);
        if (key === 'images' && value === false) disableImages(page);
    }
};

/**
 * @param {object} launchOptions launch options object from puppeteer.config.js
 */
async function launchWithOptions(launchOptions) {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    // we don't need JS or images
    await setConfig({
        javascript: false,
        images: false
    }, page);
    return { browser, page };
};

module.exports = { launchWithOptions };