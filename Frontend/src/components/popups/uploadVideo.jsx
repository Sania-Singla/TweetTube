import { X } from "lucide-react";
import { icons } from "../../assets/icons";
import { useEffect, useRef, useState } from "react";
import adminServices from "../../DBservices/adminServices";

export default function UploadVideoPopup({
    controller,
    setController,
    close,
    setUploadVideoPopup,
    setFileSize,
    setUploadingPopup,
    setVideoUploadedPopup,
}) {
    const [inputs, setInputs] = useState({
        title: "",
        description: "",
        thumbnail: null,
        videoFile: null,
    });

    const [error, setError] = useState({
        root: "",
        title: "",
        description: "",
        thumbnail: "",
        videoFile: "",
    });

    const [disabled, setDisabled] = useState(false);
    const videoFileRef = useRef();

    function handleChange(e) {
        let { value, name, files } = e.target;
        if (name === "videoFile") {
            const file = files[0];
            if (file) {
                const extension = file.name.split(".").pop().toLowerCase();
                const fileSize = file.size / (1024 * 1024);
                const maxSizeMB = 100;
                const allowedExtensions = ["mp4"];
                if (allowedExtensions.includes(extension)) {
                    if (fileSize > maxSizeMB)
                        return setError((prevError) => ({ ...prevError, root: "File is too large, Please upload a file smaller than 100MB." }));
                    setError((prevError) => ({ ...prevError, videoFile: "" }));
                    return setInputs((prevInputs) => ({
                        ...prevInputs,
                        [name]: file,
                    }));
                } else {
                    return setError((prevError) => ({ ...prevError, videoFile: "Invalid file type! Only .mp4 files are accepted" }));
                }
            }
        } else if (name === "thumbnail") {
            const file = files[0];
            if (file) {
                const extension = file.name.split(".").pop().toLowerCase();
                const fileSize = file.size / (1024 * 1024);
                const maxSizeMB = 100;
                const allowedExtensions = ["png", "jpg", "jpeg"];
                if (allowedExtensions.includes(extension)) {
                    if (fileSize > maxSizeMB)
                        return setError((prevError) => ({ ...prevError, root: "File is too large, Please upload a file smaller than 100MB." }));
                    setError((prevError) => ({ ...prevError, thumbnail: "" }));
                    return setInputs((prevInputs) => ({
                        ...prevInputs,
                        [name]: file,
                    }));
                } else {
                    return setError((prevError) => ({ ...prevError, thumbnail: "Only .png .jpg and .jpeg files are accepted" }));
                }
            }
        } else {
            if (value) setError((prevError) => ({ ...prevError, [name]: "" }));
            return setInputs((prevInputs) => ({
                ...prevInputs,
                [name]: value,
            }));
        }
    }

    const handleBlur = (e) => {
        let { name, value, files } = e.target;

        if (name === "title") {
            value ? setError((prevError) => ({ ...prevError, title: "" })) : setError((prevError) => ({ ...prevError, title: "title is required." }));
        }

        if (name === "description") {
            value
                ? setError((prevError) => ({ ...prevError, description: "" }))
                : setError((prevError) => ({ ...prevError, description: "description is required." }));
        } else if (name === "thumbnail") {
            !files[0] && setError((prevError) => ({ ...prevError, thumbnail: "thumbnail is required." }));
        } else if (name === "videoFile") {
            !files[0] && setError((prevError) => ({ ...prevError, videoFile: "videoFile is required." }));
        }
    };

    const handleMouseOver = () => {
        if (
            !inputs.title ||
            !inputs.description ||
            !inputs.videoFile ||
            !inputs.thumbnail ||
            error.root ||
            error.title ||
            error.description ||
            error.thumbnail ||
            error.videoFile
        )
            return setDisabled(true);
        return setDisabled(false);
    };

    async function handleUploadVideo(e) {
        e.preventDefault();
        if (error.root || error.thumbnail || error.videoFile || error.title || error.description) return;
        setUploadVideoPopup(false);
        setUploadingPopup(true);
        setFileSize(inputs.videoFile.size / (1024 * 1024));

        const newController = new AbortController();
        setController(newController);
        const res = await adminServices.uploadVideo(inputs, newController);
        if (res && (res.message === "VIDEODOC_CREATION_DB_ISSUE" || res.message === "VIDEO_UPLOAD_ISSUE")) {
            alert("something went wrong! couln't upload the video please retry after some time.");
            setUploadingPopup(false);
        } else if (res) {
            setUploadingPopup(false);
            setVideoUploadedPopup(true);
        }
    }

    return (
        <div className="bg-[#0e0e0e] border-[0.1rem] border-[#b5b4b4] rounded-md shadow-black shadow-lg w-[600px]">
            <div className="w-full relative border-b-[0.1rem] border-[#b5b4b4]">
                <div className="text-[1.4rem] font-semibold p-2 px-4">Upload Video</div>
                <button onClick={close} className="absolute top-1 right-1">
                    <X size={27} />
                </button>
            </div>

            <form onSubmit={handleUploadVideo} className="w-full p-4">
                {error.root && (
                    <div className="w-full text-center mb-2">
                        <div className="text-red-600 text-md">** {error.root} **</div>
                    </div>
                )}
                <div className="p-6 border-dashed border-[0.1rem] border-[#d4d4d4] w-full flex flex-col items-center justify-center">
                    <div className="p-[10px] bg-[#E4D3FF] overflow-hidden rounded-full">
                        <div className="size-[25px] stroke-[#8871ee] fill-none ">{icons.downloadPopup}</div>
                    </div>
                    <div className="mt-4 text-md font-medium">Select video file to upload</div>
                    <div className="text-[0.9rem] mt-1 font-medium text-[#898989]">Your videos will be public until you un-publish them.</div>
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={(e) => videoFileRef.current.click()}
                            className="bg-[#8871ee] border-[0.01rem] border-transparent hover:border-[#b5b4b4] p-[5px] w-[100px] hover:font-medium text-black text-lg"
                        >
                            Select File
                        </button>
                    </div>
                </div>
                {error.videoFile && (
                    <div>
                        <div className="text-red-600 text-sm mt-1">{error.videoFile}</div>
                    </div>
                )}
                <input
                    ref={videoFileRef}
                    type="file"
                    name="videoFile"
                    id="videoFile"
                    required
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="hidden"
                />

                <div className="mt-2">
                    <div>
                        <div>
                            <label htmlFor="thumbnail">
                                <span className="text-red-600 mr-[2px]">*</span>Thumbnail:
                            </label>
                        </div>
                        <input
                            type="file"
                            name="thumbnail"
                            id="thumbnail"
                            required
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="pt-1 h-10 mt-[3px] w-full indent-3 bg-transparent border-[0.01rem] border-[#b5b4b4] rounded-[5px]"
                        />
                        {error.thumbnail && (
                            <div>
                                <div className="text-red-600 text-sm mt-1">{error.thumbnail}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-2">
                    <div>
                        <div>
                            <label htmlFor="title">
                                <span className="text-red-600 mr-[2px]">*</span>Title:
                            </label>
                        </div>
                        <input
                            type="text"
                            placeholder="Enter the video title"
                            id="title"
                            name="title"
                            required
                            value={inputs.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="h-10 w-full mt-[5px] indent-3 bg-transparent border-[0.01rem] border-[#e8e8e8] rounded-[5px]"
                        />
                        {error.title && (
                            <div>
                                <div className="text-red-600 text-sm mt-1">{error.title}</div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-2">
                    <div>
                        <label htmlFor="description">
                            <span className="text-red-600 mr-[2px]">*</span>Description:
                        </label>
                    </div>
                    <textarea
                        name="description"
                        id="description"
                        required
                        placeholder="Enter the video description"
                        value={inputs.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="w-full pt-[3px] mt-[3px] bg-transparent border-[0.01rem] border-[#b5b4b4] text-[1.05rem] rounded-md indent-2"
                        rows={4}
                    />
                    {error.description && (
                        <div>
                            <div className="text-red-600 text-sm">{error.description}</div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center gap-[20px] mt-6">
                    <div className="hover:bg-[#2a2a2a] w-full text-center  border-[0.01rem] border-[#b5b4b4] text-lg">
                        <button type="button" onClick={close} className="p-2 w-full">
                            Cancel
                        </button>
                    </div>
                    <div className="cursor-pointer hover:font-medium w-full border-transparent text-center border-[0.01rem] hover:border-[#b5b4b4] bg-[#8871ee] text-black text-lg">
                        <button onMouseOver={handleMouseOver} disabled={disabled} type="submit" className="disabled:cursor-not-allowed p-2 w-full">
                            Publish
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
