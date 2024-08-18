
export default function VideoPlayer({videoFile}) {
    console.log(videoFile)
  return (
    <div className="w-full">
      <video autoPlay controls src={videoFile}></video>       
    </div>
  )
}
