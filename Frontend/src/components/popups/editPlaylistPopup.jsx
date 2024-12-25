import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import playlistServices from '../../DBservices/playlistServices';

export default function EditPlaylistPopup({ close, setRerender, playlist }) {
    const [inputs, setInputs] = useState({
        name: '',
        description: '',
    });

    const [error, setError] = useState({
        name: '',
    });

    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setInputs({
            name: playlist.name,
            description: playlist.description,
        });
    }, []);

    function handleChange(e) {
        let { value, name } = e.target;
        if (value) setError((prevError) => ({ ...prevError, [name]: '' }));
        return setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    }

    const handleBlur = (e) => {
        let { name, value } = e.target;
        if (name === 'name') {
            value
                ? setError((prevError) => ({ ...prevError, name: '' }))
                : setError((prevError) => ({
                      ...prevError,
                      name: 'name is required.',
                  }));
        }
    };

    const handleMouseOver = () => {
        if (!inputs.name || error.name) return setDisabled(true);
        return setDisabled(false);
    };

    async function handleUpdatePlaylist(e) {
        e.preventDefault();
        if (error.name) return;
        const res = await playlistServices.editPlaylist(playlist._id, inputs);
        if (res && res.message === 'PLAYLIST_UPDATED_SUCCESSFULLY') {
            setRerender((prev) => !prev);
            return close();
        }
    }

    return (
        <div className="bg-[#0e0e0e] border-[0.1rem] border-[#b5b4b4] rounded-md shadow-black shadow-lg w-[500px]">
            <div className="w-full relative border-b-[0.1rem] border-[#b5b4b4]">
                <div className="text-[1.4rem] font-semibold p-2 px-4">
                    Edit Playlist
                </div>
                <button onClick={close} className="absolute top-1 right-1">
                    <X size={27} />
                </button>
            </div>

            <form onSubmit={handleUpdatePlaylist} className="w-full p-4">
                <div className="mt-2">
                    <div>
                        <div>
                            <label htmlFor="name">
                                <span className="text-red-600 mr-[2px]">*</span>
                                Name:
                            </label>
                        </div>
                        <input
                            type="text"
                            placeholder="Enter the playlist name"
                            id="name"
                            name="name"
                            required
                            value={inputs.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="h-10 w-full mt-[5px] indent-3 bg-transparent border-[0.01rem] border-[#e8e8e8] rounded-[5px]"
                        />
                        {error.name && (
                            <div>
                                <div className="text-red-600 text-sm">
                                    {error.name}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-2">
                    <div>
                        <label htmlFor="description">Description:</label>
                    </div>
                    <textarea
                        name="description"
                        id="description"
                        placeholder="Enter the playlist description"
                        value={inputs.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full pt-[3px] mt-[3px] bg-transparent border-[0.01rem] border-[#b5b4b4] text-[1.05rem] rounded-md indent-2"
                        rows={4}
                    />
                </div>

                <div className="flex items-center justify-center gap-[20px] mt-4">
                    <div className="hover:bg-[#2a2a2a] w-full text-center  border-[0.01rem] border-[#b5b4b4] text-lg">
                        <button
                            type="button"
                            onClick={close}
                            className="p-2 w-full"
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="cursor-pointer hover:font-medium w-full border-transparent text-center border-[0.01rem] hover:border-[#b5b4b4] bg-[#8871ee] text-black text-lg">
                        <button
                            onMouseOver={handleMouseOver}
                            disabled={disabled}
                            type="submit"
                            className="disabled:cursor-not-allowed p-2 w-full"
                        >
                            Update
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
