const d = (s) => (t) => {
  if (s.length === 0)
    return !0;
  for (const e of s)
    if (t.startsWith(e))
      return !0;
  return !1;
}, a = ({
  matchers: s = [],
  logger: t = console.log,
  clock: e = performance
} = {}) => {
  const r = {
    start: (n, ...o) => {
      r.addLog({ traceId: n, message: "start", extra: o });
    },
    addLog: ({ traceId: n, message: o, timestamp: u = e.now(), extra: c = [] }) => {
      d(s)(n) && t(`${u} ${n}: ${o}`, ...c);
    },
    end: (n, ...o) => {
      r.addLog({ traceId: n, message: "end", extra: o });
    }
  };
  return r;
}, f = (s = "", t = a()) => {
  t.start(s);
  const e = {
    span: (r) => f(`${s}.${r}`, t),
    end: () => (t.end(s), e),
    log: (r, ...n) => (t.addLog({ traceId: s, message: r, extra: n }), e)
  };
  return e;
}, g = (s) => {
  const t = s.split("."), e = t.shift(), r = t.join(".");
  return {
    root: e,
    segments: t,
    subpath: r
  };
};
export {
  f as Observe,
  a as ObserveAgent,
  g as parseSubject
};
