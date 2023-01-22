const mongoose = require('mongoose');

const FilmSchema = new mongoose.Schema({
    movie: {
        type: String,
        required: true
    },
    rating: {
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
    date: { 
        type: Date, 
        default: Date.now,
        required: true
    }
});

module.exports = Film = mongoose.model('film', FilmSchema);