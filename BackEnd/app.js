const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');
const cors = require('cors');
const port = process.env.PORT || 3000;

//Import routes
const postsRoute = require('./routes/posts');
const episodesRoute = require('./routes/episodes');
const charactersRoute = require('./routes/characters');

//Middlewares
app.use(bodyParser.json());
app.use(cors());

app.use('/api/posts', postsRoute);
app.use('/api/episodes', episodesRoute);
app.use('/api/characters', charactersRoute);


//Routes
app.get('/', (req, res) => {
    res.redirect('/api');
});

app.get('/api/', (req, res) => {
    res.sendFile("routes.json", { root: __dirname });
});

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to DB')
);


// listen for requests :)
app.listen(port, () => {
    console.log(`Your app is listening on port ${port}`);
  });
