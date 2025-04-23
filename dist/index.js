const f = (e) => (t) => {
  if (e.length === 0)
    return !1;
  for (const s of e) {
    if (s.startsWith("*") && t.endsWith(s.slice(1)) || s.endsWith("*") && t.startsWith(s.slice(0, -1)))
      return !0;
    if (s.includes("*")) {
      const r = s.split("*")[0], n = s.split("*")[1];
      if (t.startsWith(r) && t.endsWith(n))
        return !0;
    }
    if (t.startsWith(s))
      return !0;
  }
  return !1;
}, a = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: s = performance
} = {}) => {
  const r = {
    start: (n, ...o) => {
      r.addLog({ traceId: n, message: "start", extra: o });
    },
    addLog: ({ traceId: n, message: o, timestamp: i = s.now(), extra: u = [] }) => {
      f(e)(n) && t(`${i} ${n}: ${o}`, ...u);
    },
    end: (n, ...o) => {
      r.addLog({ traceId: n, message: "end", extra: o });
    }
  };
  return r;
}, c = (e = "", t = a()) => {
  t.start(e);
  const s = {
    span: (r) => c(`${e}.${r}`, t),
    end: () => (t.end(e), s),
    log: (r, ...n) => (t.addLog({ traceId: e, message: r, extra: n }), s)
  };
  return s;
}, d = (e) => {
  const t = e.split("."), s = t.shift(), r = t.join(".");
  return {
    root: s,
    segments: t,
    subpath: r
  };
};
export {
  c as Observe,
  a as ObserveAgent,
  d as parseTraceId
};
