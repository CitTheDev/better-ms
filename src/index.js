const year = 31_557_600_000;
const month = 2_592_000_000;
const week = 604_800_000;
const day = 86_400_000;
const hour = 3_600_000;
const minute = 60_000;
const second = 1_000;

/**
 * Format the given string or number to milliseconds
 * @param {string | number} value 
 * @returns {Promise<number | undefined>}
 */
export function convertToMS(value) {
    return new Promise((res, rej) => {
        if (typeof value !== "string" && typeof value !== "number") return rej(new TypeError("Value must be a string or number"));
        if (typeof value === "number" && !isFinite(value)) return rej(new TypeError("Value must be a finite number"));
        if (typeof value === "number") value = Math.abs(value) + "ms";

        const matchArray = value.matchAll(/\d+\.*\d*\s*(?:years?|yrs?|y|months?|mnth|mth|weeks?|w|days?|d|hours?|min(?:ute)?s?|sec(?:ond)?s?|millisec(?:ond)?s?|msecs?|ms)/gi);
        if (!matchArray) return res(undefined);
        let milliseconds = 0;

        for (const timestamp of matchArray) {
            const match = timestamp[0].match(/(\d+\.*\d*)\s*(years?|yrs?|y|months?|mnth|mth|weeks?|w|days?|d|hours?|min(?:ute)?s?|sec(?:ond)?s?|millisec(?:ond)?s?|msecs|ms)/i);
            if (!match) return;

            const number = parseFloat(match[1]);
            const type = match[2].toLowerCase();

            if (["years", "year", "yrs", "yr", "y"].includes(type)) milliseconds += number * year;
            if (["months", "month", "mnth", "mth"].includes(type)) milliseconds += number * month;
            if (["weeks", "week", "w"].includes(type)) milliseconds += number * week;
            if (["days", "day", "d"].includes(type)) milliseconds += number * day;
            if (["hours", "hour", "hrs", "hr", "h"].includes(type)) milliseconds += number * hour;
            if (["minutes", "minute", "mins", "min", "m"].includes(type)) milliseconds += number * minute;
            if (["seconds", "second", "secs", "sec", "s"].includes(type)) milliseconds += number * second;
            if (["milliseconds", "millisecond", "msecs", "msec", "ms"].includes(type)) milliseconds += number;
        }

        return res(milliseconds);
    });
}

/**
 * Format a number to long or short
 * @param {number} ms
 * @param {"long" | "short"} type
 * @returns {Promise<string | undefined>}
 */
export function format(ms, type) {
    return new Promise((res, rej) => {
        if (!["long", "short"].includes(type)) return rej(new TypeError("Type long or short is required"));
        let milliseconds = Math.abs(ms);

        const years = Math.floor(milliseconds / year);
        if (years) milliseconds -= years * year;

        const months = Math.floor(milliseconds / month);
        if (months) milliseconds -= months * month;

        const weeks = Math.floor(milliseconds / week);
        if (weeks) milliseconds -= weeks * week;

        const days = Math.floor(milliseconds / day);
        if (days) milliseconds -= days * day;

        const hours = Math.floor(milliseconds / hour);
        if (hours) milliseconds -= hours * hour;

        const minutes = Math.floor(milliseconds / minute);
        if (minutes) milliseconds -= minutes * minute;

        const seconds = Math.floor(milliseconds / second);
        if (seconds) milliseconds -= seconds * second;

        const timestamp = 
            (years > 0 ? (type === "long" ? `${years} year${years > 1 ? "s" : ""} ` : `${years}y `) : "") +
            (months > 0 ? (type === "long" ? `${months} month${months > 1 ? "s" : ""} ` : `${months}mth `) : "") +
            (weeks > 0 ? (type === "long" ? `${weeks} week${weeks > 1 ? "s" : ""} ` : `${weeks}w `) : "") +
            (days > 0 ? (type === "long" ? `${days} day${days > 1 ? "s" : ""} ` : `${days}d `) : "") +
            (hours > 0 ? (type === "long" ? `${hours} hour${hours > 1 ? "s" : ""} ` : `${hours}h `) : "") +
            (minutes > 0 ? (type === "long" ? `${minutes} minute${minutes > 1 ? "s" : ""} ` : `${minutes}m `) : "") +
            (seconds > 0 ? (type === "long" ? `${seconds} second${seconds > 1 ? "s" : ""} ` : `${seconds}s `) : "") +
            (milliseconds > 0 ? (type === "long" ? `${milliseconds} millisecond${milliseconds > 1 ? "s" : ""} ` : `${milliseconds}ms `) : "");

        return res(timestamp.trim() || undefined);
    });
}