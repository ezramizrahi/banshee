const mongoose = require('mongoose');
require('dotenv').config();
const connectionString = process.env.ATLAS_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(
      connectionString,
      {
        useNewUrlParser: true
      }
    );

    console.log('MongoDB is connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;