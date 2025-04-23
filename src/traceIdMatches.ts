import { parseTraceId, TraceId } from "./TraceId";

export const traceIdMatches = (matchers: string[]) => (traceId: TraceId) => {
  if (matchers.length === 0) {
    return false;
  }
  const regexps = matchers.map((matcher) => {
    return new RegExp(matcher);
  });
  for (const r of regexps) {
    if (r.test(traceId)) {
      return true;
    }
    // if (matcher.startsWith("*")) {
    //   if (traceId.endsWith(matcher.slice(1))) {
    //     return true;
    //   }
    // }
    // if (matcher.endsWith("*")) {
    //   if (traceId.startsWith(matcher.slice(0, -1))) {
    //     return true;
    //   }
    // }
    // if (matcher.includes("*")) {
    //   const before = matcher.split("*")[0];
    //   const after = matcher.split("*")[1];
    //   if (traceId.startsWith(before) && traceId.endsWith(after)) {
    //     return true;
    //   }
    // }

    // if (traceId.startsWith(matcher)) {
    //   return true;
    // }
  }
  return false;
};
