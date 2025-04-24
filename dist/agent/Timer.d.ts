export type Timer = {
    end: () => Timer;
    getDuration: () => number;
};
export declare const Timer: () => Timer;
