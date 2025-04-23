const i = (t) => (e) => {
  if (typeof t == "string")
    return new RegExp(t).test(e.traceId);
  const {
    traceId: r,
    message: s,
    extra: n = () => !0,
    timestamp: o = () => !0
  } = t;
  return !(r && !new RegExp(r).test(e.traceId) || s && !new RegExp(s).test(e.message) || e.timestamp && !o(e.timestamp) || e.extra && !n(e.extra));
}, d = (t) => (e) => {
  for (const r of t)
    if (i(r)(e))
      return r;
  return !1;
}, p = (t) => (e) => typeof t == "string" ? e : t.transform ? t.transform(e) : e, g = ({
  logMatchers: t = [],
  logger: e = console.log,
  clock: r = performance
} = {}) => {
  const s = {
    start: (n, ...o) => {
      s.addLog({ traceId: n, message: "start", extra: o });
    },
    addLog: ({ traceId: n, message: o, timestamp: u = r.now(), extra: m = [] }) => {
      const f = {
        traceId: n,
        message: o,
        timestamp: u,
        extra: m
      }, c = d(t)(f);
      if (!c)
        return;
      const a = p(c)(f);
      e(
        `${a.timestamp} ${a.traceId}: ${a.message}`,
        ...a.extra ?? []
      );
    },
    end: (n, ...o) => {
      s.addLog({ traceId: n, message: "end", extra: o });
    }
  };
  return s;
}, L = (t = "", e = g()) => {
  e.start(t);
  const r = {
    span: (s) => L(`${t}.${s}`, e),
    end: () => (e.end(t), r),
    log: (s, ...n) => (e.addLog({ traceId: t, message: s, extra: n }), r)
  };
  return r;
}, x = (t) => {
  const e = t.split("."), r = e.shift(), s = e.join(".");
  return {
    root: r,
    segments: e,
    subpath: s
  };
};
export {
  L as Observe,
  g as ObserveAgent,
  d as atLeastOneLogMatcherMatchesLogEntry,
  i as logMatcherMatchesLogEntry,
  x as parseTraceId,
  p as transformLogEntry
};
