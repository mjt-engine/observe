import { TraceId } from "./TraceId";

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
  }
  return false;
};
