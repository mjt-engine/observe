
export type TraceId<T extends string = string> = `${T}.${string}` | T;

export type ParsedTraceId<T extends string = string> = {
  root: T;
  segments: string[];
  subpath: string;
};

export const parseSubject = <T extends string = string>(
  subject: TraceId<T>
): ParsedTraceId<T> => {
  const segments = subject.split(".");
  const root = segments.shift() as T;
  const subpath = segments.join(".");

  return {
    root,
    segments,
    subpath,
  };
};
