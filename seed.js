require('dotenv').config();
const mongoose = require('mongoose');
const Film = require('./models/Film');
const connectionString = process.env.ATLAS_URI;
const data = require('./data.json');


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