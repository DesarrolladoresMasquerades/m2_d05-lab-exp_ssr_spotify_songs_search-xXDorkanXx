require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(express.json()); // need for acces body
app.use(express.urlencoded()); // need for access body from forms

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res)=>{
    res.render("home");
});

app.get("/artist-search", (req, res)=>{
    const searchArtist = req.query.searchArtist;

    spotifyApi.searchArtists(searchArtist)
    .then(data => {
        console.log('The received data from the API: ', data.body.artists.items[0]);
        res.render("artist-search-results", data.body);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
        console.log('The received data from the API: ', data.body.items[0].artists[0].name);
        res.render("albums", data.body);
    })
    .catch(err => console.log('The error while trying to view the album occurred: ', err));
});

app.listen(process.env.PORT, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
