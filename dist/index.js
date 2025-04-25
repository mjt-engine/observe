const A = (t) => {
  const e = t.split("."), r = e.shift(), n = e.join(".");
  return {
    root: r,
    segments: e,
    subpath: n
  };
}, h = (t) => t == null || Number.isNaN(t), w = (t) => !h(t), M = {
  isDefined: w,
  isUndefined: h
}, { isDefined: f, isUndefined: S } = M, T = (t, e, r) => {
  if (S(t))
    return;
  const n = e.get(t);
  if (f(n))
    return n;
  if (f(r)) {
    const s = r();
    return e.set(t, s), s;
  }
}, x = () => {
  const t = /* @__PURE__ */ new Map();
  let e = performance.now();
  const r = {
    get: (n, s) => T(n, t, s),
    set: (n, s) => (t.set(n, s), r),
    delete: (n) => t.delete(n),
    entries: () => Array.from(t.entries()),
    clear: () => t.clear(),
    size: () => t.size,
    findKeys: (n) => Array.from(t.entries()).filter(([u, a]) => a === n).map(([u, a]) => u),
    lastUpdate: () => e
  };
  return r;
}, L = {
  create: x
}, $ = (t) => (e) => {
  if (typeof t == "string")
    return new RegExp(t).test(e.traceId);
  const {
    traceId: r,
    message: n,
    extra: s = () => !0,
    timestamp: u = () => !0
  } = t;
  return !(r && !new RegExp(r).test(e.traceId) || n && !new RegExp(n).test(e.message) || e.timestamp && !u(e.timestamp) || e.extra && !s(e.extra));
}, v = (t) => (e) => {
  for (const r of t)
    if ($(r)(e))
      return r;
  return !1;
}, b = (t) => (e) => typeof t == "string" ? e : t.transform ? t.transform(e) : e, m = (t) => {
  const e = [], r = {
    length: 0,
    push: (n) => {
      e.length >= t && e.shift(), e.push(n), r.length = e.length;
    },
    get: () => e,
    clear: () => {
      e.length = 0, r.length = 0;
    },
    last: () => e[e.length - 1]
  };
  return r;
}, p = () => {
  let t = performance.now(), e;
  const r = {
    end: () => (f(e) || (e = performance.now()), r),
    getDuration: () => (e ?? performance.now()) - t
  };
  return r;
}, C = (t = 100) => {
  let e = 0;
  const r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), u = m(t), a = {
    clear: () => (e = 0, r.clear(), n.clear(), s.clear(), u.clear(), a),
    lastTime: () => u.last(),
    time: () => {
      const o = a.lastTime();
      f(o) && o.end();
      const c = p();
      return u.push(c), c;
    },
    getTimes: () => u.get(),
    timer: (o) => {
      const c = s.get(o) ?? m(t);
      s.set(o, c);
      const i = p();
      return c.push(i), i;
    },
    increment: (o, c = 1) => {
      const i = r.get(o) ?? 0;
      r.set(o, i + c);
    },
    gauge: (o, c = 1) => {
      const i = n.get(o) ?? 0;
      n.set(o, i + c);
    },
    getCounters: () => new Map(r),
    getCounter: (o) => r.get(o) ?? 0,
    getGauge: (o) => n.get(o) ?? 0,
    getGauges: () => new Map(n),
    count: (o = 1) => {
      e += o;
    },
    getCount: () => e,
    getTimers: (o) => (s.get(o) ?? m(t)).get()
  };
  return a;
}, O = ({
  logMatchers: t = [],
  logger: e = console.log,
  clock: r = performance,
  maxSampleSize: n = 100
} = {}) => {
  const s = L.create(), u = {
    getTraceIds: () => s.entries().map(([a]) => a),
    start: (a, ...o) => {
      u.getStats(a).count(), u.getStats(a).time(), u.log({ traceId: a, message: "start", extra: o });
    },
    getStats: (a) => s.get(a, () => C(n)),
    log: ({ traceId: a, message: o, timestamp: c = r.now(), extra: i = [] }) => {
      const l = {
        traceId: a,
        message: o,
        timestamp: c,
        extra: i
      }, d = v(t)(l);
      if (!d)
        return;
      const g = b(d)(l);
      e(
        `${g.timestamp} ${g.traceId}: ${g.message}`,
        ...g.extra ?? []
      );
    },
    end: (a, ...o) => {
      u.getStats(a).lastTime()?.end(), u.log({ traceId: a, message: "end", extra: o });
    }
  };
  return u;
}, U = (t = "", e = O()) => {
  e.start(t);
  const r = {
    span: (n) => U(`${t}.${n}`, e),
    increment: (n, s = 1) => (e.getStats(t).increment(n, s), r),
    sample: (n, s, u) => {
      if (Math.random() < n) {
        const a = u();
        r.gauge(s, a);
      }
      return r;
    },
    when: (n, s, u) => {
      if (n()) {
        const a = u();
        r.gauge(s, a);
      }
      return r;
    },
    gauge: (n, s) => (e.getStats(t).gauge(n, s), r),
    timer: (n) => e.getStats(t).timer(n),
    end: () => (e.end(t), r),
    log: (n, ...s) => (e.log({ traceId: t, message: n, extra: s }), r)
  };
  return r;
};
export {
  U as Observe,
  O as ObserveAgent,
  C as Stats,
  p as Timer,
  A as parseTraceId
};
