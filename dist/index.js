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
    extra: a,
    timestamp: u
  } = e;
  return !(i(r) && !m(r, t.traceId) || i(n) && !m(n, t.message) || i(u) && !u(t.timestamp) || i(a) && !a(t.extra));
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
  const r = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), u = l(e), o = {
    clear: () => (t = 0, r.clear(), n.clear(), a.clear(), u.clear(), o),
    lastTime: () => u.last(),
    time: () => {
      const s = o.lastTime();
      i(s) && s.end();
      const g = w();
      return u.push(g), g;
    },
    getTimes: () => u.get(),
    timer: (s) => {
      const g = a.get(s) ?? l(e);
      a.set(s, g);
      const c = w();
      return g.push(c), c;
    },
    increment: (s, g = 1) => {
      const c = r.get(s) ?? 0;
      r.set(s, c + g);
    },
    gauge: (s, g = 0) => {
      n.set(s, g);
    },
    getCounters: () => new Map(r),
    getCounter: (s) => r.get(s) ?? 0,
    getGauge: (s) => n.get(s) ?? 0,
    getGauges: () => new Map(n),
    count: (s = 1) => {
      t += s;
    },
    getCount: () => t,
    getTimers: (s) => (a.get(s) ?? l(e)).get()
  };
  return o;
}, y = ({
  logMatchers: e = [],
  logger: t = console.log,
  clock: r = performance,
  maxSampleSize: n = 100
} = {}) => {
  const a = M.create(), u = {
    updateLogMatchers: (o) => {
      const s = o(e);
      return e = s, s;
    },
    getTraceIds: () => a.entries().map(([o]) => o),
    start: (o, ...s) => {
      u.getStats(o).count(), u.getStats(o).time(), u.log({ traceId: o, message: "start", extra: s });
    },
    getStats: (o) => a.get(o, () => x(n)),
    log: ({ traceId: o, message: s, timestamp: g = r.now(), extra: c = [] }) => {
      const p = {
        traceId: o,
        message: s,
        timestamp: g,
        extra: c
      }, h = T(e)(p);
      if (!h)
        return;
      const f = S(h)(p);
      t(
        `${f.timestamp} ${f.traceId}: ${f.message}`,
        ...f.extra ?? []
      );
    },
    end: (o, ...s) => {
      u.getStats(o).lastTime()?.end(), u.log({ traceId: o, message: "end", extra: s });
    }
  };
  return u;
}, $ = (e = "", t = y()) => {
  t.start(e);
  const r = {
    span: (n) => $(`${e}.${n}`, t),
    increment: (n, a = 1) => (t.getStats(e).increment(n, a), r),
    sample: (n, a, u) => {
      if (Math.random() < n) {
        const o = u();
        r.gauge(a, o);
      }
      return r;
    },
    when: (n, a, u) => {
      if (n()) {
        const o = u();
        r.gauge(a, o);
      }
      return r;
    },
    gauge: (n, a) => (t.getStats(e).gauge(n, a), r),
    timer: (n) => t.getStats(e).timer(n),
    end: () => (t.end(e), r),
    log: (n, ...a) => (t.log({ traceId: e, message: n, extra: a }), r)
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
