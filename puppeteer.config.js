module.exports = {
  headless: true,
  ignoreHTTPSErrors: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-sync',
    '--ignore-certificate-errors'
  ],
  defaultViewport: { width: 0, height: 0 }
}