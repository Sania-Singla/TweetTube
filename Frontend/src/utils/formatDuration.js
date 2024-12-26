/**
 * Format a duration in seconds into a human-readable string
 * @param {number} seconds - Total seconds to format
 * @returns {string} - the formatted duration in hh:mm:ss format
 */

export function formatDuration(seconds) {
    const pad = (num) => String(num).padStart(2, '0');
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = String(seconds % 60).slice(0, 2);

    return hours > 0
        ? `${hours}:${pad(minutes)}:${pad(remainingSeconds)}`
        : `${pad(minutes)}:${pad(remainingSeconds)}`;
}
