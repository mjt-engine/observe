const R = (e) => {
  const t = e.split("."), r = t.shift(), n = t.join(".");
  return {
    root: r,
    segments: t,
    subpath: n
  };
}, M = (e) => typeof e == "function", h = (e) => e == null || Number.isNaN(e), w = (e) => !h(e), L = (e) => M(e) ? e() : e, S = (e, t = {}) => {
  const { quiet: r = !1, default: n = void 0, onError: s } = t;
  try {
    return e();
  } catch (u) {
    return r || (console.error(u), w(s) && console.log(L(s))), n;
  }
}, T = {
  isDefined: w,
  isUndefined: h,
  safe: S
}, { isDefined: g, isUndefined: $, safe: x } = T, O = (e, t, r) => {
  if ($(e))
    return;
  const n = t.get(e);
  if (g(n))
    return n;
  if (g(r)) {
    const s = r();
    return t.set(e, s), s;
  }
}, b = () => {
  const e = /* @__PURE__ */ new Map();
  let t = performance.now();
  const r = {
    get: (n, s) => O(n, e, s),
    set: (n, s) => (e.set(n, s), r),
    delete: (n) => e.delete(n),
    entries: () => Array.from(e.entries()),
    clear: () => e.clear(),
    size: () => e.size,
    findKeys: (n) => Array.from(e.entries()).filter(([u, a]) => a === n).map(([u, a]) => u),
    lastUpdate: () => t
  };
  return r;
}, v = {
  create: b
}, y = (e) => (t) => {
  if (typeof e == "string")
    return x(() => new RegExp(e).test(t.traceId), {
      default: !1
    });
  const {
    traceId: r,
    message: n,
    extra: s = () => !0,
    timestamp: u = () => !0
  } = e;
  return !(r && !new RegExp(r).test(t.traceId) || n && !new RegExp(n).test(t.message) || t.timestamp && !u(t.timestamp) || t.extra && !s(t.extra));
}, C = (e) => (t) => {
  for (const r of e)
    if (y(r)(t))
      return r;
  return !1;
}, U = (e) => (t) => typeof e == "string" ? t : e.transform ? e.transform(t) : t, l = (e) => {
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
    end: () => (g(t) || (t = performance.now()), r),
    getDuration: () => (t ?? performance.now()) - e
  };
  return r;
}, A = (e = 100) => {
  let t = 0;
  const r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), u = l(e), a = {
    clear: () => (t = 0, r.clear(), n.clear(), s.clear(), u.clear(), a),
    lastTime: () => u.last(),
    time: () => {
      const o = a.lastTime();
      g(o) && o.end();
      const c = p();
      return u.push(c), c;
    },
    getTimes: () => u.get(),
    timer: (o) => {
      const c = s.get(o) ?? l(e);
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
    getTimers: (o) => (s.get(o) ?? l(e)).get()
  };
  return a;
}, D = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: r = performance,
  maxSampleSize: n = 100
} = {}) => {
  const s = v.create(), u = {
    updateLogMatchers: (a) => {
      const o = a(e);
      return e = o, o;
    },
    getTraceIds: () => s.entries().map(([a]) => a),
    start: (a, ...o) => {
      u.getStats(a).count(), u.getStats(a).time(), u.log({ traceId: a, message: "start", extra: o });
    },
    getStats: (a) => s.get(a, () => A(n)),
    log: ({ traceId: a, message: o, timestamp: c = r.now(), extra: i = [] }) => {
      const m = {
        traceId: a,
        message: o,
        timestamp: c,
        extra: i
      }, d = C(e)(m);
      if (!d)
        return;
      const f = U(d)(m);
      t(
        `${f.timestamp} ${f.traceId}: ${f.message}`,
        ...f.extra ?? []
      );
    },
    end: (a, ...o) => {
      u.getStats(a).lastTime()?.end(), u.log({ traceId: a, message: "end", extra: o });
    }
  };
  return u;
}, N = (e = "", t = D()) => {
  t.start(e);
  const r = {
    span: (n) => N(`${e}.${n}`, t),
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
  N as Observe,
  D as ObserveAgent,
  A as Stats,
  p as Timer,
  R as parseTraceId
};
//# sourceMappingURL=index.js.map
