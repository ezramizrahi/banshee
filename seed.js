require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Film = require('./models/Film');
const connectionString = process.env.ATLAS_URI;
const data = require('./data.json');

// const createFakeFilm = () => {
//     return {
//         movie: faker.lorem.words(3),
//         summary: faker.lorem.words(10),
//         rating: faker.random.word(),
//     };
// };

// const createFakeFilms = (numFilms = 5) => {
//     return Array.from({ length: numFilms }, createFakeFilm);
// };

// const fakeFilmSeedData = createFakeFilms(5);
// console.log(fakeFilmSeedData)

mongoose.connect(
    connectionString, {
        useNewUrlParser: true, useUnifiedTopology: true
    })
    .then(() => {
        console.log('connection open');
    })
    .catch((err) => {
        console.log(err);
    });

const seedDB = async () => {
    await Film.deleteMany({});
    await Film.insertMany(data);
};

seedDB().then(() => {
    console.log('DB seeded with scraped data!');
    mongoose.connection.close();
});