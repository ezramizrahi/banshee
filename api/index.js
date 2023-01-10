const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const data = require('./data.json');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/films', (req, res) => {
    res.json(data);
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));

module.exports = app;