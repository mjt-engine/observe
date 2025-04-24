export type MaxLengthArray<T> = {
    length: number;
    push: (value: T) => void;
    get: () => T[];
    clear: () => void;
    last: () => T | undefined;
};
export declare const MaxLengthArray: <T>(maxLength: number) => MaxLengthArray<T>;
