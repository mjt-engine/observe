const f = (t) => t == null || Number.isNaN(t), l = (t) => !f(t), p = {
  isDefined: l,
  isUndefined: f
}, { isDefined: d, isUndefined: h } = p, L = (t, e, r) => {
  if (h(t))
    return;
  const n = e.get(t);
  if (d(n))
    return n;
  if (d(r)) {
    const s = r();
    return e.set(t, s), s;
  }
}, w = () => {
  const t = /* @__PURE__ */ new Map();
  let e = performance.now();
  const r = {
    get: (n, s) => L(n, t, s),
    set: (n, s) => (t.set(n, s), r),
    delete: (n) => t.delete(n),
    entries: () => Array.from(t.entries()),
    clear: () => t.clear(),
    size: () => t.size,
    findKeys: (n) => Array.from(t.entries()).filter(([o, a]) => a === n).map(([o, a]) => o),
    lastUpdate: () => e
  };
  return r;
}, x = {
  create: w
}, M = (t) => (e) => {
  if (typeof t == "string")
    return new RegExp(t).test(e.traceId);
  const {
    traceId: r,
    message: n,
    extra: s = () => !0,
    timestamp: o = () => !0
  } = t;
  return !(r && !new RegExp(r).test(e.traceId) || n && !new RegExp(n).test(e.message) || e.timestamp && !o(e.timestamp) || e.extra && !s(e.extra));
}, $ = (t) => (e) => {
  for (const r of t)
    if (M(r)(e))
      return r;
  return !1;
}, C = (t) => (e) => typeof t == "string" ? e : t.transform ? t.transform(e) : e, b = (t) => {
  const e = [], r = {
    length: 0,
    push: (n) => {
      e.length >= t && e.shift(), e.push(n), r.length = e.length;
    },
    get: () => e,
    clear: () => {
      e.length = 0, r.length = 0;
    }
  };
  return r;
}, O = () => {
  let t = performance.now(), e;
  const r = {
    end: () => (e = performance.now(), r),
    getDuration: () => (e ?? performance.now()) - t
  };
  return r;
}, U = (t = 100) => {
  let e = 0, r = b(t);
  const n = {
    time: () => {
      const s = O();
      return r.push(s), s;
    },
    addCount: (s) => {
      e += s;
    },
    getCount: () => e,
    clearCount: () => (e = 0, n),
    getTimers: () => r.get(),
    clearTimers: () => (r.clear(), n)
  };
  return n;
}, v = ({
  logMatchers: t = [],
  logger: e = console.log,
  clock: r = performance
} = {}) => {
  const n = x.create(), s = {
    start: (o, ...a) => {
      s.addLog({ traceId: o, message: "start", extra: a });
    },
    getStats: (o) => n.get(o, () => U()),
    addLog: ({ traceId: o, message: a, timestamp: m = r.now(), extra: g = [] }) => {
      const u = {
        traceId: o,
        message: a,
        timestamp: m,
        extra: g
      }, i = $(t)(u);
      if (!i)
        return;
      const c = C(i)(u);
      e(
        `${c.timestamp} ${c.traceId}: ${c.message}`,
        ...c.extra ?? []
      );
    },
    end: (o, ...a) => {
      s.addLog({ traceId: o, message: "end", extra: a });
    }
  };
  return s;
}, A = (t = "", e = v()) => {
  e.start(t);
  const r = {
    span: (n) => A(`${t}.${n}`, e),
    count: (n = 1) => (e.getStats(t).addCount(n), r),
    time: () => e.getStats(t).time(),
    end: () => (e.end(t), r),
    log: (n, ...s) => (e.addLog({ traceId: t, message: n, extra: s }), r)
  };
  return r;
}, D = (t) => {
  const e = t.split("."), r = e.shift(), n = e.join(".");
  return {
    root: r,
    segments: e,
    subpath: n
  };
};
export {
  A as Observe,
  v as ObserveAgent,
  D as parseTraceId
};
