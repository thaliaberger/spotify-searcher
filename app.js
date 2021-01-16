require("dotenv").config();

const express = require("express");
const hbs = require("hbs");
const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
hbs.registerPartials(__dirname + "/views/partials");

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: "9582ce1bdce64a6388d648f3ae57ab64",
  clientSecret: "aa02aa78fef248eba261172f546aaff6",
});

// Retrieve an access token
(async function configSpotifyApi() {
  try {
    const result = await spotifyApi.clientCredentialsGrant();
    await spotifyApi.setAccessToken(result.body["access_token"]);

    // ROUTES
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
