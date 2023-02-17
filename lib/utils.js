const axios = require('axios');
const dayjs = require('dayjs');

// axios config
const config = {
    header: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin" : "*"
    },
};

/**
 * @param {string} baseURL base url
 * @param {string} path path
 */
async function buildURL(baseURL, path) {
    return baseURL+path;
};

/**
 * @param {string} movieTitle movie title
 * @param {string} tmdbURL the movie db url for searching
 * @param {string} apiKey tmdb api key
 */
async function getMovieDetails(movieTitle, tmdbURL, apiKey) {
    const uriEncodedComponentTitle = encodeURIComponent(movieTitle);
    const searchMovieURL = `${tmdbURL}/3/search/movie?api_key=${apiKey}&language=en-US&query=${uriEncodedComponentTitle}&page=1&include_adult=false`;
    const searchResponse = await axios.get(searchMovieURL, config);
    return searchResponse;
};

/**
 * @param {string} tmdbURL the movie db url for searching
 * @param {string} movieID movie id returned from searchMovieURL
 * @param {string} apiKey tmdb api key
 */
async function getCredits(tmdbURL, movieID, apiKey) {
    const creditsQueryURL = `${tmdbURL}/3/movie/${movieID}/credits?api_key=${apiKey}&language=en-US`;
    const creditsResponse = await axios.get(creditsQueryURL, config);
    return creditsResponse;
};

async function formatData(movieTitles, summaries, sessions, cast, movieLinks) {
    const scrapedAt = dayjs().format('dddd, MMMM D, YYYY h:mm A');
    const temp = movieTitles.map((movie,i) => ({ movie, summary: summaries[i], times: sessions[i], cast: cast[i], url: movieLinks[i], scraped_at: scrapedAt }));
    const nowShowingBotText = temp.map(m => {
        let nowShowingJoined;
        if (m.times && m.times !== null) {
            nowShowingJoined = m.times.join(", ");
        }
        return `<b>${m.movie.trim()}</b> showing at: <b>${nowShowingJoined}</b>.\n<b>Cast:</b> <i>${m.cast.join(", ")}</i>\n<b>Buy Tickets:</b> ${m.url}`;
    });
    const formattedData = temp.map((movie, i) => ({ ...movie, bot_text: nowShowingBotText[i] }));
    return formattedData;
};

module.exports = {
    buildURL,
    getMovieDetails,
    getCredits,
    formatData
};