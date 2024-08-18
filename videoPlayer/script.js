const playPauseBtn = document.querySelector(".play-pause-btn");
const videoControlsContainer = document.querySelector(".video-controls-container");
const video = document.querySelector("video");

playPauseBtn.addEventListener("click",()=>{
    video.paused ? video.play() : video.pause();
})

video.addEventListener("play",()=>{
    videoControlsContainer.classList.remove("paused");
})

video.addEventListener("paused",()=>{
    videoControlsContainer.classList.add("paused");
})

