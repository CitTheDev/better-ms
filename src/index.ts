export enum Timestamps {
    Year = 31_557_600_000,
    Month = 2_592_000_000,
    Week = 604_800_000,
    Day = 86_400_000,
    Hour = 3_600_000,
    Minute = 60_000,
    Second = 1_000
}

/**
 * Format the given string or number to milliseconds
 */
export function ms(value: string | number): Promise<number | undefined> {
    return new Promise((res, rej) => {
        if (typeof value !== "string" && typeof value !== "number") return rej(new TypeError("Value must be a string or number"));
        if (typeof value === "number" && !isFinite(value)) return rej(new TypeError("Value must be a finite number"));
        if (typeof value === "number") value = Math.abs(value) + "ms";

        const matchArray = value.matchAll(/(\d+\.*\d*)\s*(?:years?|yrs?|y|months?|mnth|mth|weeks?|w|days?|d|hours?|min(?:ute)?s?|sec(?:ond)?s?|millisec(?:ond)?s?|msecs?|ms)/gi);
        if (!matchArray) return res(undefined);
        let milliseconds = 0;

        for (const timestamp of matchArray) {
            const match = timestamp[0].match(/(\d+\.*\d*)\s*(years?|yrs?|y|months?|mnth|mth|weeks?|w|days?|d|hours?|min(?:ute)?s?|sec(?:ond)?s?|millisec(?:ond)?s?|msecs|ms)/i);
            if (!match) return;

            const number = parseFloat(match[1]);
            const type = match[2].toLowerCase();

            if (["years", "year", "yrs", "yr", "y"].includes(type)) milliseconds += number * Timestamps.Year;
            if (["months", "month", "mnth", "mth"].includes(type)) milliseconds += number * Timestamps.Month;
            if (["weeks", "week", "w"].includes(type)) milliseconds += number * Timestamps.Week;
            if (["days", "day", "d"].includes(type)) milliseconds += number * Timestamps.Day;
            if (["hours", "hour", "hrs", "hr", "h"].includes(type)) milliseconds += number * Timestamps.Hour;
            if (["minutes", "minute", "mins", "min", "m"].includes(type)) milliseconds += number * Timestamps.Minute;
            if (["seconds", "second", "secs", "sec", "s"].includes(type)) milliseconds += number * Timestamps.Second;
            if (["milliseconds", "millisecond", "msecs", "msec", "ms"].includes(type)) milliseconds += number;
        }

        return res(milliseconds);
    });
}

/**
 * Format a number to long or short
 */
export function format(ms: number, type: "long" | "short"): Promise<string | undefined> {
    return new Promise((res, rej) => {
        if (!["long", "short"].includes(type)) return rej(new TypeError("Type long or short is required"));
        let milliseconds = Math.abs(ms);

        const years = Math.floor(milliseconds / Timestamps.Year);
        if (years) milliseconds -= years * Timestamps.Year;

        const months = Math.floor(milliseconds / Timestamps.Month);
        if (months) milliseconds -= months * Timestamps.Month;

        const weeks = Math.floor(milliseconds / Timestamps.Week);
        if (weeks) milliseconds -= weeks * Timestamps.Week;

        const days = Math.floor(milliseconds / Timestamps.Day);
        if (days) milliseconds -= days * Timestamps.Day;

        const hours = Math.floor(milliseconds / Timestamps.Hour);
        if (hours) milliseconds -= hours * Timestamps.Hour;

        const minutes = Math.floor(milliseconds / Timestamps.Minute);
        if (minutes) milliseconds -= minutes * Timestamps.Minute;

        const seconds = Math.floor(milliseconds / Timestamps.Second);
        if (seconds) milliseconds -= seconds * Timestamps.Second;

        const timestamp = 
            (years > 0 ? (years + (type === "long" ? ` year${years > 1 ? "s" : ""} ` : "y ")) : "") +
            (months > 0 ? (months + (type === "long" ? ` month${months > 1 ? "s" : ""} ` : "mth ")) : "") +
            (weeks > 0 ? (weeks + (type === "long" ? ` week${weeks > 1 ? "s" : ""} ` : "w ")) : "") +
            (days > 0 ? (days + (type === "long" ? ` day${days > 1 ? "s" : ""} ` : "d ")) : "") +
            (hours > 0 ? (hours + (type === "long" ? ` hour${hours > 1 ? "s" : ""} ` : "h ")) : "") +
            (minutes > 0 ? (minutes + (type === "long" ? ` minute${minutes > 1 ? "s" : ""} ` : "m ")) : "") +
            (seconds > 0 ? (seconds + (type === "long" ? ` second${seconds > 1 ? "s" : ""} ` : "s ")) : "") +
            (milliseconds > 0 ? (milliseconds + (type === "long" ? ` millisecond${milliseconds > 1 ? "s" : ""} ` : "ms")) : "");

        return res(timestamp.trim() || undefined);
    });
}