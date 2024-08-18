import Login from "./auth/Login"
import Register from "./auth/Register"
import Logout from "./auth/Logout"
import Home from "./layout/Home"
import PlaylistCard from "./video/PlaylistCard"
import Channel from "./channel/Channel"
import ChannelVideos from "./channel/ChannelVideos"
import ChannelPlaylists from "./channel/ChannelPlaylists"
import ChannelAbout from "./channel/ChannelAbout"
import WatchHistory from "./user/WatchHistory"
import LikedVideos from "./user/LikedVideos"
import ChannelSubscribed from "./channel/ChannelSubscribed"
import VideoList from "./video/VideoList"
import RandomVideoCard from "./video/RandomVideoCard"
import ChannelVideoCard from "./video/ChannelVideoCard"
import RecemendationVideoList from "./video/RecemendationVideoList"
import SideVideos from "./video/SideVideos"
import Comments from "./video/Comments"
import VideoPlayer from "./video/VideoPlayer"
import Settings from "./user/Settings"
import SettingsPersonal from "./user/SettingsPersonal"
import SettingsChannel from "./user/SettingsChannel"
import SettingsPassword from "./user/SettingsPassword"
import Support from "./user/Support" 

import Layout from "./layout/Layout"
import Header from "./layout/Header"
import SideBar from "./layout/SideBar"

//methods
import { formatDuration } from "../utils/formatDuration"

//pulse
import { 
        PulseVideoList,
        PulseVideoCard,
        PulseSubscribedChannel,
        PulseChannel,
        PulsePlaylistCard,
        PulseSettings,
        PulseChannelAbout,
        PulseRandomVideoCard,
        PulseRecemendationVideoList ,
        PulseVideoPage,
        PulseAdminPage,
        PulsePlaylistPage 
    } from "./video/Pulses"

//popups
import LoginPopup from "./popups/LoginPopup"
import PlaylistPopup from "./popups/PlaylistPopup"
import UploadVideoPopup from "./popups/uploadVideo"
import UploadingVideoPopup from "./popups/uploadingVideoPopup"
import VideoUploadedPopup from "./popups/VideoUploadedPopup"
import DeleteVideoPopup from "./popups/deleteVideo"
import EditVideoPopup from "./popups/editVideo" 
import VideoUpdatingPopup from "./popups/updatingVideoPopup"
import VideoUpdatedPopup from "./popups/videoUpdatedPopup"
import EditPlaylistPopup from "./popups/editPlaylistPopup"
import DeletePlaylistPopup from "./popups/deletePlaylistPopup"
import CreatePlaylistPopup from "./popups/createPlaylistPopup"

export {
    Login,
    Logout,
    Register,
    Header,
    SideBar,
    Layout,
    Home,
    Channel,
    ChannelVideos,
    ChannelPlaylists,
    ChannelAbout,
    WatchHistory,
    PlaylistCard,
    LikedVideos,
    ChannelSubscribed,
    VideoList,
    RandomVideoCard,
    ChannelVideoCard,
    RecemendationVideoList,
    SideVideos,
    Comments,
    VideoPlayer,
    PulseVideoList,
    PulseVideoCard,
    PulseSubscribedChannel,
    PulseChannel,
    PulsePlaylistCard,
    PulseSettings,
    PulseRecemendationVideoList,
    PulseChannelAbout,
    PulseRandomVideoCard,
    PulseVideoPage,
    PulseAdminPage,
    PulsePlaylistPage,
    LoginPopup,
    PlaylistPopup,
    UploadVideoPopup,
    UploadingVideoPopup,
    VideoUploadedPopup,
    DeleteVideoPopup,
    EditVideoPopup,
    VideoUpdatingPopup,
    VideoUpdatedPopup,
    EditPlaylistPopup,
    DeletePlaylistPopup,
    CreatePlaylistPopup,
    formatDuration,
    Settings,
    SettingsPersonal,
    SettingsChannel,
    SettingsPassword,
    Support,
}