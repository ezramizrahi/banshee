require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Film = require('./models/Film');
const connectionString = process.env.ATLAS_URI;
const data = require('./data.json');

const { MongoClient } = require("mongodb");

const mongoClient = new MongoClient(process.env.ATLAS_URI);

const clientPromise = mongoClient.connect();

const seedDB = async () => {
    try {
        const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
        const collection = database.collection(process.env.MONGODB_COLLECTION);
        await collection.deleteMany({});
        await collection.insertMany(data)
    } catch (error) {
        console.log('error: ', error)
    }
};
seedDB();


// mongoose.connect(
//     connectionString, {
//         useNewUrlParser: true, useUnifiedTopology: true
//     })
//     .then(() => {
//         console.log('connection open');
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// const seedDB = async () => {
//     await Film.deleteMany({});
//     await Film.insertMany(data);
// };

// seedDB().then(() => {
//     console.log('DB seeded with scraped data!');
//     mongoose.connection.close();
// });