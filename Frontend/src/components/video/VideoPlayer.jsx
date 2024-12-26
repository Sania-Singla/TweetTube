export default function VideoPlayer({ videoFile }) {
    return (
        <div className="w-full">
            <video autoPlay controls src={videoFile}></video>
        </div>
    );
}
