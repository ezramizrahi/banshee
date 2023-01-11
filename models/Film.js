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
    }
});

module.exports = Film = mongoose.model('film', FilmSchema);