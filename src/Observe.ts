import { TraceId } from "./TraceId";

export type Observe = {
  span: (spanName: string) => Observe;
  log: (message: string, ...extra: unknown[]) => Observe;
  end: () => Observe;
};

export type ObserveAgent = {
  start: (traceId: TraceId) => void;
  addLog: (traceId: TraceId, message: string, ...extra: unknown[]) => void;
  end: (traceId: TraceId) => void;
};

export const ObserveAgent = (): ObserveAgent => {
  return {
    start: (traceId: TraceId) => {
      console.log(`Start: ${traceId}`);
    },
    addLog: (traceId: TraceId, message: string, ...extra: unknown[]) => {
      console.log(`${traceId}: ${message}`, ...extra);
    },
    end: (traceId: TraceId) => {
      console.log(`End: ${traceId}`);
    },
  };
};

export const Observe = (name: string, agent: ObserveAgent = ObserveAgent()) => {
  agent.start(name);
  const mod: Observe = {
    span: (spanName: string) => Observe(`${name}.${spanName}`, agent),
    end: () => {
      agent.end(name);
      return mod;
    },
    log: (message: string, ...extra) => {
      agent.addLog(`${name}`, message, ...extra);
      return mod;
      // const logMessage = `${name}: ${message}`;
      // if (parent) {
      //   parent.log(logMessage);
      // } else {
      //   console.log(logMessage);
      // }
    },
  };

  return mod;
};
