import { TraceId } from "./TraceId";
/**
 * '*' is a wildcard that matches any traceId part
 *
 * Example: '*.foo.bar' matches '123.foo.bar' and '456.foo.bar'
 *
 * Example: '123.*.bar' matches '123.456.bar' and '123.789.bar'
 *
 * Example: '123.foo.*' matches '123.foo.bar' and '123.foo.baz'
 */
export declare const traceIdMatches: (matchers: TraceId[]) => (traceId: TraceId) => boolean;
