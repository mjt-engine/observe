import { isDefined } from "@mjt-engine/object";

export type Timer = {
  end: () => Timer;
  getDuration: () => number;
};

export const Timer = (): Timer => {
  let start = performance.now();
  let end: number | undefined;
  const mod: Timer = {
    end: () => {
      if (isDefined(end)) {
        return mod;
      }
      end = performance.now();
      return mod;
    },
    getDuration: () => {
      return (end ?? performance.now()) - start;
    },
  };
  return mod;
};
