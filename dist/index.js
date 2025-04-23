const n = () => ({
  start: (o) => {
    console.log(`Start: ${o}`);
  },
  addLog: (o, r, ...t) => {
    console.log(`${o}: ${r}`, ...t);
  },
  end: (o) => {
    console.log(`End: ${o}`);
  }
}), d = (o, r = n()) => {
  r.start(o);
  const t = {
    span: (s) => d(`${o}.${s}`, r),
    end: () => (r.end(o), t),
    log: (s, ...e) => (r.addLog(`${o}`, s, ...e), t)
  };
  return t;
};
export {
  d as Observe,
  n as ObserveAgent
};
