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

Scraping the 'now playing' section of my local movie theatre's website. It doesn't contain any details on cast or a detailed summary, so I use Puppeteer to grab the 'now playing' film titles and show times, and then grab further information for each film from TMDB API, e.g. cast and summary. Currently this is run twice a day via a Cron setting in the `scheduled-jobs.yml` workflow file.

This data is then stored in a MongoDB Atlas collection, and exposed via a Netlify Function.

Finally, a Telegram bot (banshee_howl_bot) makes a call to the Netlify Function to get and display the data whenever a user sends `howl` to the bot.

<img src="banshee.jpg" alt="screenshot of telegram bot interaction"/>

### Built With/Uses:

* Puppeteer
* MongoDB
* GitHub Actions
* Telegraf

## Getting Started

To get a local copy up and running follow these steps:

1. clone the repo (you will need a `.env` file with your own MongoDB and Telegram Bot secrets)
2. run `npm install`
3. run `npm run scrape` to scrape the movie data and save it to `data.json`
5. run `npm run seed` to clean and reseed the db with the latest films

## TO DO

- [x] Build scraper
- [x] Use TMDB API instead of scraping TMDB
- [x] Setup GitHub Workflow
- [x] Create Netlify Function to get movies from MongoDB
- [x] Create Telegram Bot with Netlify Function
- [ ] Clean up code

## Contact

Ezra Mizrahi - ezra.mizrahi@hey.com