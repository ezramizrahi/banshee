const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');
const films = require('./routes/api/films');

const app = express();

connectDB();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Hello world!'));

app.use('/api/films', films);

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));