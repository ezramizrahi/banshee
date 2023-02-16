const puppeteer = require('puppeteer');

/**
 * @param {object} configObj configuration object
 */
async function setConfig(configObj) {
    console.log(configObj);
};

async function launchWithConfig(configObj) {
    // await setConfig({
    //     device: 'iPhone 13 Pro',
    //     locale: 'en-US',
    //     geolocation: { longitude: 12.492507, latitude: 41.889938 },
    //     permissions: ['geolocation'],
    //     javascript: false,
    //     images: false
    // });
    const browser = await puppeteer.launch(configObj);
    const page = await browser.newPage();
    // await page.setViewport({ width: 0, height: 0});
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