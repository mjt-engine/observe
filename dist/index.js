const A = (e) => {
  const t = e.split("."), r = t.shift(), n = t.join(".");
  return {
    root: r,
    segments: t,
    subpath: n
  };
}, h = (e) => e == null || Number.isNaN(e), w = (e) => !h(e), M = {
  isDefined: w,
  isUndefined: h
}, { isDefined: f, isUndefined: L } = M, S = (e, t, r) => {
  if (L(e))
    return;
  const n = t.get(e);
  if (f(n))
    return n;
  if (f(r)) {
    const s = r();
    return t.set(e, s), s;
  }
}, T = () => {
  const e = /* @__PURE__ */ new Map();
  let t = performance.now();
  const r = {
    get: (n, s) => S(n, e, s),
    set: (n, s) => (e.set(n, s), r),
    delete: (n) => e.delete(n),
    entries: () => Array.from(e.entries()),
    clear: () => e.clear(),
    size: () => e.size,
    findKeys: (n) => Array.from(e.entries()).filter(([u, a]) => a === n).map(([u, a]) => u),
    lastUpdate: () => t
  };
  return r;
}, x = {
  create: T
}, $ = (e) => (t) => {
  if (typeof e == "string")
    return new RegExp(e).test(t.traceId);
  const {
    traceId: r,
    message: n,
    extra: s = () => !0,
    timestamp: u = () => !0
  } = e;
  return !(r && !new RegExp(r).test(t.traceId) || n && !new RegExp(n).test(t.message) || t.timestamp && !u(t.timestamp) || t.extra && !s(t.extra));
}, v = (e) => (t) => {
  for (const r of e)
    if ($(r)(t))
      return r;
  return !1;
}, b = (e) => (t) => typeof e == "string" ? t : e.transform ? e.transform(t) : t, m = (e) => {
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
}, p = () => {
  let e = performance.now(), t;
  const r = {
    end: () => (f(t) || (t = performance.now()), r),
    getDuration: () => (t ?? performance.now()) - e
  };
  return r;
}, C = (e = 100) => {
  let t = 0;
  const r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), u = m(e), a = {
    clear: () => (t = 0, r.clear(), n.clear(), s.clear(), u.clear(), a),
    lastTime: () => u.last(),
    time: () => {
      const o = a.lastTime();
      f(o) && o.end();
      const c = p();
      return u.push(c), c;
    },
    getTimes: () => u.get(),
    timer: (o) => {
      const c = s.get(o) ?? m(e);
      s.set(o, c);
      const i = p();
      return c.push(i), i;
    },
    increment: (o, c = 1) => {
      const i = r.get(o) ?? 0;
      r.set(o, i + c);
    },
    gauge: (o, c = 0) => {
      n.set(o, c);
    },
    getCounters: () => new Map(r),
    getCounter: (o) => r.get(o) ?? 0,
    getGauge: (o) => n.get(o) ?? 0,
    getGauges: () => new Map(n),
    count: (o = 1) => {
      t += o;
    },
    getCount: () => t,
    getTimers: (o) => (s.get(o) ?? m(e)).get()
  };
  return a;
}, O = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: r = performance,
  maxSampleSize: n = 100
} = {}) => {
  const s = x.create(), u = {
    updateLogMatchers: (a) => {
      const o = a(e);
      return e = o, o;
    },
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
      }, d = v(e)(l);
      if (!d)
        return;
      const g = b(d)(l);
      t(
        `${g.timestamp} ${g.traceId}: ${g.message}`,
        ...g.extra ?? []
      );
    },
    end: (a, ...o) => {
      u.getStats(a).lastTime()?.end(), u.log({ traceId: a, message: "end", extra: o });
    }
  };
  return u;
}, U = (e = "", t = O()) => {
  t.start(e);
  const r = {
    span: (n) => U(`${e}.${n}`, t),
    increment: (n, s = 1) => (t.getStats(e).increment(n, s), r),
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
    gauge: (n, s) => (t.getStats(e).gauge(n, s), r),
    timer: (n) => t.getStats(e).timer(n),
    end: () => (t.end(e), r),
    log: (n, ...s) => (t.log({ traceId: e, message: n, extra: s }), r)
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
