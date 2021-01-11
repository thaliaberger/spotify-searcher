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

(async function configSpotifyApi() {
  try {
    const result = await spotifyApi.clientCredentialsGrant();
    await spotifyApi.setAccessToken(result.body["access_token"]);

    // ROUTES
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

    app.get("/albums/:artistId", async (req, res) => {
      const artistAlbums = await spotifyApi.getArtistAlbums(
        req.params.artistId
      );
      const albums = artistAlbums.body.items.map((item) => {
        item.name = item.name.slice(0, 20);
        return item;
      });
      res.render("albums", { albums: albums, artist: albums[0].artists[0] });
    });

    app.get("/tracks/:tracksId", async (req, res) => {
      const albumTracks = await spotifyApi.getAlbumTracks(req.params.tracksId);
      const tracks = albumTracks.body.items;
      res.render("tracks", { tracks });
    });

    app.listen(process.env.PORT || 3000, () =>
      console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
    );
  } catch (err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
})();
