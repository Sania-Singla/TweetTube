export function formatDuration(seconds) {
    const pad = (num) => String(num).padStart(2, "0"); //implicit return   //.padStart() string method that pads a string with some other string("0") until in reaches a certain length (2)
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = String(seconds % 60).slice(0, 2);

    return hours > 0 ? `${hours}:${pad(minutes)}:${pad(remainingSeconds)}` : `${pad(minutes)}:${pad(remainingSeconds)}`;
    //or
    // return [
    //     hours > 0 ? hours : null,    //could pad hours too if you want i don't
    //     pad(minutes),
    //     pad(String(remainingSeconds).slice(0,2))
    // ].filter(Boolean).join(":")  //.join() makes a string from array & we can define separator in .join() (default is the comma)
}
