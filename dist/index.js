const c = (t) => (e) => {
  if (typeof t == "string")
    return new RegExp(t).test(e.traceId);
  const {
    traceId: s,
    message: r,
    extra: n = () => !0,
    timestamp: o = () => !0
  } = t;
  return !(s && !new RegExp(s).test(e.traceId) || r && !new RegExp(r).test(e.message) || e.timestamp && !o(e.timestamp) || e.extra && !n(e.extra));
}, f = (t) => (e) => {
  for (const s of t)
    if (c(s)(e))
      return !0;
  return !1;
}, d = ({
  logMatchers: t = [],
  logger: e = console.log,
  clock: s = performance
} = {}) => {
  const r = {
    start: (n, ...o) => {
      r.addLog({ traceId: n, message: "start", extra: o });
    },
    addLog: ({ traceId: n, message: o, timestamp: a = s.now(), extra: u = [] }) => {
      f(t)({
        traceId: n,
        message: o,
        timestamp: a,
        extra: u
      }) && e(`${a} ${n}: ${o}`, ...u);
    },
    end: (n, ...o) => {
      r.addLog({ traceId: n, message: "end", extra: o });
    }
  };
  return r;
}, i = (t = "", e = d()) => {
  e.start(t);
  const s = {
    span: (r) => i(`${t}.${r}`, e),
    end: () => (e.end(t), s),
    log: (r, ...n) => (e.addLog({ traceId: t, message: r, extra: n }), s)
  };
  return s;
}, p = (t) => {
  const e = t.split("."), s = e.shift(), r = e.join(".");
  return {
    root: s,
    segments: e,
    subpath: r
  };
};
export {
  i as Observe,
  d as ObserveAgent,
  f as atLeastOneLogMatcherMatchesLogEntry,
  c as logMatcherMatchesLogEntry,
  p as parseTraceId
};
