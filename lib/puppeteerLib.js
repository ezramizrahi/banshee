const puppeteer = require('puppeteer');

async function toggleJavascript(boolValue, page) {
    await page.setJavaScriptEnabled(boolValue);
};

async function disableImages(boolValue, page) {
    if (boolValue === true) return;
    await page.setRequestInterception(!boolValue);
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
    if (Object.keys(configObj).length === 0) return;
    if (configObj.hasOwnProperty('javascript')) await toggleJavascript(configObj['javascript'], page);
    if (configObj.hasOwnProperty('images')) await disableImages(configObj['images'], page);
    return;
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