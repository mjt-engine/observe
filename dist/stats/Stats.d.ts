import { Stat } from "./type/Stat";
export declare const pushName: (name: string) => boolean;
export declare const popName: () => void;
export declare const pushPopName: <T>(name: string, producer: () => T) => T;
export declare const count: (name: string) => number | undefined;
export declare const enable: (enabled?: boolean) => void;
export declare const Stats: {
    sumAdd: (name: string, value: number) => void;
    sumSubtract: (name: string, value: number) => void;
    names: () => string[];
    add: (value: number, options?: Partial<{
        maxSamples: number;
    }>) => void;
    set: (name: string, value: number) => void;
    avg: (name: string) => number | undefined;
    sum: (name: string) => number;
    clear: (name?: string) => void;
    time: <T>(name: string, f: () => T, options?: Partial<{
        maxSamples: number;
    }>) => T;
    get: (name: string) => Stat | undefined;
    count: (name: string) => number | undefined;
    pushName: (name: string) => boolean;
    popName: () => void;
    logStats: (log?: (message: unknown) => void) => void;
    enable: (enabled?: boolean) => void;
};
