const mongoose = require('mongoose');

const FilmSchema = new mongoose.Schema({
    movie: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    times: {
        type: Array,
        required: true
    },
    cast: {
        type: Array,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    bot_text: {
        type: String,
        required: true
    },
    scraped_at: { 
        type: String,
        required: true
    }
});

module.exports = Film = mongoose.model('film', FilmSchema);