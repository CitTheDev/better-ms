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
export function ms(value: string | number): number | undefined {
    if (typeof value !== "string" && typeof value !== "number") throw new TypeError("Value must be a string or number");
    if (typeof value === "number" && !isFinite(value)) throw new TypeError("Value must be a finite number");
    if (typeof value === "number") value = Math.abs(value) + "ms";

    const matchArray = value.matchAll(/(\d+\.*\d*)\s*(?:years?|yrs?|y|months?|mnth|mth|weeks?|w|days?|d|hours?|min(?:ute)?s?|sec(?:ond)?s?|millisec(?:ond)?s?|msecs?|ms)/gi);
    if (!matchArray) return undefined;
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

    return milliseconds;
}

/**
 * Format a number to long or short
 */
export function format(ms: number, type: "long" | "short"): string | undefined {
    if (!["long", "short"].includes(type)) throw new TypeError("Type \"long\" or \"short\" is required");
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
        (years <= 0 ? "" : years + (type === "long" ? ` year${pluralChecker(years)} ` : "y ")) +
        (months <= 0 ? "" : months + (type === "long" ? ` month${pluralChecker(months)} ` : "mth ")) +
        (weeks <= 0 ? "" : weeks + (type === "long" ? ` week${pluralChecker(weeks)} ` : "w ")) +
        (days <= 0 ? "" : days + (type === "long" ? ` day${pluralChecker(days)} ` : "d ")) +
        (hours <= 0 ? "" : hours + (type === "long" ? ` hour${pluralChecker(hours)} ` : "h ")) +
        (minutes <= 0 ? "" : minutes + (type === "long" ? ` minute${pluralChecker(minutes)} ` : "m ")) +
        (seconds <= 0 ? "" : seconds + (type === "long" ? ` second${pluralChecker(seconds)} ` : "s ")) +
        (milliseconds <= 0 ? "" : milliseconds + (type === "long" ? ` millisecond${pluralChecker(milliseconds)} ` : "ms"));

    return timestamp.trim() || undefined;
}

const pluralChecker = (amount: number): "s" | "" => amount > 1 ? "s" : "";