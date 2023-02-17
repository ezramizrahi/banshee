const puppeteer = require('puppeteer');

async function toggleJavascript(page, boolValue) {
    await page.setJavaScriptEnabled(boolValue);
};

async function disableImages(page, boolValue) {
    if (boolValue === true) {
        await page.setRequestInterception(!boolValue);
        return;
    }
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
    if (configObj.hasOwnProperty('javascript')) toggleJavascript(page, configObj['javascript']);
    if (configObj.hasOwnProperty('images')) disableImages(page, configObj['images']);
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