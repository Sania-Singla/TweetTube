const {
    create_Playlist,
    get_User_Playlists,
    get_Playlist_By_Id,
    add_Video_To_Playlist,
    remove_Video_From_Playlist,
    update_Playlist,
    delete_Playlist,
    get_User_Playlists_Titles
} = require("../controllers/playlist_Controller");

const express = require("express");
const playlistRouter = express.Router();
const verifyJWT = require("../middleware/authorize");


playlistRouter.route("/user/:userId")
.get(get_User_Playlists)

playlistRouter.route("/titles/:userId")
.get(get_User_Playlists_Titles)

playlistRouter.route("/")
.post(verifyJWT, create_Playlist)

playlistRouter.route("/:playlistId")
.get(get_Playlist_By_Id)
.patch(verifyJWT,update_Playlist)
.delete(verifyJWT,delete_Playlist)

playlistRouter.route("/add/:playlistId/:videoId")
.get(verifyJWT,add_Video_To_Playlist)

playlistRouter.route("/remove/:playlistId/:videoId")
.get(verifyJWT,remove_Video_From_Playlist)





module.exports = playlistRouter;