const a = (t) => (s) => {
  if (t.length === 0)
    return !1;
  const n = t.map((e) => new RegExp(e));
  for (const e of n)
    if (e.test(s))
      return !0;
  return !1;
}, c = ({
  logMatchers: t = [],
  logger: s = console.log,
  clock: n = performance
} = {}) => {
  const e = {
    start: (r, ...o) => {
      e.addLog({ traceId: r, message: "start", extra: o });
    },
    addLog: ({ traceId: r, message: o, timestamp: d = n.now(), extra: u = [] }) => {
      a(t)(r) && s(`${d} ${r}: ${o}`, ...u);
    },
    end: (r, ...o) => {
      e.addLog({ traceId: r, message: "end", extra: o });
    }
  };
  return e;
}, g = (t = "", s = c()) => {
  s.start(t);
  const n = {
    span: (e) => g(`${t}.${e}`, s),
    end: () => (s.end(t), n),
    log: (e, ...r) => (s.addLog({ traceId: t, message: e, extra: r }), n)
  };
  return n;
}, f = (t) => {
  const s = t.split("."), n = s.shift(), e = s.join(".");
  return {
    root: n,
    segments: s,
    subpath: e
  };
};
export {
  g as Observe,
  c as ObserveAgent,
  f as parseTraceId
};
