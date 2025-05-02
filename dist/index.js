import { Caches as M } from "@mjt-engine/cache";
import { isDefined as i, safe as d } from "@mjt-engine/object";
const R = (e) => {
  const t = e.split("."), r = t.shift(), n = t.join(".");
  return {
    root: r,
    segments: t,
    subpath: n
  };
}, L = (e) => (t) => {
  if (typeof e == "string" || e instanceof RegExp)
    return m(e, t.traceId);
  const {
    traceId: r,
    message: n,
    extra: o,
    timestamp: u
  } = e;
  return !(i(r) && !m(r, t.traceId) || i(n) && !m(n, t.message) || i(u) && !u(t.timestamp) || i(o) && !o(t.extra));
}, m = (e, t, r = "m") => typeof e == "string" ? d(() => new RegExp(e, r).test(t), {
  default: !1,
  quiet: !0
}) : d(() => e.test(t), {
  default: !1,
  quiet: !0
}), T = (e) => (t) => {
  for (const r of e)
    if (L(r)(t))
      return r;
  return !1;
}, S = (e) => (t) => typeof e == "string" || e instanceof RegExp ? t : e.transform ? e.transform(t) : t, l = (e) => {
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
}, x = (e = 100) => {
  let t = 0;
  const r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map(), u = l(e), a = {
    clear: () => (t = 0, r.clear(), n.clear(), o.clear(), u.clear(), a),
    lastTime: () => u.last(),
    time: () => {
      const s = a.lastTime();
      i(s) && s.end();
      const c = w();
      return u.push(c), c;
    },
    getTimes: () => u.get(),
    timer: (s) => {
      const c = o.get(s) ?? l(e);
      o.set(s, c);
      const g = w();
      return c.push(g), g;
    },
    increment: (s, c = 1) => {
      const g = r.get(s) ?? 0;
      r.set(s, g + c);
    },
    gauge: (s, c = 0) => {
      n.set(s, c);
    },
    getCounters: () => new Map(r),
    getCounter: (s) => r.get(s) ?? 0,
    getGauge: (s) => n.get(s) ?? 0,
    getGauges: () => new Map(n),
    count: (s = 1) => {
      t += s;
    },
    getCount: () => t,
    getTimers: (s) => (o.get(s) ?? l(e)).get()
  };
  return a;
}, y = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: r = performance,
  maxSampleSize: n = 100
} = {}) => {
  const o = M.create(), u = {
    updateLogMatchers: (a) => {
      const s = a(e);
      return e = s, s;
    },
    getTraceIds: () => o.entries().map(([a]) => a),
    start: (a, ...s) => {
      u.getStats(a).count(), u.getStats(a).time();
    },
    getStats: (a) => o.get(a, () => x(n)),
    log: ({ traceId: a, message: s, timestamp: c = r.now(), extra: g = [] }) => {
      const p = {
        traceId: a,
        message: s,
        timestamp: c,
        extra: g
      }, h = T(e)(p);
      if (!h)
        return;
      const f = S(h)(p);
      t(
        `${f.timestamp} ${f.traceId}: ${f.message}`,
        ...f.extra ?? []
      );
    },
    end: (a, ...s) => {
      u.getStats(a).lastTime()?.end();
    }
  };
  return u;
}, $ = (e = "", t = y()) => {
  t.start(e);
  const r = {
    span: (n) => $(`${e}.${n}`, t),
    increment: (n, o = 1) => (t.getStats(e).increment(n, o), r),
    sample: (n, o, u) => {
      if (Math.random() < n) {
        const a = u();
        r.gauge(o, a);
      }
      return r;
    },
    when: (n, o, u) => {
      if (n()) {
        const a = u();
        r.gauge(o, a);
      }
      return r;
    },
    gauge: (n, o) => (t.getStats(e).gauge(n, o), r),
    timer: (n) => t.getStats(e).timer(n),
    end: () => (t.end(e), r),
    log: (n, ...o) => (t.log({ traceId: e, message: n, extra: o }), r)
  };
  return r;
};
export {
  $ as Observe,
  y as ObserveAgent,
  x as Stats,
  w as Timer,
  R as parseTraceId
};
//# sourceMappingURL=index.js.map
