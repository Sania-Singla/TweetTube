import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { createBrowserRouter,createRoutesFromElements,Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from "./Store/store"
import { 
        HomePage, 
        LoginPage, 
        RegisterPage, 
        WatchHistoryPage, 
        ChannelPage, 
        LikedVideosPage, 
        VideoPage, 
        PlaylistPage, 
        SettingsPage, 
        SupportPage, 
        RedirectToLogin, 
        AdminPage, 
        NotFoundPage,
        TweetsPage,
      } from './Pages'
import { 
        ChannelVideos, 
        ChannelPlaylists, 
        ChannelSubscribed, 
        SettingsPersonal, 
        SettingsChannel, 
        SettingsPassword, 
        ChannelAbout 
      }from './components'
import SearchResultsPage from './Pages/SearchResults.jsx'
import SubscribersPage from './Pages/Subscribers.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={ <App/> }>
      <Route path="" element={ <HomePage/> }/>
      <Route path="login" element={ <LoginPage/> }/>
      <Route path="register" element={ <RegisterPage/> }/>
      <Route path="watch-history" element={ <WatchHistoryPage/> }/>
      <Route path="subscribers" element={ <SubscribersPage/> }/>
      <Route path="admin" element={ <AdminPage/> }/>
      <Route path="tweets" element={ <TweetsPage/> }/>
      <Route path="results" element={ <SearchResultsPage/> }/>   {/*we don't have to mention the query params here in the routes just directly use them in navigate*/}


      <Route path="channel/:username" element={ <ChannelPage/> }>    {/*we only need colon here not anywhere while navigating and fetch*/}
        <Route path="" element={<ChannelVideos />} />
        <Route path="playlists" element={<ChannelPlaylists />}/>
        <Route path="subscribed" element={<ChannelSubscribed />}/>
        <Route path="about" element={<ChannelAbout />}/>
      </Route>

      <Route path="liked-videos" element={ <LikedVideosPage/> }/>
      <Route path="video/:videoId" element={ <VideoPage/> }/>
      <Route path="playlist/:playlistId" element={ <PlaylistPage/> }/>

      <Route path="settings" element={<RedirectToLogin> <SettingsPage/> </RedirectToLogin>}>  {/*redirecting to /login if not logged in*/}
        <Route path="" element={<SettingsPersonal/>} />
        <Route path="change-channel-info" element={<SettingsChannel/>} />
        <Route path="change-password" element={<SettingsPassword/>} />
      </Route>

      <Route path="support" element={<SupportPage/>}/>

      <Route path="*" element={<NotFoundPage/>}/>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  //</React.StrictMode>
)