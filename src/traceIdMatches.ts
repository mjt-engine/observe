import { parseTraceId, TraceId } from "./TraceId";

/**
 * '*' is a wildcard that matches any traceId part
 *
 * Example: '*.foo.bar' matches '123.foo.bar' and '456.foo.bar'
 *
 * Example: '123.*.bar' matches '123.456.bar' and '123.789.bar'
 *
 * Example: '123.foo.*' matches '123.foo.bar' and '123.foo.baz'
 */
export const traceIdMatches = (matchers: TraceId[]) => (traceId: TraceId) => {
  if (matchers.length === 0) {
    return false;
  }
  for (const matcher of matchers) {
    if (matcher.startsWith("*")) {
      if (traceId.endsWith(matcher.slice(1))) {
        return true;
      }
    }
    if (matcher.endsWith("*")) {
      if (traceId.startsWith(matcher.slice(0, -1))) {
        return true;
      }
    }
    if (matcher.includes("*")) {
      const before = matcher.split("*")[0];
      const after = matcher.split("*")[1];
      if (traceId.startsWith(before) && traceId.endsWith(after)) {
        return true;
      }
    }

    if (traceId.startsWith(matcher)) {
      return true;
    }
  }
  return false;
};
