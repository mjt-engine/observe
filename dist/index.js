const E = (e) => {
  const t = e.split("."), n = t.shift(), r = t.join(".");
  return {
    root: n,
    segments: t,
    subpath: r
  };
}, T = (e) => typeof e == "function", M = (e) => e == null || Number.isNaN(e), L = (e) => !M(e), y = (e) => T(e) ? e() : e, S = (e, t = {}) => {
  const { quiet: n = !1, default: r = void 0, onError: s } = t;
  try {
    return e();
  } catch (a) {
    return n || (console.error(a), L(s) && console.log(y(s))), r;
  }
}, $ = {
  isDefined: L,
  isUndefined: M,
  safe: S
}, { isDefined: i, isUndefined: O, safe: h } = $, b = (e, t, n) => {
  if (O(e))
    return;
  const r = t.get(e);
  if (i(r))
    return r;
  if (i(n)) {
    const s = n();
    return t.set(e, s), s;
  }
}, x = () => {
  const e = /* @__PURE__ */ new Map();
  let t = performance.now();
  const n = {
    get: (r, s) => b(r, e, s),
    set: (r, s) => (e.set(r, s), n),
    delete: (r) => e.delete(r),
    entries: () => Array.from(e.entries()),
    clear: () => e.clear(),
    size: () => e.size,
    findKeys: (r) => Array.from(e.entries()).filter(([a, u]) => u === r).map(([a, u]) => a),
    lastUpdate: () => t
  };
  return n;
}, C = {
  create: x
}, U = (e) => (t) => {
  if (typeof e == "string" || e instanceof RegExp)
    return l(e, t.traceId);
  const {
    traceId: n,
    message: r,
    extra: s,
    timestamp: a
  } = e;
  return !(i(n) && !l(n, t.traceId) || i(r) && !l(r, t.message) || i(a) && !a(t.timestamp) || i(s) && !s(t.extra));
}, l = (e, t, n = "m") => typeof e == "string" ? h(() => new RegExp(e, n).test(t), {
  default: !1,
  quiet: !0
}) : h(() => e.test(t), {
  default: !1,
  quiet: !0
}), v = (e) => (t) => {
  for (const n of e)
    if (U(n)(t))
      return n;
  return !1;
}, A = (e) => (t) => typeof e == "string" || e instanceof RegExp ? t : e.transform ? e.transform(t) : t, m = (e) => {
  const t = [], n = {
    length: 0,
    push: (r) => {
      t.length >= e && t.shift(), t.push(r), n.length = t.length;
    },
    get: () => t,
    clear: () => {
      t.length = 0, n.length = 0;
    },
    last: () => t[t.length - 1]
  };
  return n;
}, w = () => {
  let e = performance.now(), t;
  const n = {
    end: () => (i(t) || (t = performance.now()), n),
    getDuration: () => (t ?? performance.now()) - e
  };
  return n;
}, D = (e = 100) => {
  let t = 0;
  const n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), a = m(e), u = {
    clear: () => (t = 0, n.clear(), r.clear(), s.clear(), a.clear(), u),
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
      const f = n.get(o) ?? 0;
      n.set(o, f + c);
    },
    gauge: (o, c = 0) => {
      r.set(o, c);
    },
    getCounters: () => new Map(n),
    getCounter: (o) => n.get(o) ?? 0,
    getGauge: (o) => r.get(o) ?? 0,
    getGauges: () => new Map(r),
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
  clock: n = performance,
  maxSampleSize: r = 100
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
    getStats: (u) => s.get(u, () => D(r)),
    log: ({ traceId: u, message: o, timestamp: c = n.now(), extra: f = [] }) => {
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
  const n = {
    span: (r) => q(`${e}.${r}`, t),
    increment: (r, s = 1) => (t.getStats(e).increment(r, s), n),
    sample: (r, s, a) => {
      if (Math.random() < r) {
        const u = a();
        n.gauge(s, u);
      }
      return n;
    },
    when: (r, s, a) => {
      if (r()) {
        const u = a();
        n.gauge(s, u);
      }
      return n;
    },
    gauge: (r, s) => (t.getStats(e).gauge(r, s), n),
    timer: (r) => t.getStats(e).timer(r),
    end: () => (t.end(e), n),
    log: (r, ...s) => (t.log({ traceId: e, message: r, extra: s }), n)
  };
  return n;
};
export {
  q as Observe,
  R as ObserveAgent,
  D as Stats,
  w as Timer,
  E as parseTraceId
};
//# sourceMappingURL=index.js.map
