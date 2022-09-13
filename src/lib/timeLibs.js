export function secondsToReadable(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60 < 10) ? `0${(seconds % 60).toFixed(2)}` : `${(seconds % 60).toFixed(2)}`;
    return mins + ":" + secs;
}