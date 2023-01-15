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

Scraping the 'now-playing' section of my local movie theatre's website. It doesn't contain information on genre or rating, so I use Puppeteer to grab the 'now playing' film titles, and then scrape further information for each film from TMDB, e.g. rating and summary.

### Built With

* Puppeteer
* GitHub Actions

## Getting Started

To get a local copy up and running follow these steps:

1. clone the repo
2. run `npm install`
3. run `node index.js`

## TO DO

- :white_check_mark: Build functioning scraper
- :white_check_mark: Setup GitHub Workflow
- :white_check_mark: Create Netlify Function

## Contact

Ezra Mizrahi - ezra.mizrahi@hey.com