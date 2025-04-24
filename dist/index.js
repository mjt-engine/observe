const p = (e) => e == null || Number.isNaN(e), h = (e) => !p(e), w = {
  isDefined: h,
  isUndefined: p
}, { isDefined: g, isUndefined: L } = w, M = (e, t, r) => {
  if (L(e))
    return;
  const n = t.get(e);
  if (g(n))
    return n;
  if (g(r)) {
    const o = r();
    return t.set(e, o), o;
  }
}, $ = () => {
  const e = /* @__PURE__ */ new Map();
  let t = performance.now();
  const r = {
    get: (n, o) => M(n, e, o),
    set: (n, o) => (e.set(n, o), r),
    delete: (n) => e.delete(n),
    entries: () => Array.from(e.entries()),
    clear: () => e.clear(),
    size: () => e.size,
    findKeys: (n) => Array.from(e.entries()).filter(([c, s]) => s === n).map(([c, s]) => c),
    lastUpdate: () => t
  };
  return r;
}, x = {
  create: $
}, C = (e) => (t) => {
  if (typeof e == "string")
    return new RegExp(e).test(t.traceId);
  const {
    traceId: r,
    message: n,
    extra: o = () => !0,
    timestamp: c = () => !0
  } = e;
  return !(r && !new RegExp(r).test(t.traceId) || n && !new RegExp(n).test(t.message) || t.timestamp && !c(t.timestamp) || t.extra && !o(t.extra));
}, S = (e) => (t) => {
  for (const r of e)
    if (C(r)(t))
      return r;
  return !1;
}, T = (e) => (t) => typeof e == "string" ? t : e.transform ? e.transform(t) : t, f = (e) => {
  const t = [], r = {
    length: 0,
    push: (n) => {
      t.length >= e && t.shift(), t.push(n), r.length = t.length;
    },
    get: () => t,
    clear: () => {
      t.length = 0, r.length = 0;
    },
    last: () => t[t.length - 1]
  };
  return r;
}, l = () => {
  let e = performance.now(), t;
  const r = {
    end: () => (g(t) || (t = performance.now()), r),
    getDuration: () => (t ?? performance.now()) - e
  };
  return r;
}, b = (e = 100) => {
  let t = 0;
  const r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), o = f(e), c = {
    time: () => {
      const s = o.last();
      g(s) && s.end();
      const u = l();
      return o.push(u), u;
    },
    getTimes: () => o.get(),
    timer: (s) => {
      const u = n.get(s) ?? f(e);
      n.set(s, u);
      const a = l();
      return u.push(a), a;
    },
    counter: (s, u = 1) => {
      const a = r.get(s) ?? 0;
      r.set(s, a + u);
    },
    getCounters: () => new Map(r),
    getCounter: (s) => r.get(s) ?? 0,
    count: (s = 1) => {
      t += s;
    },
    getCount: () => t,
    clearCount: () => (t = 0, c),
    getTimers: (s) => (n.get(s) ?? f(e)).get(),
    clearTimers: (s) => ((n.get(s) ?? f(e)).clear(), c)
  };
  return c;
}, O = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: r = performance
} = {}) => {
  const n = x.create(), o = {
    getTraceIds: () => n.entries().map(([c]) => c),
    start: (c, ...s) => {
      o.getStats(c).count(), o.getStats(c).time(), o.addLog({ traceId: c, message: "start", extra: s });
    },
    getStats: (c) => n.get(c, () => b()),
    addLog: ({ traceId: c, message: s, timestamp: u = r.now(), extra: a = [] }) => {
      const d = {
        traceId: c,
        message: s,
        timestamp: u,
        extra: a
      }, m = S(e)(d);
      if (!m)
        return;
      const i = T(m)(d);
      t(
        `${i.timestamp} ${i.traceId}: ${i.message}`,
        ...i.extra ?? []
      );
    },
    end: (c, ...s) => {
      o.addLog({ traceId: c, message: "end", extra: s });
    }
  };
  return o;
}, U = (e = "", t = O()) => {
  t.start(e);
  const r = {
    span: (n) => U(`${e}.${n}`, t),
    counter: (n, o = 1) => (t.getStats(e).counter(n, o), r),
    timer: (n) => t.getStats(e).timer(n),
    end: () => (t.end(e), r),
    log: (n, ...o) => (t.addLog({ traceId: e, message: n, extra: o }), r)
  };
  return r;
}, v = (e) => {
  const t = e.split("."), r = t.shift(), n = t.join(".");
  return {
    root: r,
    segments: t,
    subpath: n
  };
};
export {
  U as Observe,
  O as ObserveAgent,
  v as parseTraceId
};
