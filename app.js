require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const SpotifyWebApi = require("spotify-web-api-node");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

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
  res.render("home");
});

app.get("/artist-search", (req, res) => {
  const { search } = req.query;

  spotifyApi
    .searchArtists(search)
    .then((data) => {
      const response = data.body.artists.items;
      return res.render("artist-search", { artist: response });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:artistId", (req, res) => {
  const { artistId } = req.params;

  spotifyApi
    .getArtistAlbums(artistId)
    .then((data) => {
      const albums = data.body.items;
      return res.render("albums", { albums: albums });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get("/tracks/:albumId", (req, res) => {
  const { albumId } = req.params;

  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracks = data.body.items;
      return res.render("tracks", { tracks: tracks });
    })
    .catch((err) => {
      console.error(err);
    });
});

// process.env.PORT

app.listen(3000, () =>
  console.log(`My Spotify project running on port 3000 🎧 🥁 🎸 🔊`)
);
