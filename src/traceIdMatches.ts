import { TraceId } from "./TraceId";


export const traceIdMatches = (matchers: TraceId[]) => (traceId: TraceId) => {
  if (matchers.length === 0) {
    return true;
  }
  for (const matcher of matchers) {
    if (traceId.startsWith(matcher)) {
      return true;
    }
  }
  return false;
};
