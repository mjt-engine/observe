export type MaxLengthArray<T> = {
    length: number;
    push: (value: T) => void;
    get: () => T[];
    clear: () => void;
};
export declare const MaxLengthArray: <T>(maxLength: number) => MaxLengthArray<T>;
