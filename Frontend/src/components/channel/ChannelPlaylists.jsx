import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuthHook, useChannelHook } from '../../hooks';
import { CreatePlaylistPopup, PlaylistCard, PulsePlaylistCard } from '../index';
import { playlistServices } from '../../DBservices';
import { icons } from '../../assets/icons';

export default function ChannelPlaylists() {
    const [loading, setLoading] = useState(true);
    const [playlistsFound, setPlaylistsFound] = useState(true);
    const [playlists, setPlaylists] = useState([]);
    const [PlaylistsInfo, setPlaylistsInfo] = useState({});
    const [page, setPage] = useState(1);
    const channelData = useChannelHook();
    const { userData } = useAuthHook();
    const [createPlaylistPopup, setCreatePlaylistPopup] = useState(false);
    // const [rerender,setRerender] = useState(false);

    useEffect(() => {
        if (page === 1 || playlists.length !== PlaylistsInfo.totalPlaylists) {
            setLoading(true);
            playlistServices
                .getUserPlaylists(
                    setPlaylists,
                    setLoading,
                    playlists,
                    setPlaylistsInfo,
                    channelData?._id,
                    page,
                    5
                )
                .then((data) => {
                    if (data && data?.length > 0) {
                        setPlaylistsFound(true);
                    } else setPlaylistsFound(false);
                });
        }
    }, [page, channelData]);

    const observer = useRef();
    const callbackRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                const lastPlaylist = entries[0];
                if (lastPlaylist.isIntersecting && PlaylistsInfo?.hasNextPage)
                    setPage((prev) => prev + 1);
            });
            if (node) observer.current.observe(node);
        },
        [PlaylistsInfo?.hasNextPage]
    );

    const playlistElements = playlists?.map((playlist, index) => {
        if (playlists.length === index + 1) {
            return (
                <PlaylistCard
                    key={playlist._id}
                    playlist={playlist}
                    reference={callbackRef}
                />
            );
        } else {
            return <PlaylistCard key={playlist?._id} playlist={playlist} />;
        }
    });

    //pulses
    const pulseEffect = [
        <PulsePlaylistCard key={1} />,
        <PulsePlaylistCard key={2} />,
        <PulsePlaylistCard key={3} />,
        <PulsePlaylistCard key={4} />,
        <PulsePlaylistCard key={5} />,
        <PulsePlaylistCard key={6} />,
    ];

    if (!playlistsFound)
        return (
            <div>
                {userData?._id === channelData._id && (
                    <div className="w-full flex justify-center items-center mb-6 mt-6">
                        <button
                            onClick={() => setCreatePlaylistPopup(true)}
                            className="bg-[#8871ee] flex items-center justify-center text-black p-2 rounded-md  group hover:text-[#8871ee] hover:bg-slate-900 border-[0.01rem] border-transparent hover:border-[#b5b4b4]"
                        >
                            <div className="size-[25px] fill-none stroke-black group-hover:stroke-[#8871ee]">
                                {icons.uploadPlus}
                            </div>
                            <div className="text-lg font-medium  ml-2">
                                New Playlist
                            </div>
                        </button>
                    </div>
                )}
                <div>no playlists created !</div>
            </div>
        );
    else
        return (
            <div className="pt-[8px]">
                {userData?._id === channelData?._id && (
                    <div className="w-full flex justify-center items-center mb-6 mt-2">
                        <button
                            onClick={() => setCreatePlaylistPopup(true)}
                            className="bg-[#8871ee] flex items-center justify-center text-black p-2 rounded-md  group hover:text-[#8871ee] hover:bg-slate-900 border-[0.01rem] border-transparent hover:border-[#b5b4b4]"
                        >
                            <div className="size-[25px] fill-none stroke-black group-hover:stroke-[#8871ee]">
                                {icons.uploadPlus}
                            </div>
                            <div className="text-lg font-medium  ml-2">
                                New Playlist
                            </div>
                        </button>
                    </div>
                )}
                {playlists.length > 1 ? ( //agr 0 hai toh toh vo idhr ayega hi nhi (returned no videos found !)
                    playlists.length > 2 ? (
                        <div className="grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-4">
                            {playlistElements}
                        </div> //so means equal to 2
                    ) : (
                        <div className="grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-4 xl:grid-cols-[repeat(3,minmax(320px,1fr))]">
                            {playlistElements}
                        </div>
                    )
                ) : (
                    //means allVideos.length === 1
                    <div className="grid grid-cols-[repeat(auto-fit,_minmax(320px,_1fr))] gap-4 md:grid-cols-[repeat(3,minmax(350px,1fr))]">
                        {playlistElements}
                    </div>
                )}
                {loading && page === 1 && (
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">
                        {pulseEffect}
                    </div>
                )}

                {loading && page !== 1 && (
                    <div className="flex items-center justify-center my-2">
                        <div className="size-7 fill-[#8871ee] dark:text-[#b4b7b7]">
                            {icons.loading}
                        </div>
                        <span className="text-xl ml-3">Please wait...</span>
                    </div>
                )}
                {createPlaylistPopup && (
                    <div className="fixed inset-0 p-8 backdrop-blur-lg z-[2000] flex justify-center items-center">
                        <CreatePlaylistPopup
                            close={() => setCreatePlaylistPopup(false)}
                        />
                    </div>
                )}
            </div>
        );
}

