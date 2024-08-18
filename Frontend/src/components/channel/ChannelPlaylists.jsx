import { useEffect,useState,useCallback,useRef } from 'react'
import { useAuthHook, useChannelHook } from '../../hooks';
import {CreatePlaylistPopup, PlaylistCard,PulsePlaylistCard} from '../index';
import playlistServices from '../../DBservices/playlistServices';
import { icons } from '../../assets/icons';

function ChannelPlaylists() {

  const [loading,setLoading] = useState(true);
  const [playlistsFound,setPlaylistsFound] = useState(true);
  const [playlists,setPlaylists] = useState([]);
  const [PlaylistsInfo,setPlaylistsInfo] = useState({});
  const [page,setPage] = useState(1);
  const channelData = useChannelHook();
  const {userData} = useAuthHook();
  const [createPlaylistPopup,setCreatePlaylistPopup] = useState(false);
  // const [rerender,setRerender] = useState(false);
  
  useEffect(()=>{
    if(page===1 || playlists.length !== PlaylistsInfo.totalPlaylists)
    {
      setLoading(true);
      playlistServices.getUserPlaylists(setPlaylists,setLoading,playlists,setPlaylistsInfo,channelData._id,page,5)
      .then(data=>{
        if(data && data?.length > 0)
        {
          setPlaylistsFound(true); 
        }else setPlaylistsFound(false);
      })
    }
  },[page,channelData])

  const observer = useRef();  
  const callbackRef = useCallback(node=>{
      if(loading) return ;     
      if(observer.current) observer.current.disconnect();     
      observer.current = new IntersectionObserver(entries=>{
          const lastPlaylist = entries[0];
          if(lastPlaylist.isIntersecting && PlaylistsInfo?.hasNextPage) setPage(prev=>prev+1)
      })
      if(node) observer.current.observe(node)
  },[PlaylistsInfo?.hasNextPage])


  const playlistElements = playlists?.map((playlist,index) => {
    if(playlists.length === index+1)
    {
      return  <PlaylistCard 
                key={playlist._id}
                playlist={playlist}      
                reference={callbackRef}
              />
    }
    else {
      return  <PlaylistCard
                key={playlist._id}
                playlist={playlist}
              />
    }
  })

  //pulses
  const pulseEffect = [
    <PulsePlaylistCard key={1}/>,
    <PulsePlaylistCard key={2}/>,
    <PulsePlaylistCard key={3}/>,
    <PulsePlaylistCard key={4}/>,
    <PulsePlaylistCard key={5}/>,
    <PulsePlaylistCard key={6}/>
  ]

  if(!playlistsFound) return (<div>
    {(userData?._id===channelData._id) && <div className='w-full flex justify-center items-center mb-6 mt-6'>
      <button onClick={()=>setCreatePlaylistPopup(true)} className='bg-[#8871ee] flex items-center justify-center text-black p-2 rounded-md  group hover:text-[#8871ee] hover:bg-slate-900 border-[0.01rem] border-transparent hover:border-[#b5b4b4]'>
        <div className='size-[25px] fill-none stroke-black group-hover:stroke-[#8871ee]'>{icons.uploadPlus}</div>
        <div className='text-lg font-medium  ml-2'>New Playlist</div>
      </button>
    </div>}
    <div>no playlists created !</div>
  </div>)
  else return (
    <div className='pt-[8px]'>
      {(userData?._id===channelData._id) && <div className='w-full flex justify-center items-center mb-6 mt-2'>
        <button onClick={()=>setCreatePlaylistPopup(true)} className='bg-[#8871ee] flex items-center justify-center text-black p-2 rounded-md  group hover:text-[#8871ee] hover:bg-slate-900 border-[0.01rem] border-transparent hover:border-[#b5b4b4]'>
          <div className='size-[25px] fill-none stroke-black group-hover:stroke-[#8871ee]'>{icons.uploadPlus}</div>
          <div className='text-lg font-medium  ml-2'>New Playlist</div>
        </button>
      </div>}
      {
        playlists.length > 1 ?   //agr 0 hai toh toh vo idhr ayega hi nhi (returned no videos found !)
        (
          playlists.length > 2 ? 
          <div className='grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-4'>{playlistElements}</div> : //so means equal to 2
          <div className='grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-4 xl:grid-cols-[repeat(3,minmax(320px,1fr))]'>{playlistElements}</div>
        ) :  //means allVideos.length === 1
        (
          <div className='grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-4 md:grid-cols-[repeat(3,minmax(350px,1fr))]'>{playlistElements}</div>
        )
      }
      {
        (loading && page === 1) &&
        <div className='grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4'>{pulseEffect}</div>
      }  

      {
        (loading && page !== 1)  &&
        <div className="flex items-center justify-center my-2">
          <svg aria-hidden="true" className="inline w-7 h-7 animate-spin dark:text-[#b5b4b4] fill-[#8871ee]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className='text-xl ml-3'>Please wait . . .</span>
        </div>
      }
      {
        createPlaylistPopup && 
        <div className="fixed inset-0 p-8 backdrop-blur-lg z-[2000] flex justify-center items-center">
          <CreatePlaylistPopup close={()=>setCreatePlaylistPopup(false)}/>
        </div>
      }
    </div>
  )

}

export default ChannelPlaylists