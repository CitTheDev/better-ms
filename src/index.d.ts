export type FormatOptions = "long" | "short";

declare module "ms" {
    export function convertToMS(value: string | number): Promise<number | undefined>;
    export function format(ms: number, type: FormatOptions): Promise<string | undefined>;
}