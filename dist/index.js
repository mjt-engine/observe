const N = (e) => {
  const t = e.split("."), r = t.shift(), n = t.join(".");
  return {
    root: r,
    segments: t,
    subpath: n
  };
}, T = (e) => typeof e == "function", M = (e) => e == null || Number.isNaN(e), L = (e) => !M(e), S = (e) => T(e) ? e() : e, $ = (e, t = {}) => {
  const { quiet: r = !1, default: n = void 0, onError: s } = t;
  try {
    return e();
  } catch (a) {
    return r || (console.error(a), L(s) && console.log(S(s))), n;
  }
}, x = {
  isDefined: L,
  isUndefined: M,
  safe: $
}, { isDefined: i, isUndefined: y, safe: h } = x, O = (e, t, r) => {
  if (y(e))
    return;
  const n = t.get(e);
  if (i(n))
    return n;
  if (i(r)) {
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
    findKeys: (n) => Array.from(e.entries()).filter(([a, u]) => u === n).map(([a, u]) => a),
    lastUpdate: () => t
  };
  return r;
}, C = {
  create: b
}, U = (e) => (t) => {
  if (typeof e == "string" || e instanceof RegExp)
    return l(e, t.traceId);
  const {
    traceId: r,
    message: n,
    extra: s = () => !0,
    timestamp: a = () => !0
  } = e;
  return !(i(r) && !l(r, t.traceId) || i(n) && !l(n, t.message) || i(t.timestamp) && !a(t.timestamp) || i(t.extra) && !s(t.extra));
}, l = (e, t, r = "m") => typeof e == "string" ? h(() => new RegExp(e, r).test(t), {
  default: !1,
  quiet: !0
}) : h(() => e.test(t), {
  default: !1,
  quiet: !0
}), v = (e) => (t) => {
  for (const r of e)
    if (U(r)(t))
      return r;
  return !1;
}, A = (e) => (t) => typeof e == "string" || e instanceof RegExp ? t : e.transform ? e.transform(t) : t, m = (e) => {
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
}, w = () => {
  let e = performance.now(), t;
  const r = {
    end: () => (i(t) || (t = performance.now()), r),
    getDuration: () => (t ?? performance.now()) - e
  };
  return r;
}, D = (e = 100) => {
  let t = 0;
  const r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), a = m(e), u = {
    clear: () => (t = 0, r.clear(), n.clear(), s.clear(), a.clear(), u),
    lastTime: () => a.last(),
    time: () => {
      const o = u.lastTime();
      i(o) && o.end();
      const c = w();
      return a.push(c), c;
    },
    getTimes: () => a.get(),
    timer: (o) => {
      const c = s.get(o) ?? m(e);
      s.set(o, c);
      const f = w();
      return c.push(f), f;
    },
    increment: (o, c = 1) => {
      const f = r.get(o) ?? 0;
      r.set(o, f + c);
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
  return u;
}, R = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: r = performance,
  maxSampleSize: n = 100
} = {}) => {
  const s = C.create(), a = {
    updateLogMatchers: (u) => {
      const o = u(e);
      return e = o, o;
    },
    getTraceIds: () => s.entries().map(([u]) => u),
    start: (u, ...o) => {
      a.getStats(u).count(), a.getStats(u).time(), a.log({ traceId: u, message: "start", extra: o });
    },
    getStats: (u) => s.get(u, () => D(n)),
    log: ({ traceId: u, message: o, timestamp: c = r.now(), extra: f = [] }) => {
      const d = {
        traceId: u,
        message: o,
        timestamp: c,
        extra: f
      }, p = v(e)(d);
      if (!p)
        return;
      const g = A(p)(d);
      t(
        `${g.timestamp} ${g.traceId}: ${g.message}`,
        ...g.extra ?? []
      );
    },
    end: (u, ...o) => {
      a.getStats(u).lastTime()?.end(), a.log({ traceId: u, message: "end", extra: o });
    }
  };
  return a;
}, q = (e = "", t = R()) => {
  t.start(e);
  const r = {
    span: (n) => q(`${e}.${n}`, t),
    increment: (n, s = 1) => (t.getStats(e).increment(n, s), r),
    sample: (n, s, a) => {
      if (Math.random() < n) {
        const u = a();
        r.gauge(s, u);
      }
      return r;
    },
    when: (n, s, a) => {
      if (n()) {
        const u = a();
        r.gauge(s, u);
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
  q as Observe,
  R as ObserveAgent,
  D as Stats,
  w as Timer,
  N as parseTraceId
};
//# sourceMappingURL=index.js.map
