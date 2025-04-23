import { ObserveAgent } from "./ObserveAgent";

export type Observe = {
  span: (spanId: string) => Observe;
  log: (message: string, ...extra: unknown[]) => Observe;
  end: () => Observe;
};

export const Observe = (
  traceId: string = "",
  agent: ObserveAgent = ObserveAgent()
) => {
  agent.start(traceId);
  const mod: Observe = {
    span: (spanId: string) => Observe(`${traceId}.${spanId}`, agent),
    end: () => {
      agent.end(traceId);
      return mod;
    },
    log: (message: string, ...extra) => {
      agent.addLog({ traceId, message, extra });
      return mod;
    },
  };

  return mod;
};
