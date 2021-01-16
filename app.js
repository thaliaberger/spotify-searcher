require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

(async function configSpotifyApi() {
  try {
    const result = await spotifyApi.clientCredentialsGrant();
    await spotifyApi.setAccessToken(result.body["access_token"]);

    app.get("/", (req, res) => {
      res.render("home");
    });

    app.get("/artist-search", async (req, res) => {
      const artistSearched = await spotifyApi.searchArtists(req.query.artist);
      res.render("artist-search", {
        artists: artistSearched.body.artists.items,
      });
    });

    app.get("/albums/:artistId", async (req, res) => {
      const artistAlbums = await spotifyApi.getArtistAlbums(
        req.params.artistId
      );
      const albums = artistAlbums.body.items;
      res.render("albums", { album: albums });
    });

    app.get("/tracks/:tracksId", async (req, res) => {
      const albumTracks = await spotifyApi.getAlbumTracks(req.params.tracksId);
      const tracks = albumTracks.body.items;
      res.render("tracks", { track: tracks });
    });

    app.listen(process.env.PORT || 3000, () =>
      console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
    );
  } catch (err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
})();
