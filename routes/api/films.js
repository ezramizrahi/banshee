const express = require('express');
const router = express.Router();

// Load Film model
const Film = require('../../models/Film');

// @route GET api/films/test
// @description tests films route
// @access Public
router.get('/test', (req, res) => res.send('film route testing!'));

// @route GET api/films
// @description get all films
// @access Public
router.get('/', (req, res) => {
    Film.find()
        .then(films => res.json(films))
        .catch(err => console.log(err));
});

// @route POST api/films
// @description add/save film
// @access Public
router.post('/', (req, res) => {
    Film.create(req.body)
        .then(film => res.json({ msg: 'Film added successfully' }))
        .catch(err => console.log(err));
});

module.exports = router;