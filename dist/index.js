const e = () => ({
  start: (o) => {
    console.log(`Start: ${o}`);
  },
  addLog: (o, t, ...s) => {
    console.log(`${o}: ${t}`, ...s);
  },
  end: (o) => {
    console.log(`End: ${o}`);
  }
}), c = (o, t = e()) => {
  t.start(o);
  const s = {
    span: (r) => c(`${o}.${r}`, t),
    end: () => (t.end(o), s),
    log: (r, ...n) => (t.addLog(`${o}`, r, ...n), s)
  };
  return s;
}, d = (o) => {
  const t = o.split("."), s = t.shift(), r = t.join(".");
  return {
    root: s,
    segments: t,
    subpath: r
  };
};
export {
  c as Observe,
  e as ObserveAgent,
  d as parseSubject
};
