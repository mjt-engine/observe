import { ObserveAgent } from "../agent/ObserveAgent";
import { Timer } from "../agent/Timer";

export type Observe = {
  span: (spanId: string) => Observe;
  counter: (name: string, number?: number) => Observe;
  timer: (name: string) => Timer;
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
    counter: (name: string, count = 1) => {
      agent.getStats(traceId).counter(name, count);
      return mod;
    },
    timer: (name: string) => {
      return agent.getStats(traceId).timer(name);
    },
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
