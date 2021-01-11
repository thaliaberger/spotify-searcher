require("dotenv").config();
const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (req, res) => {
  return res.render("home");
});

app.get("/artist-search", (req, res) => {
  const { search } = req.query;

  spotifyApi
    .searchArtists(search)
    .then((data) => {
      console.log("The received data from the API: ", data.body.artists.items);
      return res.render("artist-search-results", {
        artists: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res, next) => {
  const { id } = req.params;

  spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
      res.render("albums", {
        albums: data.body.items,
      });
    })

    .catch((err) => console.log("error", err));
});

app.get("/tracks/:id", (req, res) => {
  const { id } = req.params;

  spotifyApi
    .getAlbumTracks(id)
    .then((data) => {
      res.render("tracks", {
        tracks: data.body.items,
      });
    })
    .catch((err) => console.log("error", err));
});

app.listen(process.env.PORT, () =>
  console.log(
    `My Spotify project running on port ${process.env.PORT} 🎧 🥁 🎸 🔊`
  )
);
