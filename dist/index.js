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
}, T = () => {
  const e = /* @__PURE__ */ new Map();
  let t = performance.now();
  const r = {
    get: (n, o) => M(n, e, o),
    set: (n, o) => (e.set(n, o), r),
    delete: (n) => e.delete(n),
    entries: () => Array.from(e.entries()),
    clear: () => e.clear(),
    size: () => e.size,
    findKeys: (n) => Array.from(e.entries()).filter(([a, s]) => s === n).map(([a, s]) => a),
    lastUpdate: () => t
  };
  return r;
}, S = {
  create: T
}, $ = (e) => (t) => {
  if (typeof e == "string")
    return new RegExp(e).test(t.traceId);
  const {
    traceId: r,
    message: n,
    extra: o = () => !0,
    timestamp: a = () => !0
  } = e;
  return !(r && !new RegExp(r).test(t.traceId) || n && !new RegExp(n).test(t.message) || t.timestamp && !a(t.timestamp) || t.extra && !o(t.extra));
}, x = (e) => (t) => {
  for (const r of e)
    if ($(r)(t))
      return r;
  return !1;
}, C = (e) => (t) => typeof e == "string" ? t : e.transform ? e.transform(t) : t, f = (e) => {
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
  const r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), o = f(e), a = {
    lastTime: () => o.last(),
    time: () => {
      const s = a.lastTime();
      g(s) && s.end();
      const c = l();
      return o.push(c), c;
    },
    getTimes: () => o.get(),
    timer: (s) => {
      const c = n.get(s) ?? f(e);
      n.set(s, c);
      const u = l();
      return c.push(u), u;
    },
    counter: (s, c = 1) => {
      const u = r.get(s) ?? 0;
      r.set(s, u + c);
    },
    getCounters: () => new Map(r),
    getCounter: (s) => r.get(s) ?? 0,
    count: (s = 1) => {
      t += s;
    },
    getCount: () => t,
    clearCount: () => (t = 0, a),
    getTimers: (s) => (n.get(s) ?? f(e)).get(),
    clearTimers: (s) => ((n.get(s) ?? f(e)).clear(), a)
  };
  return a;
}, O = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: r = performance
} = {}) => {
  const n = S.create(), o = {
    getTraceIds: () => n.entries().map(([a]) => a),
    start: (a, ...s) => {
      o.getStats(a).count(), o.getStats(a).time(), o.addLog({ traceId: a, message: "start", extra: s });
    },
    getStats: (a) => n.get(a, () => b()),
    addLog: ({ traceId: a, message: s, timestamp: c = r.now(), extra: u = [] }) => {
      const d = {
        traceId: a,
        message: s,
        timestamp: c,
        extra: u
      }, m = x(e)(d);
      if (!m)
        return;
      const i = C(m)(d);
      t(
        `${i.timestamp} ${i.traceId}: ${i.message}`,
        ...i.extra ?? []
      );
    },
    end: (a, ...s) => {
      o.getStats(a).lastTime()?.end(), o.addLog({ traceId: a, message: "end", extra: s });
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
