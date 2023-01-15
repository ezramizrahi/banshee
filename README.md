<br />
<p align="center">
  <h3 align="center">BANSHEE</h3>
</p>

## Table of Contents

* [About](#about)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
* [Contact](#contact)


## About

Scraping the 'now-playing' section of my local movie theatre's website. It doesn't contain any rating information or a detailed summary, so I use Puppeteer to grab the 'now playing' film titles and show times, and then scrape further information for each film from TMDB, e.g. rating and summary. Currently this is run twice a day via a Cron setting in the `scheduled-jobs.yml` workflow file.

This data is then stored in a MongoDB Atlas collection, and exposed via a Netlify Function.

### Built With/Uses:

* Puppeteer
* MongoDB
* GitHub Actions

## Getting Started

To get a local copy up and running follow these steps:

1. clone the repo
2. run `npm install`
3. run `npm run scrape` to scrape
4. run `npm run seed` to clean and reseed the db with the latest films

## TO DO

- [x] Build functioning scraper
- [x] Setup GitHub Workflow
- [x] Create Netlify Function
- [x] Add Postman tests (may remove these in the future)
- [] Hook up a FE to display results
- [] Find a reason to use Babashka, otherwise get rid of it

## Contact

Ezra Mizrahi - ezra.mizrahi@hey.com