import Logout from './auth/Logout';
import PlaylistCard from './video/PlaylistCard';
import ChannelVideos from './channel/ChannelVideos';
import ChannelPlaylists from './channel/ChannelPlaylists';
import ChannelAbout from './channel/ChannelAbout';
import ChannelSubscribed from './channel/ChannelSubscribed';
import VideoList from './video/VideoList';
import RandomVideoCard from './video/RandomVideoCard';
import ChannelVideoCard from './video/ChannelVideoCard';
import RecemendationVideoList from './video/RecemendationVideoList';
import SideVideos from './video/SideVideos';
import Comments from './video/Comments';
import VideoPlayer from './video/VideoPlayer';
import SettingsPersonal from './settings/SettingsPersonal';
import SettingsChannel from './settings/SettingsChannel';
import SettingsPassword from './settings/SettingsPassword';

import Layout from './layout/Layout';
import Header from './layout/Header';
import SideBar from './layout/SideBar';

//methods
import { formatDuration } from '../utils/formatDuration';

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
    PulseRecemendationVideoList,
    PulseVideoPage,
    PulseAdminPage,
    PulsePlaylistPage,
} from './video/Pulses';

//popups
import LoginPopup from './popups/LoginPopup';
import PlaylistPopup from './popups/PlaylistPopup';
import UploadVideoPopup from './popups/uploadVideo';
import UploadingVideoPopup from './popups/uploadingVideoPopup';
import VideoUploadedPopup from './popups/VideoUploadedPopup';
import DeleteVideoPopup from './popups/deleteVideo';
import EditVideoPopup from './popups/editVideo';
import VideoUpdatingPopup from './popups/updatingVideoPopup';
import VideoUpdatedPopup from './popups/videoUpdatedPopup';
import EditPlaylistPopup from './popups/editPlaylistPopup';
import DeletePlaylistPopup from './popups/deletePlaylistPopup';
import CreatePlaylistPopup from './popups/createPlaylistPopup';

export {
    Logout,
    Header,
    SideBar,
    Layout,
    ChannelVideos,
    ChannelPlaylists,
    ChannelAbout,
    PlaylistCard,
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
    SettingsPersonal,
    SettingsChannel,
    SettingsPassword,
};
