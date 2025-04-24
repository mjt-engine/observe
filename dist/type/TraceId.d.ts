export type TraceId<T extends string = string> = `${T}.${string}` | T;
export type ParsedTraceId<T extends string = string> = {
    root: T;
    segments: string[];
    subpath: string;
};
export declare const parseTraceId: <T extends string = string>(subject: TraceId<T>) => ParsedTraceId<T>;
