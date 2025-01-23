import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { playlistServices } from '../../DBservices';
import { X } from 'lucide-react';
import { useAuthHook } from '../../hooks';
import { icons } from '../../assets/icons';
import toast from 'react-hot-toast';

export default function PlaylistPopup({ close }) {
    const [inputs, setInputs] = useState({
        newPlaylist: '', //will add checkbox properties in the useEffect
    });

    const [loading, setLoading] = useState(false);
    const [creatingPlaylistLoading, setCreatingPlaylistLoading] =
        useState(false);
    const [data, setData] = useState([]);
    const { userData } = useAuthHook();
    const { videoId } = useParams();

    //on input change()
    async function handleChange(e) {
        const { value, name, type, checked } = e.target;
        if (type === 'checkbox') {
            console.log(checked);
            const [target] = data.filter((item) => item.name === name);
            console.log(target);
            if (checked) {
                const res = await playlistServices.addVideoToPlaylist(
                    videoId,
                    target._id
                );
                if (res && res.message === 'VIDEO_ADDED_TO_PLAYLIST') {
                    setInputs((prev) => ({
                        ...prev,
                        [name]: checked,
                    }));
                }
            } else {
                const res = await playlistServices.removeVideoFromPlaylist(
                    target._id,
                    videoId
                );
                if (
                    res &&
                    res.message === 'VIDEO_REMOVED_FROM_PLAYLIST_SUCCESSFULLY'
                ) {
                    setInputs((prev) => ({
                        ...prev,
                        [name]: checked,
                    }));
                }
            }
        } else {
            setInputs((prev) => ({
                ...prev,
                newPlaylist: value,
            }));
        }
    }

    useEffect(() => {
        setLoading(true);
        playlistServices.getUserPlaylistsTitles(userData._id).then((res) => {
            if (res) {
                setData(res);
                res.forEach((playlist) => {
                    if (playlist.videos.includes(String(videoId))) {
                        setInputs((prev) => ({
                            ...prev,
                            [playlist.name]: true,
                        }));
                    } else {
                        setInputs((prev) => ({
                            ...prev,
                            [playlist.name]: false,
                        }));
                    }
                });
            }
            setLoading(false);
        });
    }, [userData]);

    //onsubmit()
    async function handleSubmit(e) {
        e.preventDefault();
        setCreatingPlaylistLoading(true);

        const res = await playlistServices.createPlaylist(inputs.newPlaylist);
        if (res) {
            const newRes = await playlistServices.addVideoToPlaylist(
                videoId,
                res._id
            );
            if (newRes) {
                toast.success('Playlist created successfully');
                close();
            }
        }
        setCreatingPlaylistLoading(false);
    }

    const existingPlaylists = data?.map(
        (
            playlist //will get only latest 5
        ) => (
            <li key={playlist._id}>
                <div className="mb-3 flex items-start justify-start gap-4">
                    <div className="pt-[5px]">
                        <input
                            type="checkbox"
                            checked={inputs[playlist.name]}
                            name={playlist.name}
                            id={playlist.name}
                            onChange={handleChange}
                            className="size-4"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor={playlist.name}
                            className="text-md line-clamp-2 leading-6"
                        >
                            {playlist.name}
                        </label>
                    </div>
                </div>
            </li>
        )
    );

    return (
        <div className="relative flex flex-col items-center justify-center bg-[#222222] rounded-xl shadow-black shadow-sm w-[250px] px-4 py-6 border-[0.1rem] border-[black]">
            <div className=" w-full text-center">
                <h2 className="text-[1.3rem] font-bold">Save to playlist</h2>
                <button onClick={close} className="absolute top-1 right-1">
                    <X size={22} />
                </button>
            </div>

            <div className="mt-4">
                {loading && (
                    <div className="w-full text-center">Please wait...</div>
                )}
                <ul>{existingPlaylists}</ul>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col items-start justify-center mt-2 w-full"
            >
                <div className="w-full mt-2">
                    <div>
                        <label htmlFor="newPlaylist">Name</label>
                    </div>
                    <input
                        type="text"
                        name="newPlaylist"
                        id="newPlaylist"
                        value={inputs.newPlaylist}
                        onChange={handleChange}
                        required
                        placeholder="Enter playlist name"
                        className="h-10 w-full mt-[1px] indent-3 placeholder:text-[#d9d9d9] bg-transparent border-[0.01rem] border-[#e8e8e8] rounded-lg"
                    />
                </div>

                <div className="w-full text-center font-semibold mt-4 text-black">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-[68%] px-1 bg-[#8871ee] text-[1rem] h-9 rounded-lg"
                    >
                        {creatingPlaylistLoading ? (
                            <div className="flex items-center justify-center w-full">
                                <div className="size-5 fill-[#8871ee] dark:text-[#b4b7b7]">
                                    {icons.loading}
                                </div>
                            </div>
                        ) : (
                            'Create new playlist'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
