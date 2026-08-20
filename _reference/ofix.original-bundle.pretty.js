var y0 = Object.defineProperty;
var gf = (e) => {
  throw TypeError(e);
};
var x0 = (e, t, n) =>
  t in e
    ? y0(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
    : (e[t] = n);
var Zt = (e, t, n) => x0(e, typeof t != "symbol" ? t + "" : t, n),
  Pl = (e, t, n) => t.has(e) || gf("Cannot " + n);
var k = (e, t, n) => (
    Pl(e, t, "read from private field"),
    n ? n.call(e) : t.get(e)
  ),
  ce = (e, t, n) =>
    t.has(e)
      ? gf("Cannot add the same private member more than once")
      : t instanceof WeakSet
        ? t.add(e)
        : t.set(e, n),
  G = (e, t, n, r) => (
    Pl(e, t, "write to private field"),
    r ? r.call(e, n) : t.set(e, n),
    n
  ),
  Ye = (e, t, n) => (Pl(e, t, "access private method"), n);
var yi = (e, t, n, r) => ({
  set _(o) {
    G(e, t, o, n);
  },
  get _() {
    return k(e, t, r);
  },
});
function w0(e, t) {
  for (var n = 0; n < t.length; n++) {
    const r = t[n];
    if (typeof r != "string" && !Array.isArray(r)) {
      for (const o in r)
        if (o !== "default" && !(o in e)) {
          const s = Object.getOwnPropertyDescriptor(r, o);
          s &&
            Object.defineProperty(
              e,
              o,
              s.get ? s : { enumerable: !0, get: () => r[o] },
            );
        }
    }
  }
  return Object.freeze(
    Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
  );
}
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const o of document.querySelectorAll('link[rel="modulepreload"]')) r(o);
  new MutationObserver((o) => {
    for (const s of o)
      if (s.type === "childList")
        for (const a of s.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && r(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(o) {
    const s = {};
    return (
      o.integrity && (s.integrity = o.integrity),
      o.referrerPolicy && (s.referrerPolicy = o.referrerPolicy),
      o.crossOrigin === "use-credentials"
        ? (s.credentials = "include")
        : o.crossOrigin === "anonymous"
          ? (s.credentials = "omit")
          : (s.credentials = "same-origin"),
      s
    );
  }
  function r(o) {
    if (o.ep) return;
    o.ep = !0;
    const s = n(o);
    fetch(o.href, s);
  }
})();
function Ih(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var Oh = { exports: {} },
  Wa = {},
  Mh = { exports: {} },
  te = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var ci = Symbol.for("react.element"),
  S0 = Symbol.for("react.portal"),
  j0 = Symbol.for("react.fragment"),
  b0 = Symbol.for("react.strict_mode"),
  N0 = Symbol.for("react.profiler"),
  C0 = Symbol.for("react.provider"),
  E0 = Symbol.for("react.context"),
  k0 = Symbol.for("react.forward_ref"),
  P0 = Symbol.for("react.suspense"),
  T0 = Symbol.for("react.memo"),
  R0 = Symbol.for("react.lazy"),
  vf = Symbol.iterator;
function A0(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (vf && e[vf]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var _h = {
    isMounted: function () {
      return !1;
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  Dh = Object.assign,
  Lh = {};
function Yo(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = Lh),
    (this.updater = n || _h));
}
Yo.prototype.isReactComponent = {};
Yo.prototype.setState = function (e, t) {
  if (typeof e != "object" && typeof e != "function" && e != null)
    throw Error(
      "setState(...): takes an object of state variables to update or a function which returns an object of state variables.",
    );
  this.updater.enqueueSetState(this, e, t, "setState");
};
Yo.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, "forceUpdate");
};
function Fh() {}
Fh.prototype = Yo.prototype;
function Ou(e, t, n) {
  ((this.props = e),
    (this.context = t),
    (this.refs = Lh),
    (this.updater = n || _h));
}
var Mu = (Ou.prototype = new Fh());
Mu.constructor = Ou;
Dh(Mu, Yo.prototype);
Mu.isPureReactComponent = !0;
var yf = Array.isArray,
  zh = Object.prototype.hasOwnProperty,
  _u = { current: null },
  $h = { key: !0, ref: !0, __self: !0, __source: !0 };
function Uh(e, t, n) {
  var r,
    o = {},
    s = null,
    a = null;
  if (t != null)
    for (r in (t.ref !== void 0 && (a = t.ref),
    t.key !== void 0 && (s = "" + t.key),
    t))
      zh.call(t, r) && !$h.hasOwnProperty(r) && (o[r] = t[r]);
  var l = arguments.length - 2;
  if (l === 1) o.children = n;
  else if (1 < l) {
    for (var c = Array(l), u = 0; u < l; u++) c[u] = arguments[u + 2];
    o.children = c;
  }
  if (e && e.defaultProps)
    for (r in ((l = e.defaultProps), l)) o[r] === void 0 && (o[r] = l[r]);
  return {
    $$typeof: ci,
    type: e,
    key: s,
    ref: a,
    props: o,
    _owner: _u.current,
  };
}
function I0(e, t) {
  return {
    $$typeof: ci,
    type: e.type,
    key: t,
    ref: e.ref,
    props: e.props,
    _owner: e._owner,
  };
}
function Du(e) {
  return typeof e == "object" && e !== null && e.$$typeof === ci;
}
function O0(e) {
  var t = { "=": "=0", ":": "=2" };
  return (
    "$" +
    e.replace(/[=:]/g, function (n) {
      return t[n];
    })
  );
}
var xf = /\/+/g;
function Tl(e, t) {
  return typeof e == "object" && e !== null && e.key != null
    ? O0("" + e.key)
    : t.toString(36);
}
function Hi(e, t, n, r, o) {
  var s = typeof e;
  (s === "undefined" || s === "boolean") && (e = null);
  var a = !1;
  if (e === null) a = !0;
  else
    switch (s) {
      case "string":
      case "number":
        a = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case ci:
          case S0:
            a = !0;
        }
    }
  if (a)
    return (
      (a = e),
      (o = o(a)),
      (e = r === "" ? "." + Tl(a, 0) : r),
      yf(o)
        ? ((n = ""),
          e != null && (n = e.replace(xf, "$&/") + "/"),
          Hi(o, t, n, "", function (u) {
            return u;
          }))
        : o != null &&
          (Du(o) &&
            (o = I0(
              o,
              n +
                (!o.key || (a && a.key === o.key)
                  ? ""
                  : ("" + o.key).replace(xf, "$&/") + "/") +
                e,
            )),
          t.push(o)),
      1
    );
  if (((a = 0), (r = r === "" ? "." : r + ":"), yf(e)))
    for (var l = 0; l < e.length; l++) {
      s = e[l];
      var c = r + Tl(s, l);
      a += Hi(s, t, n, c, o);
    }
  else if (((c = A0(e)), typeof c == "function"))
    for (e = c.call(e), l = 0; !(s = e.next()).done;)
      ((s = s.value), (c = r + Tl(s, l++)), (a += Hi(s, t, n, c, o)));
  else if (s === "object")
    throw (
      (t = String(e)),
      Error(
        "Objects are not valid as a React child (found: " +
          (t === "[object Object]"
            ? "object with keys {" + Object.keys(e).join(", ") + "}"
            : t) +
          "). If you meant to render a collection of children, use an array instead.",
      )
    );
  return a;
}
function xi(e, t, n) {
  if (e == null) return e;
  var r = [],
    o = 0;
  return (
    Hi(e, r, "", "", function (s) {
      return t.call(n, s, o++);
    }),
    r
  );
}
function M0(e) {
  if (e._status === -1) {
    var t = e._result;
    ((t = t()),
      t.then(
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 1), (e._result = n));
        },
        function (n) {
          (e._status === 0 || e._status === -1) &&
            ((e._status = 2), (e._result = n));
        },
      ),
      e._status === -1 && ((e._status = 0), (e._result = t)));
  }
  if (e._status === 1) return e._result.default;
  throw e._result;
}
var at = { current: null },
  Ki = { transition: null },
  _0 = {
    ReactCurrentDispatcher: at,
    ReactCurrentBatchConfig: Ki,
    ReactCurrentOwner: _u,
  };
function Bh() {
  throw Error("act(...) is not supported in production builds of React.");
}
te.Children = {
  map: xi,
  forEach: function (e, t, n) {
    xi(
      e,
      function () {
        t.apply(this, arguments);
      },
      n,
    );
  },
  count: function (e) {
    var t = 0;
    return (
      xi(e, function () {
        t++;
      }),
      t
    );
  },
  toArray: function (e) {
    return (
      xi(e, function (t) {
        return t;
      }) || []
    );
  },
  only: function (e) {
    if (!Du(e))
      throw Error(
        "React.Children.only expected to receive a single React element child.",
      );
    return e;
  },
};
te.Component = Yo;
te.Fragment = j0;
te.Profiler = N0;
te.PureComponent = Ou;
te.StrictMode = b0;
te.Suspense = P0;
te.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = _0;
te.act = Bh;
te.cloneElement = function (e, t, n) {
  if (e == null)
    throw Error(
      "React.cloneElement(...): The argument must be a React element, but you passed " +
        e +
        ".",
    );
  var r = Dh({}, e.props),
    o = e.key,
    s = e.ref,
    a = e._owner;
  if (t != null) {
    if (
      (t.ref !== void 0 && ((s = t.ref), (a = _u.current)),
      t.key !== void 0 && (o = "" + t.key),
      e.type && e.type.defaultProps)
    )
      var l = e.type.defaultProps;
    for (c in t)
      zh.call(t, c) &&
        !$h.hasOwnProperty(c) &&
        (r[c] = t[c] === void 0 && l !== void 0 ? l[c] : t[c]);
  }
  var c = arguments.length - 2;
  if (c === 1) r.children = n;
  else if (1 < c) {
    l = Array(c);
    for (var u = 0; u < c; u++) l[u] = arguments[u + 2];
    r.children = l;
  }
  return { $$typeof: ci, type: e.type, key: o, ref: s, props: r, _owner: a };
};
te.createContext = function (e) {
  return (
    (e = {
      $$typeof: E0,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: C0, _context: e }),
    (e.Consumer = e)
  );
};
te.createElement = Uh;
te.createFactory = function (e) {
  var t = Uh.bind(null, e);
  return ((t.type = e), t);
};
te.createRef = function () {
  return { current: null };
};
te.forwardRef = function (e) {
  return { $$typeof: k0, render: e };
};
te.isValidElement = Du;
te.lazy = function (e) {
  return { $$typeof: R0, _payload: { _status: -1, _result: e }, _init: M0 };
};
te.memo = function (e, t) {
  return { $$typeof: T0, type: e, compare: t === void 0 ? null : t };
};
te.startTransition = function (e) {
  var t = Ki.transition;
  Ki.transition = {};
  try {
    e();
  } finally {
    Ki.transition = t;
  }
};
te.unstable_act = Bh;
te.useCallback = function (e, t) {
  return at.current.useCallback(e, t);
};
te.useContext = function (e) {
  return at.current.useContext(e);
};
te.useDebugValue = function () {};
te.useDeferredValue = function (e) {
  return at.current.useDeferredValue(e);
};
te.useEffect = function (e, t) {
  return at.current.useEffect(e, t);
};
te.useId = function () {
  return at.current.useId();
};
te.useImperativeHandle = function (e, t, n) {
  return at.current.useImperativeHandle(e, t, n);
};
te.useInsertionEffect = function (e, t) {
  return at.current.useInsertionEffect(e, t);
};
te.useLayoutEffect = function (e, t) {
  return at.current.useLayoutEffect(e, t);
};
te.useMemo = function (e, t) {
  return at.current.useMemo(e, t);
};
te.useReducer = function (e, t, n) {
  return at.current.useReducer(e, t, n);
};
te.useRef = function (e) {
  return at.current.useRef(e);
};
te.useState = function (e) {
  return at.current.useState(e);
};
te.useSyncExternalStore = function (e, t, n) {
  return at.current.useSyncExternalStore(e, t, n);
};
te.useTransition = function () {
  return at.current.useTransition();
};
te.version = "18.3.1";
Mh.exports = te;
var f = Mh.exports;
const A = Ih(f),
  Lu = w0({ __proto__: null, default: A }, [f]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var D0 = f,
  L0 = Symbol.for("react.element"),
  F0 = Symbol.for("react.fragment"),
  z0 = Object.prototype.hasOwnProperty,
  $0 = D0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  U0 = { key: !0, ref: !0, __self: !0, __source: !0 };
function Vh(e, t, n) {
  var r,
    o = {},
    s = null,
    a = null;
  (n !== void 0 && (s = "" + n),
    t.key !== void 0 && (s = "" + t.key),
    t.ref !== void 0 && (a = t.ref));
  for (r in t) z0.call(t, r) && !U0.hasOwnProperty(r) && (o[r] = t[r]);
  if (e && e.defaultProps)
    for (r in ((t = e.defaultProps), t)) o[r] === void 0 && (o[r] = t[r]);
  return {
    $$typeof: L0,
    type: e,
    key: s,
    ref: a,
    props: o,
    _owner: $0.current,
  };
}
Wa.Fragment = F0;
Wa.jsx = Vh;
Wa.jsxs = Vh;
Oh.exports = Wa;
var i = Oh.exports,
  Wh = { exports: {} },
  jt = {},
  Hh = { exports: {} },
  Kh = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ (function (e) {
  function t(E, P) {
    var D = E.length;
    E.push(P);
    e: for (; 0 < D;) {
      var W = (D - 1) >>> 1,
        U = E[W];
      if (0 < o(U, P)) ((E[W] = P), (E[D] = U), (D = W));
      else break e;
    }
  }
  function n(E) {
    return E.length === 0 ? null : E[0];
  }
  function r(E) {
    if (E.length === 0) return null;
    var P = E[0],
      D = E.pop();
    if (D !== P) {
      E[0] = D;
      e: for (var W = 0, U = E.length, J = U >>> 1; W < J;) {
        var Q = 2 * (W + 1) - 1,
          xe = E[Q],
          Ae = Q + 1,
          L = E[Ae];
        if (0 > o(xe, D))
          Ae < U && 0 > o(L, xe)
            ? ((E[W] = L), (E[Ae] = D), (W = Ae))
            : ((E[W] = xe), (E[Q] = D), (W = Q));
        else if (Ae < U && 0 > o(L, D)) ((E[W] = L), (E[Ae] = D), (W = Ae));
        else break e;
      }
    }
    return P;
  }
  function o(E, P) {
    var D = E.sortIndex - P.sortIndex;
    return D !== 0 ? D : E.id - P.id;
  }
  if (typeof performance == "object" && typeof performance.now == "function") {
    var s = performance;
    e.unstable_now = function () {
      return s.now();
    };
  } else {
    var a = Date,
      l = a.now();
    e.unstable_now = function () {
      return a.now() - l;
    };
  }
  var c = [],
    u = [],
    d = 1,
    p = null,
    m = 3,
    g = !1,
    S = !1,
    h = !1,
    w = typeof setTimeout == "function" ? setTimeout : null,
    y = typeof clearTimeout == "function" ? clearTimeout : null,
    v = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function x(E) {
    for (var P = n(u); P !== null;) {
      if (P.callback === null) r(u);
      else if (P.startTime <= E)
        (r(u), (P.sortIndex = P.expirationTime), t(c, P));
      else break;
      P = n(u);
    }
  }
  function j(E) {
    if (((h = !1), x(E), !S))
      if (n(c) !== null) ((S = !0), z(b));
      else {
        var P = n(u);
        P !== null && B(j, P.startTime - E);
      }
  }
  function b(E, P) {
    ((S = !1), h && ((h = !1), y(T), (T = -1)), (g = !0));
    var D = m;
    try {
      for (
        x(P), p = n(c);
        p !== null && (!(p.expirationTime > P) || (E && !$()));
      ) {
        var W = p.callback;
        if (typeof W == "function") {
          ((p.callback = null), (m = p.priorityLevel));
          var U = W(p.expirationTime <= P);
          ((P = e.unstable_now()),
            typeof U == "function" ? (p.callback = U) : p === n(c) && r(c),
            x(P));
        } else r(c);
        p = n(c);
      }
      if (p !== null) var J = !0;
      else {
        var Q = n(u);
        (Q !== null && B(j, Q.startTime - P), (J = !1));
      }
      return J;
    } finally {
      ((p = null), (m = D), (g = !1));
    }
  }
  var N = !1,
    C = null,
    T = -1,
    I = 5,
    O = -1;
  function $() {
    return !(e.unstable_now() - O < I);
  }
  function _() {
    if (C !== null) {
      var E = e.unstable_now();
      O = E;
      var P = !0;
      try {
        P = C(!0, E);
      } finally {
        P ? V() : ((N = !1), (C = null));
      }
    } else N = !1;
  }
  var V;
  if (typeof v == "function")
    V = function () {
      v(_);
    };
  else if (typeof MessageChannel < "u") {
    var M = new MessageChannel(),
      H = M.port2;
    ((M.port1.onmessage = _),
      (V = function () {
        H.postMessage(null);
      }));
  } else
    V = function () {
      w(_, 0);
    };
  function z(E) {
    ((C = E), N || ((N = !0), V()));
  }
  function B(E, P) {
    T = w(function () {
      E(e.unstable_now());
    }, P);
  }
  ((e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (E) {
      E.callback = null;
    }),
    (e.unstable_continueExecution = function () {
      S || g || ((S = !0), z(b));
    }),
    (e.unstable_forceFrameRate = function (E) {
      0 > E || 125 < E
        ? console.error(
            "forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported",
          )
        : (I = 0 < E ? Math.floor(1e3 / E) : 5);
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return m;
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(c);
    }),
    (e.unstable_next = function (E) {
      switch (m) {
        case 1:
        case 2:
        case 3:
          var P = 3;
          break;
        default:
          P = m;
      }
      var D = m;
      m = P;
      try {
        return E();
      } finally {
        m = D;
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (E, P) {
      switch (E) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          E = 3;
      }
      var D = m;
      m = E;
      try {
        return P();
      } finally {
        m = D;
      }
    }),
    (e.unstable_scheduleCallback = function (E, P, D) {
      var W = e.unstable_now();
      switch (
        (typeof D == "object" && D !== null
          ? ((D = D.delay), (D = typeof D == "number" && 0 < D ? W + D : W))
          : (D = W),
        E)
      ) {
        case 1:
          var U = -1;
          break;
        case 2:
          U = 250;
          break;
        case 5:
          U = 1073741823;
          break;
        case 4:
          U = 1e4;
          break;
        default:
          U = 5e3;
      }
      return (
        (U = D + U),
        (E = {
          id: d++,
          callback: P,
          priorityLevel: E,
          startTime: D,
          expirationTime: U,
          sortIndex: -1,
        }),
        D > W
          ? ((E.sortIndex = D),
            t(u, E),
            n(c) === null &&
              E === n(u) &&
              (h ? (y(T), (T = -1)) : (h = !0), B(j, D - W)))
          : ((E.sortIndex = U), t(c, E), S || g || ((S = !0), z(b))),
        E
      );
    }),
    (e.unstable_shouldYield = $),
    (e.unstable_wrapCallback = function (E) {
      var P = m;
      return function () {
        var D = m;
        m = P;
        try {
          return E.apply(this, arguments);
        } finally {
          m = D;
        }
      };
    }));
})(Kh);
Hh.exports = Kh;
var B0 = Hh.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var V0 = f,
  St = B0;
function R(e) {
  for (
    var t = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, n = 1;
    n < arguments.length;
    n++
  )
    t += "&args[]=" + encodeURIComponent(arguments[n]);
  return (
    "Minified React error #" +
    e +
    "; visit " +
    t +
    " for the full message or use the non-minified dev environment for full errors and additional helpful warnings."
  );
}
var Qh = new Set(),
  Ds = {};
function Kr(e, t) {
  (Do(e, t), Do(e + "Capture", t));
}
function Do(e, t) {
  for (Ds[e] = t, e = 0; e < t.length; e++) Qh.add(t[e]);
}
var Sn = !(
    typeof window > "u" ||
    typeof window.document > "u" ||
    typeof window.document.createElement > "u"
  ),
  vc = Object.prototype.hasOwnProperty,
  W0 =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  wf = {},
  Sf = {};
function H0(e) {
  return vc.call(Sf, e)
    ? !0
    : vc.call(wf, e)
      ? !1
      : W0.test(e)
        ? (Sf[e] = !0)
        : ((wf[e] = !0), !1);
}
function K0(e, t, n, r) {
  if (n !== null && n.type === 0) return !1;
  switch (typeof t) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      return r
        ? !1
        : n !== null
          ? !n.acceptsBooleans
          : ((e = e.toLowerCase().slice(0, 5)), e !== "data-" && e !== "aria-");
    default:
      return !1;
  }
}
function Q0(e, t, n, r) {
  if (t === null || typeof t > "u" || K0(e, t, n, r)) return !0;
  if (r) return !1;
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t;
      case 4:
        return t === !1;
      case 5:
        return isNaN(t);
      case 6:
        return isNaN(t) || 1 > t;
    }
  return !1;
}
function lt(e, t, n, r, o, s, a) {
  ((this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = o),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = s),
    (this.removeEmptyString = a));
}
var qe = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style"
  .split(" ")
  .forEach(function (e) {
    qe[e] = new lt(e, 0, !1, e, null, !1, !1);
  });
[
  ["acceptCharset", "accept-charset"],
  ["className", "class"],
  ["htmlFor", "for"],
  ["httpEquiv", "http-equiv"],
].forEach(function (e) {
  var t = e[0];
  qe[t] = new lt(t, 1, !1, e[1], null, !1, !1);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
  qe[e] = new lt(e, 2, !1, e.toLowerCase(), null, !1, !1);
});
[
  "autoReverse",
  "externalResourcesRequired",
  "focusable",
  "preserveAlpha",
].forEach(function (e) {
  qe[e] = new lt(e, 2, !1, e, null, !1, !1);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope"
  .split(" ")
  .forEach(function (e) {
    qe[e] = new lt(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
["checked", "multiple", "muted", "selected"].forEach(function (e) {
  qe[e] = new lt(e, 3, !0, e, null, !1, !1);
});
["capture", "download"].forEach(function (e) {
  qe[e] = new lt(e, 4, !1, e, null, !1, !1);
});
["cols", "rows", "size", "span"].forEach(function (e) {
  qe[e] = new lt(e, 6, !1, e, null, !1, !1);
});
["rowSpan", "start"].forEach(function (e) {
  qe[e] = new lt(e, 5, !1, e.toLowerCase(), null, !1, !1);
});
var Fu = /[\-:]([a-z])/g;
function zu(e) {
  return e[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Fu, zu);
    qe[t] = new lt(t, 1, !1, e, null, !1, !1);
  });
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type"
  .split(" ")
  .forEach(function (e) {
    var t = e.replace(Fu, zu);
    qe[t] = new lt(t, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
  var t = e.replace(Fu, zu);
  qe[t] = new lt(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
});
["tabIndex", "crossOrigin"].forEach(function (e) {
  qe[e] = new lt(e, 1, !1, e.toLowerCase(), null, !1, !1);
});
qe.xlinkHref = new lt(
  "xlinkHref",
  1,
  !1,
  "xlink:href",
  "http://www.w3.org/1999/xlink",
  !0,
  !1,
);
["src", "href", "action", "formAction"].forEach(function (e) {
  qe[e] = new lt(e, 1, !1, e.toLowerCase(), null, !0, !0);
});
function $u(e, t, n, r) {
  var o = qe.hasOwnProperty(t) ? qe[t] : null;
  (o !== null
    ? o.type !== 0
    : r ||
      !(2 < t.length) ||
      (t[0] !== "o" && t[0] !== "O") ||
      (t[1] !== "n" && t[1] !== "N")) &&
    (Q0(t, n, o, r) && (n = null),
    r || o === null
      ? H0(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, "" + n))
      : o.mustUseProperty
        ? (e[o.propertyName] = n === null ? (o.type === 3 ? !1 : "") : n)
        : ((t = o.attributeName),
          (r = o.attributeNamespace),
          n === null
            ? e.removeAttribute(t)
            : ((o = o.type),
              (n = o === 3 || (o === 4 && n === !0) ? "" : "" + n),
              r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
}
var kn = V0.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  wi = Symbol.for("react.element"),
  so = Symbol.for("react.portal"),
  io = Symbol.for("react.fragment"),
  Uu = Symbol.for("react.strict_mode"),
  yc = Symbol.for("react.profiler"),
  qh = Symbol.for("react.provider"),
  Gh = Symbol.for("react.context"),
  Bu = Symbol.for("react.forward_ref"),
  xc = Symbol.for("react.suspense"),
  wc = Symbol.for("react.suspense_list"),
  Vu = Symbol.for("react.memo"),
  Fn = Symbol.for("react.lazy"),
  Yh = Symbol.for("react.offscreen"),
  jf = Symbol.iterator;
function cs(e) {
  return e === null || typeof e != "object"
    ? null
    : ((e = (jf && e[jf]) || e["@@iterator"]),
      typeof e == "function" ? e : null);
}
var Te = Object.assign,
  Rl;
function xs(e) {
  if (Rl === void 0)
    try {
      throw Error();
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/);
      Rl = (t && t[1]) || "";
    }
  return (
    `
` +
    Rl +
    e
  );
}
var Al = !1;
function Il(e, t) {
  if (!e || Al) return "";
  Al = !0;
  var n = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (t)
      if (
        ((t = function () {
          throw Error();
        }),
        Object.defineProperty(t.prototype, "props", {
          set: function () {
            throw Error();
          },
        }),
        typeof Reflect == "object" && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, []);
        } catch (u) {
          var r = u;
        }
        Reflect.construct(e, [], t);
      } else {
        try {
          t.call();
        } catch (u) {
          r = u;
        }
        e.call(t.prototype);
      }
    else {
      try {
        throw Error();
      } catch (u) {
        r = u;
      }
      e();
    }
  } catch (u) {
    if (u && r && typeof u.stack == "string") {
      for (
        var o = u.stack.split(`
`),
          s = r.stack.split(`
`),
          a = o.length - 1,
          l = s.length - 1;
        1 <= a && 0 <= l && o[a] !== s[l];
      )
        l--;
      for (; 1 <= a && 0 <= l; a--, l--)
        if (o[a] !== s[l]) {
          if (a !== 1 || l !== 1)
            do
              if ((a--, l--, 0 > l || o[a] !== s[l])) {
                var c =
                  `
` + o[a].replace(" at new ", " at ");
                return (
                  e.displayName &&
                    c.includes("<anonymous>") &&
                    (c = c.replace("<anonymous>", e.displayName)),
                  c
                );
              }
            while (1 <= a && 0 <= l);
          break;
        }
    }
  } finally {
    ((Al = !1), (Error.prepareStackTrace = n));
  }
  return (e = e ? e.displayName || e.name : "") ? xs(e) : "";
}
function q0(e) {
  switch (e.tag) {
    case 5:
      return xs(e.type);
    case 16:
      return xs("Lazy");
    case 13:
      return xs("Suspense");
    case 19:
      return xs("SuspenseList");
    case 0:
    case 2:
    case 15:
      return ((e = Il(e.type, !1)), e);
    case 11:
      return ((e = Il(e.type.render, !1)), e);
    case 1:
      return ((e = Il(e.type, !0)), e);
    default:
      return "";
  }
}
function Sc(e) {
  if (e == null) return null;
  if (typeof e == "function") return e.displayName || e.name || null;
  if (typeof e == "string") return e;
  switch (e) {
    case io:
      return "Fragment";
    case so:
      return "Portal";
    case yc:
      return "Profiler";
    case Uu:
      return "StrictMode";
    case xc:
      return "Suspense";
    case wc:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Gh:
        return (e.displayName || "Context") + ".Consumer";
      case qh:
        return (e._context.displayName || "Context") + ".Provider";
      case Bu:
        var t = e.render;
        return (
          (e = e.displayName),
          e ||
            ((e = t.displayName || t.name || ""),
            (e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")),
          e
        );
      case Vu:
        return (
          (t = e.displayName || null),
          t !== null ? t : Sc(e.type) || "Memo"
        );
      case Fn:
        ((t = e._payload), (e = e._init));
        try {
          return Sc(e(t));
        } catch {}
    }
  return null;
}
function G0(e) {
  var t = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (t.displayName || "Context") + ".Consumer";
    case 10:
      return (t._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ""),
        t.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef")
      );
    case 7:
      return "Fragment";
    case 5:
      return t;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Sc(t);
    case 8:
      return t === Uu ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == "function") return t.displayName || t.name || null;
      if (typeof t == "string") return t;
  }
  return null;
}
function sr(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function Xh(e) {
  var t = e.type;
  return (
    (e = e.nodeName) &&
    e.toLowerCase() === "input" &&
    (t === "checkbox" || t === "radio")
  );
}
function Y0(e) {
  var t = Xh(e) ? "checked" : "value",
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = "" + e[t];
  if (
    !e.hasOwnProperty(t) &&
    typeof n < "u" &&
    typeof n.get == "function" &&
    typeof n.set == "function"
  ) {
    var o = n.get,
      s = n.set;
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return o.call(this);
        },
        set: function (a) {
          ((r = "" + a), s.call(this, a));
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r;
        },
        setValue: function (a) {
          r = "" + a;
        },
        stopTracking: function () {
          ((e._valueTracker = null), delete e[t]);
        },
      }
    );
  }
}
function Si(e) {
  e._valueTracker || (e._valueTracker = Y0(e));
}
function Jh(e) {
  if (!e) return !1;
  var t = e._valueTracker;
  if (!t) return !0;
  var n = t.getValue(),
    r = "";
  return (
    e && (r = Xh(e) ? (e.checked ? "true" : "false") : e.value),
    (e = r),
    e !== n ? (t.setValue(e), !0) : !1
  );
}
function la(e) {
  if (((e = e || (typeof document < "u" ? document : void 0)), typeof e > "u"))
    return null;
  try {
    return e.activeElement || e.body;
  } catch {
    return e.body;
  }
}
function jc(e, t) {
  var n = t.checked;
  return Te({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  });
}
function bf(e, t) {
  var n = t.defaultValue == null ? "" : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked;
  ((n = sr(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled:
        t.type === "checkbox" || t.type === "radio"
          ? t.checked != null
          : t.value != null,
    }));
}
function Zh(e, t) {
  ((t = t.checked), t != null && $u(e, "checked", t, !1));
}
function bc(e, t) {
  Zh(e, t);
  var n = sr(t.value),
    r = t.type;
  if (n != null)
    r === "number"
      ? ((n === 0 && e.value === "") || e.value != n) && (e.value = "" + n)
      : e.value !== "" + n && (e.value = "" + n);
  else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  (t.hasOwnProperty("value")
    ? Nc(e, t.type, n)
    : t.hasOwnProperty("defaultValue") && Nc(e, t.type, sr(t.defaultValue)),
    t.checked == null &&
      t.defaultChecked != null &&
      (e.defaultChecked = !!t.defaultChecked));
}
function Nf(e, t, n) {
  if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
    var r = t.type;
    if (!(
      (r !== "submit" && r !== "reset") ||
      (t.value !== void 0 && t.value !== null)
    ))
      return;
    ((t = "" + e._wrapperState.initialValue),
      n || t === e.value || (e.value = t),
      (e.defaultValue = t));
  }
  ((n = e.name),
    n !== "" && (e.name = ""),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== "" && (e.name = n));
}
function Nc(e, t, n) {
  (t !== "number" || la(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = "" + e._wrapperState.initialValue)
      : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
}
var ws = Array.isArray;
function yo(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {};
    for (var o = 0; o < n.length; o++) t["$" + n[o]] = !0;
    for (n = 0; n < e.length; n++)
      ((o = t.hasOwnProperty("$" + e[n].value)),
        e[n].selected !== o && (e[n].selected = o),
        o && r && (e[n].defaultSelected = !0));
  } else {
    for (n = "" + sr(n), t = null, o = 0; o < e.length; o++) {
      if (e[o].value === n) {
        ((e[o].selected = !0), r && (e[o].defaultSelected = !0));
        return;
      }
      t !== null || e[o].disabled || (t = e[o]);
    }
    t !== null && (t.selected = !0);
  }
}
function Cc(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(R(91));
  return Te({}, t, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue,
  });
}
function Cf(e, t) {
  var n = t.value;
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(R(92));
      if (ws(n)) {
        if (1 < n.length) throw Error(R(93));
        n = n[0];
      }
      t = n;
    }
    (t == null && (t = ""), (n = t));
  }
  e._wrapperState = { initialValue: sr(n) };
}
function em(e, t) {
  var n = sr(t.value),
    r = sr(t.defaultValue);
  (n != null &&
    ((n = "" + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = "" + r));
}
function Ef(e) {
  var t = e.textContent;
  t === e._wrapperState.initialValue && t !== "" && t !== null && (e.value = t);
}
function tm(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Ec(e, t) {
  return e == null || e === "http://www.w3.org/1999/xhtml"
    ? tm(t)
    : e === "http://www.w3.org/2000/svg" && t === "foreignObject"
      ? "http://www.w3.org/1999/xhtml"
      : e;
}
var ji,
  nm = (function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, o) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, o);
          });
        }
      : e;
  })(function (e, t) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e)
      e.innerHTML = t;
    else {
      for (
        ji = ji || document.createElement("div"),
          ji.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>",
          t = ji.firstChild;
        e.firstChild;
      )
        e.removeChild(e.firstChild);
      for (; t.firstChild;) e.appendChild(t.firstChild);
    }
  });
function Ls(e, t) {
  if (t) {
    var n = e.firstChild;
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t;
      return;
    }
  }
  e.textContent = t;
}
var Es = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  X0 = ["Webkit", "ms", "Moz", "O"];
Object.keys(Es).forEach(function (e) {
  X0.forEach(function (t) {
    ((t = t + e.charAt(0).toUpperCase() + e.substring(1)), (Es[t] = Es[e]));
  });
});
function rm(e, t, n) {
  return t == null || typeof t == "boolean" || t === ""
    ? ""
    : n || typeof t != "number" || t === 0 || (Es.hasOwnProperty(e) && Es[e])
      ? ("" + t).trim()
      : t + "px";
}
function om(e, t) {
  e = e.style;
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf("--") === 0,
        o = rm(n, t[n], r);
      (n === "float" && (n = "cssFloat"), r ? e.setProperty(n, o) : (e[n] = o));
    }
}
var J0 = Te(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  },
);
function kc(e, t) {
  if (t) {
    if (J0[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
      throw Error(R(137, e));
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(R(60));
      if (
        typeof t.dangerouslySetInnerHTML != "object" ||
        !("__html" in t.dangerouslySetInnerHTML)
      )
        throw Error(R(61));
    }
    if (t.style != null && typeof t.style != "object") throw Error(R(62));
  }
}
function Pc(e, t) {
  if (e.indexOf("-") === -1) return typeof t.is == "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
var Tc = null;
function Wu(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  );
}
var Rc = null,
  xo = null,
  wo = null;
function kf(e) {
  if ((e = fi(e))) {
    if (typeof Rc != "function") throw Error(R(280));
    var t = e.stateNode;
    t && ((t = Ga(t)), Rc(e.stateNode, e.type, t));
  }
}
function sm(e) {
  xo ? (wo ? wo.push(e) : (wo = [e])) : (xo = e);
}
function im() {
  if (xo) {
    var e = xo,
      t = wo;
    if (((wo = xo = null), kf(e), t)) for (e = 0; e < t.length; e++) kf(t[e]);
  }
}
function am(e, t) {
  return e(t);
}
function lm() {}
var Ol = !1;
function cm(e, t, n) {
  if (Ol) return e(t, n);
  Ol = !0;
  try {
    return am(e, t, n);
  } finally {
    ((Ol = !1), (xo !== null || wo !== null) && (lm(), im()));
  }
}
function Fs(e, t) {
  var n = e.stateNode;
  if (n === null) return null;
  var r = Ga(n);
  if (r === null) return null;
  n = r[t];
  e: switch (t) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      ((r = !r.disabled) ||
        ((e = e.type),
        (r = !(
          e === "button" ||
          e === "input" ||
          e === "select" ||
          e === "textarea"
        ))),
        (e = !r));
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (n && typeof n != "function") throw Error(R(231, t, typeof n));
  return n;
}
var Ac = !1;
if (Sn)
  try {
    var us = {};
    (Object.defineProperty(us, "passive", {
      get: function () {
        Ac = !0;
      },
    }),
      window.addEventListener("test", us, us),
      window.removeEventListener("test", us, us));
  } catch {
    Ac = !1;
  }
function Z0(e, t, n, r, o, s, a, l, c) {
  var u = Array.prototype.slice.call(arguments, 3);
  try {
    t.apply(n, u);
  } catch (d) {
    this.onError(d);
  }
}
var ks = !1,
  ca = null,
  ua = !1,
  Ic = null,
  ew = {
    onError: function (e) {
      ((ks = !0), (ca = e));
    },
  };
function tw(e, t, n, r, o, s, a, l, c) {
  ((ks = !1), (ca = null), Z0.apply(ew, arguments));
}
function nw(e, t, n, r, o, s, a, l, c) {
  if ((tw.apply(this, arguments), ks)) {
    if (ks) {
      var u = ca;
      ((ks = !1), (ca = null));
    } else throw Error(R(198));
    ua || ((ua = !0), (Ic = u));
  }
}
function Qr(e) {
  var t = e,
    n = e;
  if (e.alternate) for (; t.return;) t = t.return;
  else {
    e = t;
    do ((t = e), t.flags & 4098 && (n = t.return), (e = t.return));
    while (e);
  }
  return t.tag === 3 ? n : null;
}
function um(e) {
  if (e.tag === 13) {
    var t = e.memoizedState;
    if (
      (t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)),
      t !== null)
    )
      return t.dehydrated;
  }
  return null;
}
function Pf(e) {
  if (Qr(e) !== e) throw Error(R(188));
}
function rw(e) {
  var t = e.alternate;
  if (!t) {
    if (((t = Qr(e)), t === null)) throw Error(R(188));
    return t !== e ? null : e;
  }
  for (var n = e, r = t; ;) {
    var o = n.return;
    if (o === null) break;
    var s = o.alternate;
    if (s === null) {
      if (((r = o.return), r !== null)) {
        n = r;
        continue;
      }
      break;
    }
    if (o.child === s.child) {
      for (s = o.child; s;) {
        if (s === n) return (Pf(o), e);
        if (s === r) return (Pf(o), t);
        s = s.sibling;
      }
      throw Error(R(188));
    }
    if (n.return !== r.return) ((n = o), (r = s));
    else {
      for (var a = !1, l = o.child; l;) {
        if (l === n) {
          ((a = !0), (n = o), (r = s));
          break;
        }
        if (l === r) {
          ((a = !0), (r = o), (n = s));
          break;
        }
        l = l.sibling;
      }
      if (!a) {
        for (l = s.child; l;) {
          if (l === n) {
            ((a = !0), (n = s), (r = o));
            break;
          }
          if (l === r) {
            ((a = !0), (r = s), (n = o));
            break;
          }
          l = l.sibling;
        }
        if (!a) throw Error(R(189));
      }
    }
    if (n.alternate !== r) throw Error(R(190));
  }
  if (n.tag !== 3) throw Error(R(188));
  return n.stateNode.current === n ? e : t;
}
function dm(e) {
  return ((e = rw(e)), e !== null ? fm(e) : null);
}
function fm(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null;) {
    var t = fm(e);
    if (t !== null) return t;
    e = e.sibling;
  }
  return null;
}
var pm = St.unstable_scheduleCallback,
  Tf = St.unstable_cancelCallback,
  ow = St.unstable_shouldYield,
  sw = St.unstable_requestPaint,
  Le = St.unstable_now,
  iw = St.unstable_getCurrentPriorityLevel,
  Hu = St.unstable_ImmediatePriority,
  hm = St.unstable_UserBlockingPriority,
  da = St.unstable_NormalPriority,
  aw = St.unstable_LowPriority,
  mm = St.unstable_IdlePriority,
  Ha = null,
  ln = null;
function lw(e) {
  if (ln && typeof ln.onCommitFiberRoot == "function")
    try {
      ln.onCommitFiberRoot(Ha, e, void 0, (e.current.flags & 128) === 128);
    } catch {}
}
var Qt = Math.clz32 ? Math.clz32 : dw,
  cw = Math.log,
  uw = Math.LN2;
function dw(e) {
  return ((e >>>= 0), e === 0 ? 32 : (31 - ((cw(e) / uw) | 0)) | 0);
}
var bi = 64,
  Ni = 4194304;
function Ss(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function fa(e, t) {
  var n = e.pendingLanes;
  if (n === 0) return 0;
  var r = 0,
    o = e.suspendedLanes,
    s = e.pingedLanes,
    a = n & 268435455;
  if (a !== 0) {
    var l = a & ~o;
    l !== 0 ? (r = Ss(l)) : ((s &= a), s !== 0 && (r = Ss(s)));
  } else ((a = n & ~o), a !== 0 ? (r = Ss(a)) : s !== 0 && (r = Ss(s)));
  if (r === 0) return 0;
  if (
    t !== 0 &&
    t !== r &&
    !(t & o) &&
    ((o = r & -r), (s = t & -t), o >= s || (o === 16 && (s & 4194240) !== 0))
  )
    return t;
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t;)
      ((n = 31 - Qt(t)), (o = 1 << n), (r |= e[n]), (t &= ~o));
  return r;
}
function fw(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function pw(e, t) {
  for (
    var n = e.suspendedLanes,
      r = e.pingedLanes,
      o = e.expirationTimes,
      s = e.pendingLanes;
    0 < s;
  ) {
    var a = 31 - Qt(s),
      l = 1 << a,
      c = o[a];
    (c === -1
      ? (!(l & n) || l & r) && (o[a] = fw(l, t))
      : c <= t && (e.expiredLanes |= l),
      (s &= ~l));
  }
}
function Oc(e) {
  return (
    (e = e.pendingLanes & -1073741825),
    e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
  );
}
function gm() {
  var e = bi;
  return ((bi <<= 1), !(bi & 4194240) && (bi = 64), e);
}
function Ml(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e);
  return t;
}
function ui(e, t, n) {
  ((e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - Qt(t)),
    (e[t] = n));
}
function hw(e, t) {
  var n = e.pendingLanes & ~t;
  ((e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements));
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < n;) {
    var o = 31 - Qt(n),
      s = 1 << o;
    ((t[o] = 0), (r[o] = -1), (e[o] = -1), (n &= ~s));
  }
}
function Ku(e, t) {
  var n = (e.entangledLanes |= t);
  for (e = e.entanglements; n;) {
    var r = 31 - Qt(n),
      o = 1 << r;
    ((o & t) | (e[r] & t) && (e[r] |= t), (n &= ~o));
  }
}
var he = 0;
function vm(e) {
  return (
    (e &= -e),
    1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1
  );
}
var ym,
  Qu,
  xm,
  wm,
  Sm,
  Mc = !1,
  Ci = [],
  Yn = null,
  Xn = null,
  Jn = null,
  zs = new Map(),
  $s = new Map(),
  $n = [],
  mw =
    "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(
      " ",
    );
function Rf(e, t) {
  switch (e) {
    case "focusin":
    case "focusout":
      Yn = null;
      break;
    case "dragenter":
    case "dragleave":
      Xn = null;
      break;
    case "mouseover":
    case "mouseout":
      Jn = null;
      break;
    case "pointerover":
    case "pointerout":
      zs.delete(t.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      $s.delete(t.pointerId);
  }
}
function ds(e, t, n, r, o, s) {
  return e === null || e.nativeEvent !== s
    ? ((e = {
        blockedOn: t,
        domEventName: n,
        eventSystemFlags: r,
        nativeEvent: s,
        targetContainers: [o],
      }),
      t !== null && ((t = fi(t)), t !== null && Qu(t)),
      e)
    : ((e.eventSystemFlags |= r),
      (t = e.targetContainers),
      o !== null && t.indexOf(o) === -1 && t.push(o),
      e);
}
function gw(e, t, n, r, o) {
  switch (t) {
    case "focusin":
      return ((Yn = ds(Yn, e, t, n, r, o)), !0);
    case "dragenter":
      return ((Xn = ds(Xn, e, t, n, r, o)), !0);
    case "mouseover":
      return ((Jn = ds(Jn, e, t, n, r, o)), !0);
    case "pointerover":
      var s = o.pointerId;
      return (zs.set(s, ds(zs.get(s) || null, e, t, n, r, o)), !0);
    case "gotpointercapture":
      return (
        (s = o.pointerId),
        $s.set(s, ds($s.get(s) || null, e, t, n, r, o)),
        !0
      );
  }
  return !1;
}
function jm(e) {
  var t = Er(e.target);
  if (t !== null) {
    var n = Qr(t);
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = um(n)), t !== null)) {
          ((e.blockedOn = t),
            Sm(e.priority, function () {
              xm(n);
            }));
          return;
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Qi(e) {
  if (e.blockedOn !== null) return !1;
  for (var t = e.targetContainers; 0 < t.length;) {
    var n = _c(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent);
    if (n === null) {
      n = e.nativeEvent;
      var r = new n.constructor(n.type, n);
      ((Tc = r), n.target.dispatchEvent(r), (Tc = null));
    } else return ((t = fi(n)), t !== null && Qu(t), (e.blockedOn = n), !1);
    t.shift();
  }
  return !0;
}
function Af(e, t, n) {
  Qi(e) && n.delete(t);
}
function vw() {
  ((Mc = !1),
    Yn !== null && Qi(Yn) && (Yn = null),
    Xn !== null && Qi(Xn) && (Xn = null),
    Jn !== null && Qi(Jn) && (Jn = null),
    zs.forEach(Af),
    $s.forEach(Af));
}
function fs(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null),
    Mc ||
      ((Mc = !0),
      St.unstable_scheduleCallback(St.unstable_NormalPriority, vw)));
}
function Us(e) {
  function t(o) {
    return fs(o, e);
  }
  if (0 < Ci.length) {
    fs(Ci[0], e);
    for (var n = 1; n < Ci.length; n++) {
      var r = Ci[n];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  for (
    Yn !== null && fs(Yn, e),
      Xn !== null && fs(Xn, e),
      Jn !== null && fs(Jn, e),
      zs.forEach(t),
      $s.forEach(t),
      n = 0;
    n < $n.length;
    n++
  )
    ((r = $n[n]), r.blockedOn === e && (r.blockedOn = null));
  for (; 0 < $n.length && ((n = $n[0]), n.blockedOn === null);)
    (jm(n), n.blockedOn === null && $n.shift());
}
var So = kn.ReactCurrentBatchConfig,
  pa = !0;
function yw(e, t, n, r) {
  var o = he,
    s = So.transition;
  So.transition = null;
  try {
    ((he = 1), qu(e, t, n, r));
  } finally {
    ((he = o), (So.transition = s));
  }
}
function xw(e, t, n, r) {
  var o = he,
    s = So.transition;
  So.transition = null;
  try {
    ((he = 4), qu(e, t, n, r));
  } finally {
    ((he = o), (So.transition = s));
  }
}
function qu(e, t, n, r) {
  if (pa) {
    var o = _c(e, t, n, r);
    if (o === null) (Wl(e, t, r, ha, n), Rf(e, r));
    else if (gw(o, e, t, n, r)) r.stopPropagation();
    else if ((Rf(e, r), t & 4 && -1 < mw.indexOf(e))) {
      for (; o !== null;) {
        var s = fi(o);
        if (
          (s !== null && ym(s),
          (s = _c(e, t, n, r)),
          s === null && Wl(e, t, r, ha, n),
          s === o)
        )
          break;
        o = s;
      }
      o !== null && r.stopPropagation();
    } else Wl(e, t, r, null, n);
  }
}
var ha = null;
function _c(e, t, n, r) {
  if (((ha = null), (e = Wu(r)), (e = Er(e)), e !== null))
    if (((t = Qr(e)), t === null)) e = null;
    else if (((n = t.tag), n === 13)) {
      if (((e = um(t)), e !== null)) return e;
      e = null;
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated)
        return t.tag === 3 ? t.stateNode.containerInfo : null;
      e = null;
    } else t !== e && (e = null);
  return ((ha = e), null);
}
function bm(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (iw()) {
        case Hu:
          return 1;
        case hm:
          return 4;
        case da:
        case aw:
          return 16;
        case mm:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var Qn = null,
  Gu = null,
  qi = null;
function Nm() {
  if (qi) return qi;
  var e,
    t = Gu,
    n = t.length,
    r,
    o = "value" in Qn ? Qn.value : Qn.textContent,
    s = o.length;
  for (e = 0; e < n && t[e] === o[e]; e++);
  var a = n - e;
  for (r = 1; r <= a && t[n - r] === o[s - r]; r++);
  return (qi = o.slice(e, 1 < r ? 1 - r : void 0));
}
function Gi(e) {
  var t = e.keyCode;
  return (
    "charCode" in e
      ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
      : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  );
}
function Ei() {
  return !0;
}
function If() {
  return !1;
}
function bt(e) {
  function t(n, r, o, s, a) {
    ((this._reactName = n),
      (this._targetInst = o),
      (this.type = r),
      (this.nativeEvent = s),
      (this.target = a),
      (this.currentTarget = null));
    for (var l in e)
      e.hasOwnProperty(l) && ((n = e[l]), (this[l] = n ? n(s) : s[l]));
    return (
      (this.isDefaultPrevented = (
        s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1
      )
        ? Ei
        : If),
      (this.isPropagationStopped = If),
      this
    );
  }
  return (
    Te(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0;
        var n = this.nativeEvent;
        n &&
          (n.preventDefault
            ? n.preventDefault()
            : typeof n.returnValue != "unknown" && (n.returnValue = !1),
          (this.isDefaultPrevented = Ei));
      },
      stopPropagation: function () {
        var n = this.nativeEvent;
        n &&
          (n.stopPropagation
            ? n.stopPropagation()
            : typeof n.cancelBubble != "unknown" && (n.cancelBubble = !0),
          (this.isPropagationStopped = Ei));
      },
      persist: function () {},
      isPersistent: Ei,
    }),
    t
  );
}
var Xo = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Yu = bt(Xo),
  di = Te({}, Xo, { view: 0, detail: 0 }),
  ww = bt(di),
  _l,
  Dl,
  ps,
  Ka = Te({}, di, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Xu,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget;
    },
    movementX: function (e) {
      return "movementX" in e
        ? e.movementX
        : (e !== ps &&
            (ps && e.type === "mousemove"
              ? ((_l = e.screenX - ps.screenX), (Dl = e.screenY - ps.screenY))
              : (Dl = _l = 0),
            (ps = e)),
          _l);
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : Dl;
    },
  }),
  Of = bt(Ka),
  Sw = Te({}, Ka, { dataTransfer: 0 }),
  jw = bt(Sw),
  bw = Te({}, di, { relatedTarget: 0 }),
  Ll = bt(bw),
  Nw = Te({}, Xo, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Cw = bt(Nw),
  Ew = Te({}, Xo, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    },
  }),
  kw = bt(Ew),
  Pw = Te({}, Xo, { data: 0 }),
  Mf = bt(Pw),
  Tw = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified",
  },
  Rw = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta",
  },
  Aw = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey",
  };
function Iw(e) {
  var t = this.nativeEvent;
  return t.getModifierState ? t.getModifierState(e) : (e = Aw[e]) ? !!t[e] : !1;
}
function Xu() {
  return Iw;
}
var Ow = Te({}, di, {
    key: function (e) {
      if (e.key) {
        var t = Tw[e.key] || e.key;
        if (t !== "Unidentified") return t;
      }
      return e.type === "keypress"
        ? ((e = Gi(e)), e === 13 ? "Enter" : String.fromCharCode(e))
        : e.type === "keydown" || e.type === "keyup"
          ? Rw[e.keyCode] || "Unidentified"
          : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Xu,
    charCode: function (e) {
      return e.type === "keypress" ? Gi(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress"
        ? Gi(e)
        : e.type === "keydown" || e.type === "keyup"
          ? e.keyCode
          : 0;
    },
  }),
  Mw = bt(Ow),
  _w = Te({}, Ka, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  _f = bt(_w),
  Dw = Te({}, di, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Xu,
  }),
  Lw = bt(Dw),
  Fw = Te({}, Xo, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  zw = bt(Fw),
  $w = Te({}, Ka, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e
        ? e.deltaY
        : "wheelDeltaY" in e
          ? -e.wheelDeltaY
          : "wheelDelta" in e
            ? -e.wheelDelta
            : 0;
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  Uw = bt($w),
  Bw = [9, 13, 27, 32],
  Ju = Sn && "CompositionEvent" in window,
  Ps = null;
Sn && "documentMode" in document && (Ps = document.documentMode);
var Vw = Sn && "TextEvent" in window && !Ps,
  Cm = Sn && (!Ju || (Ps && 8 < Ps && 11 >= Ps)),
  Df = " ",
  Lf = !1;
function Em(e, t) {
  switch (e) {
    case "keyup":
      return Bw.indexOf(t.keyCode) !== -1;
    case "keydown":
      return t.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function km(e) {
  return ((e = e.detail), typeof e == "object" && "data" in e ? e.data : null);
}
var ao = !1;
function Ww(e, t) {
  switch (e) {
    case "compositionend":
      return km(t);
    case "keypress":
      return t.which !== 32 ? null : ((Lf = !0), Df);
    case "textInput":
      return ((e = t.data), e === Df && Lf ? null : e);
    default:
      return null;
  }
}
function Hw(e, t) {
  if (ao)
    return e === "compositionend" || (!Ju && Em(e, t))
      ? ((e = Nm()), (qi = Gu = Qn = null), (ao = !1), e)
      : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char;
        if (t.which) return String.fromCharCode(t.which);
      }
      return null;
    case "compositionend":
      return Cm && t.locale !== "ko" ? null : t.data;
    default:
      return null;
  }
}
var Kw = {
  color: !0,
  date: !0,
  datetime: !0,
  "datetime-local": !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
};
function Ff(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return t === "input" ? !!Kw[e.type] : t === "textarea";
}
function Pm(e, t, n, r) {
  (sm(r),
    (t = ma(t, "onChange")),
    0 < t.length &&
      ((n = new Yu("onChange", "change", null, n, r)),
      e.push({ event: n, listeners: t })));
}
var Ts = null,
  Bs = null;
function Qw(e) {
  zm(e, 0);
}
function Qa(e) {
  var t = uo(e);
  if (Jh(t)) return e;
}
function qw(e, t) {
  if (e === "change") return t;
}
var Tm = !1;
if (Sn) {
  var Fl;
  if (Sn) {
    var zl = "oninput" in document;
    if (!zl) {
      var zf = document.createElement("div");
      (zf.setAttribute("oninput", "return;"),
        (zl = typeof zf.oninput == "function"));
    }
    Fl = zl;
  } else Fl = !1;
  Tm = Fl && (!document.documentMode || 9 < document.documentMode);
}
function $f() {
  Ts && (Ts.detachEvent("onpropertychange", Rm), (Bs = Ts = null));
}
function Rm(e) {
  if (e.propertyName === "value" && Qa(Bs)) {
    var t = [];
    (Pm(t, Bs, e, Wu(e)), cm(Qw, t));
  }
}
function Gw(e, t, n) {
  e === "focusin"
    ? ($f(), (Ts = t), (Bs = n), Ts.attachEvent("onpropertychange", Rm))
    : e === "focusout" && $f();
}
function Yw(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown")
    return Qa(Bs);
}
function Xw(e, t) {
  if (e === "click") return Qa(t);
}
function Jw(e, t) {
  if (e === "input" || e === "change") return Qa(t);
}
function Zw(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var Gt = typeof Object.is == "function" ? Object.is : Zw;
function Vs(e, t) {
  if (Gt(e, t)) return !0;
  if (typeof e != "object" || e === null || typeof t != "object" || t === null)
    return !1;
  var n = Object.keys(e),
    r = Object.keys(t);
  if (n.length !== r.length) return !1;
  for (r = 0; r < n.length; r++) {
    var o = n[r];
    if (!vc.call(t, o) || !Gt(e[o], t[o])) return !1;
  }
  return !0;
}
function Uf(e) {
  for (; e && e.firstChild;) e = e.firstChild;
  return e;
}
function Bf(e, t) {
  var n = Uf(e);
  e = 0;
  for (var r; n;) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t))
        return { node: n, offset: t - e };
      e = r;
    }
    e: {
      for (; n;) {
        if (n.nextSibling) {
          n = n.nextSibling;
          break e;
        }
        n = n.parentNode;
      }
      n = void 0;
    }
    n = Uf(n);
  }
}
function Am(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
        ? !1
        : t && t.nodeType === 3
          ? Am(e, t.parentNode)
          : "contains" in e
            ? e.contains(t)
            : e.compareDocumentPosition
              ? !!(e.compareDocumentPosition(t) & 16)
              : !1
    : !1;
}
function Im() {
  for (var e = window, t = la(); t instanceof e.HTMLIFrameElement;) {
    try {
      var n = typeof t.contentWindow.location.href == "string";
    } catch {
      n = !1;
    }
    if (n) e = t.contentWindow;
    else break;
    t = la(e.document);
  }
  return t;
}
function Zu(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase();
  return (
    t &&
    ((t === "input" &&
      (e.type === "text" ||
        e.type === "search" ||
        e.type === "tel" ||
        e.type === "url" ||
        e.type === "password")) ||
      t === "textarea" ||
      e.contentEditable === "true")
  );
}
function e1(e) {
  var t = Im(),
    n = e.focusedElem,
    r = e.selectionRange;
  if (
    t !== n &&
    n &&
    n.ownerDocument &&
    Am(n.ownerDocument.documentElement, n)
  ) {
    if (r !== null && Zu(n)) {
      if (
        ((t = r.start),
        (e = r.end),
        e === void 0 && (e = t),
        "selectionStart" in n)
      )
        ((n.selectionStart = t),
          (n.selectionEnd = Math.min(e, n.value.length)));
      else if (
        ((e = ((t = n.ownerDocument || document) && t.defaultView) || window),
        e.getSelection)
      ) {
        e = e.getSelection();
        var o = n.textContent.length,
          s = Math.min(r.start, o);
        ((r = r.end === void 0 ? s : Math.min(r.end, o)),
          !e.extend && s > r && ((o = r), (r = s), (s = o)),
          (o = Bf(n, s)));
        var a = Bf(n, r);
        o &&
          a &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== o.node ||
            e.anchorOffset !== o.offset ||
            e.focusNode !== a.node ||
            e.focusOffset !== a.offset) &&
          ((t = t.createRange()),
          t.setStart(o.node, o.offset),
          e.removeAllRanges(),
          s > r
            ? (e.addRange(t), e.extend(a.node, a.offset))
            : (t.setEnd(a.node, a.offset), e.addRange(t)));
      }
    }
    for (t = [], e = n; (e = e.parentNode);)
      e.nodeType === 1 &&
        t.push({ element: e, left: e.scrollLeft, top: e.scrollTop });
    for (typeof n.focus == "function" && n.focus(), n = 0; n < t.length; n++)
      ((e = t[n]),
        (e.element.scrollLeft = e.left),
        (e.element.scrollTop = e.top));
  }
}
var t1 = Sn && "documentMode" in document && 11 >= document.documentMode,
  lo = null,
  Dc = null,
  Rs = null,
  Lc = !1;
function Vf(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
  Lc ||
    lo == null ||
    lo !== la(r) ||
    ((r = lo),
    "selectionStart" in r && Zu(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = (
          (r.ownerDocument && r.ownerDocument.defaultView) ||
          window
        ).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (Rs && Vs(Rs, r)) ||
      ((Rs = r),
      (r = ma(Dc, "onSelect")),
      0 < r.length &&
        ((t = new Yu("onSelect", "select", null, t, n)),
        e.push({ event: t, listeners: r }),
        (t.target = lo))));
}
function ki(e, t) {
  var n = {};
  return (
    (n[e.toLowerCase()] = t.toLowerCase()),
    (n["Webkit" + e] = "webkit" + t),
    (n["Moz" + e] = "moz" + t),
    n
  );
}
var co = {
    animationend: ki("Animation", "AnimationEnd"),
    animationiteration: ki("Animation", "AnimationIteration"),
    animationstart: ki("Animation", "AnimationStart"),
    transitionend: ki("Transition", "TransitionEnd"),
  },
  $l = {},
  Om = {};
Sn &&
  ((Om = document.createElement("div").style),
  "AnimationEvent" in window ||
    (delete co.animationend.animation,
    delete co.animationiteration.animation,
    delete co.animationstart.animation),
  "TransitionEvent" in window || delete co.transitionend.transition);
function qa(e) {
  if ($l[e]) return $l[e];
  if (!co[e]) return e;
  var t = co[e],
    n;
  for (n in t) if (t.hasOwnProperty(n) && n in Om) return ($l[e] = t[n]);
  return e;
}
var Mm = qa("animationend"),
  _m = qa("animationiteration"),
  Dm = qa("animationstart"),
  Lm = qa("transitionend"),
  Fm = new Map(),
  Wf =
    "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(
      " ",
    );
function dr(e, t) {
  (Fm.set(e, t), Kr(t, [e]));
}
for (var Ul = 0; Ul < Wf.length; Ul++) {
  var Bl = Wf[Ul],
    n1 = Bl.toLowerCase(),
    r1 = Bl[0].toUpperCase() + Bl.slice(1);
  dr(n1, "on" + r1);
}
dr(Mm, "onAnimationEnd");
dr(_m, "onAnimationIteration");
dr(Dm, "onAnimationStart");
dr("dblclick", "onDoubleClick");
dr("focusin", "onFocus");
dr("focusout", "onBlur");
dr(Lm, "onTransitionEnd");
Do("onMouseEnter", ["mouseout", "mouseover"]);
Do("onMouseLeave", ["mouseout", "mouseover"]);
Do("onPointerEnter", ["pointerout", "pointerover"]);
Do("onPointerLeave", ["pointerout", "pointerover"]);
Kr(
  "onChange",
  "change click focusin focusout input keydown keyup selectionchange".split(
    " ",
  ),
);
Kr(
  "onSelect",
  "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(
    " ",
  ),
);
Kr("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
Kr(
  "onCompositionEnd",
  "compositionend focusout keydown keypress keyup mousedown".split(" "),
);
Kr(
  "onCompositionStart",
  "compositionstart focusout keydown keypress keyup mousedown".split(" "),
);
Kr(
  "onCompositionUpdate",
  "compositionupdate focusout keydown keypress keyup mousedown".split(" "),
);
var js =
    "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(
      " ",
    ),
  o1 = new Set("cancel close invalid load scroll toggle".split(" ").concat(js));
function Hf(e, t, n) {
  var r = e.type || "unknown-event";
  ((e.currentTarget = n), nw(r, t, void 0, e), (e.currentTarget = null));
}
function zm(e, t) {
  t = (t & 4) !== 0;
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      o = r.event;
    r = r.listeners;
    e: {
      var s = void 0;
      if (t)
        for (var a = r.length - 1; 0 <= a; a--) {
          var l = r[a],
            c = l.instance,
            u = l.currentTarget;
          if (((l = l.listener), c !== s && o.isPropagationStopped())) break e;
          (Hf(o, l, u), (s = c));
        }
      else
        for (a = 0; a < r.length; a++) {
          if (
            ((l = r[a]),
            (c = l.instance),
            (u = l.currentTarget),
            (l = l.listener),
            c !== s && o.isPropagationStopped())
          )
            break e;
          (Hf(o, l, u), (s = c));
        }
    }
  }
  if (ua) throw ((e = Ic), (ua = !1), (Ic = null), e);
}
function Se(e, t) {
  var n = t[Bc];
  n === void 0 && (n = t[Bc] = new Set());
  var r = e + "__bubble";
  n.has(r) || ($m(t, e, 2, !1), n.add(r));
}
function Vl(e, t, n) {
  var r = 0;
  (t && (r |= 4), $m(n, e, r, t));
}
var Pi = "_reactListening" + Math.random().toString(36).slice(2);
function Ws(e) {
  if (!e[Pi]) {
    ((e[Pi] = !0),
      Qh.forEach(function (n) {
        n !== "selectionchange" && (o1.has(n) || Vl(n, !1, e), Vl(n, !0, e));
      }));
    var t = e.nodeType === 9 ? e : e.ownerDocument;
    t === null || t[Pi] || ((t[Pi] = !0), Vl("selectionchange", !1, t));
  }
}
function $m(e, t, n, r) {
  switch (bm(t)) {
    case 1:
      var o = yw;
      break;
    case 4:
      o = xw;
      break;
    default:
      o = qu;
  }
  ((n = o.bind(null, t, n, e)),
    (o = void 0),
    !Ac ||
      (t !== "touchstart" && t !== "touchmove" && t !== "wheel") ||
      (o = !0),
    r
      ? o !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: o })
        : e.addEventListener(t, n, !0)
      : o !== void 0
        ? e.addEventListener(t, n, { passive: o })
        : e.addEventListener(t, n, !1));
}
function Wl(e, t, n, r, o) {
  var s = r;
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return;
      var a = r.tag;
      if (a === 3 || a === 4) {
        var l = r.stateNode.containerInfo;
        if (l === o || (l.nodeType === 8 && l.parentNode === o)) break;
        if (a === 4)
          for (a = r.return; a !== null;) {
            var c = a.tag;
            if (
              (c === 3 || c === 4) &&
              ((c = a.stateNode.containerInfo),
              c === o || (c.nodeType === 8 && c.parentNode === o))
            )
              return;
            a = a.return;
          }
        for (; l !== null;) {
          if (((a = Er(l)), a === null)) return;
          if (((c = a.tag), c === 5 || c === 6)) {
            r = s = a;
            continue e;
          }
          l = l.parentNode;
        }
      }
      r = r.return;
    }
  cm(function () {
    var u = s,
      d = Wu(n),
      p = [];
    e: {
      var m = Fm.get(e);
      if (m !== void 0) {
        var g = Yu,
          S = e;
        switch (e) {
          case "keypress":
            if (Gi(n) === 0) break e;
          case "keydown":
          case "keyup":
            g = Mw;
            break;
          case "focusin":
            ((S = "focus"), (g = Ll));
            break;
          case "focusout":
            ((S = "blur"), (g = Ll));
            break;
          case "beforeblur":
          case "afterblur":
            g = Ll;
            break;
          case "click":
            if (n.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            g = Of;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            g = jw;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            g = Lw;
            break;
          case Mm:
          case _m:
          case Dm:
            g = Cw;
            break;
          case Lm:
            g = zw;
            break;
          case "scroll":
            g = ww;
            break;
          case "wheel":
            g = Uw;
            break;
          case "copy":
          case "cut":
          case "paste":
            g = kw;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            g = _f;
        }
        var h = (t & 4) !== 0,
          w = !h && e === "scroll",
          y = h ? (m !== null ? m + "Capture" : null) : m;
        h = [];
        for (var v = u, x; v !== null;) {
          x = v;
          var j = x.stateNode;
          if (
            (x.tag === 5 &&
              j !== null &&
              ((x = j),
              y !== null && ((j = Fs(v, y)), j != null && h.push(Hs(v, j, x)))),
            w)
          )
            break;
          v = v.return;
        }
        0 < h.length &&
          ((m = new g(m, S, null, n, d)), p.push({ event: m, listeners: h }));
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((m = e === "mouseover" || e === "pointerover"),
          (g = e === "mouseout" || e === "pointerout"),
          m &&
            n !== Tc &&
            (S = n.relatedTarget || n.fromElement) &&
            (Er(S) || S[jn]))
        )
          break e;
        if (
          (g || m) &&
          ((m =
            d.window === d
              ? d
              : (m = d.ownerDocument)
                ? m.defaultView || m.parentWindow
                : window),
          g
            ? ((S = n.relatedTarget || n.toElement),
              (g = u),
              (S = S ? Er(S) : null),
              S !== null &&
                ((w = Qr(S)), S !== w || (S.tag !== 5 && S.tag !== 6)) &&
                (S = null))
            : ((g = null), (S = u)),
          g !== S)
        ) {
          if (
            ((h = Of),
            (j = "onMouseLeave"),
            (y = "onMouseEnter"),
            (v = "mouse"),
            (e === "pointerout" || e === "pointerover") &&
              ((h = _f),
              (j = "onPointerLeave"),
              (y = "onPointerEnter"),
              (v = "pointer")),
            (w = g == null ? m : uo(g)),
            (x = S == null ? m : uo(S)),
            (m = new h(j, v + "leave", g, n, d)),
            (m.target = w),
            (m.relatedTarget = x),
            (j = null),
            Er(d) === u &&
              ((h = new h(y, v + "enter", S, n, d)),
              (h.target = x),
              (h.relatedTarget = w),
              (j = h)),
            (w = j),
            g && S)
          )
            t: {
              for (h = g, y = S, v = 0, x = h; x; x = to(x)) v++;
              for (x = 0, j = y; j; j = to(j)) x++;
              for (; 0 < v - x;) ((h = to(h)), v--);
              for (; 0 < x - v;) ((y = to(y)), x--);
              for (; v--;) {
                if (h === y || (y !== null && h === y.alternate)) break t;
                ((h = to(h)), (y = to(y)));
              }
              h = null;
            }
          else h = null;
          (g !== null && Kf(p, m, g, h, !1),
            S !== null && w !== null && Kf(p, w, S, h, !0));
        }
      }
      e: {
        if (
          ((m = u ? uo(u) : window),
          (g = m.nodeName && m.nodeName.toLowerCase()),
          g === "select" || (g === "input" && m.type === "file"))
        )
          var b = qw;
        else if (Ff(m))
          if (Tm) b = Jw;
          else {
            b = Yw;
            var N = Gw;
          }
        else
          (g = m.nodeName) &&
            g.toLowerCase() === "input" &&
            (m.type === "checkbox" || m.type === "radio") &&
            (b = Xw);
        if (b && (b = b(e, u))) {
          Pm(p, b, n, d);
          break e;
        }
        (N && N(e, m, u),
          e === "focusout" &&
            (N = m._wrapperState) &&
            N.controlled &&
            m.type === "number" &&
            Nc(m, "number", m.value));
      }
      switch (((N = u ? uo(u) : window), e)) {
        case "focusin":
          (Ff(N) || N.contentEditable === "true") &&
            ((lo = N), (Dc = u), (Rs = null));
          break;
        case "focusout":
          Rs = Dc = lo = null;
          break;
        case "mousedown":
          Lc = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          ((Lc = !1), Vf(p, n, d));
          break;
        case "selectionchange":
          if (t1) break;
        case "keydown":
        case "keyup":
          Vf(p, n, d);
      }
      var C;
      if (Ju)
        e: {
          switch (e) {
            case "compositionstart":
              var T = "onCompositionStart";
              break e;
            case "compositionend":
              T = "onCompositionEnd";
              break e;
            case "compositionupdate":
              T = "onCompositionUpdate";
              break e;
          }
          T = void 0;
        }
      else
        ao
          ? Em(e, n) && (T = "onCompositionEnd")
          : e === "keydown" && n.keyCode === 229 && (T = "onCompositionStart");
      (T &&
        (Cm &&
          n.locale !== "ko" &&
          (ao || T !== "onCompositionStart"
            ? T === "onCompositionEnd" && ao && (C = Nm())
            : ((Qn = d),
              (Gu = "value" in Qn ? Qn.value : Qn.textContent),
              (ao = !0))),
        (N = ma(u, T)),
        0 < N.length &&
          ((T = new Mf(T, e, null, n, d)),
          p.push({ event: T, listeners: N }),
          C ? (T.data = C) : ((C = km(n)), C !== null && (T.data = C)))),
        (C = Vw ? Ww(e, n) : Hw(e, n)) &&
          ((u = ma(u, "onBeforeInput")),
          0 < u.length &&
            ((d = new Mf("onBeforeInput", "beforeinput", null, n, d)),
            p.push({ event: d, listeners: u }),
            (d.data = C))));
    }
    zm(p, t);
  });
}
function Hs(e, t, n) {
  return { instance: e, listener: t, currentTarget: n };
}
function ma(e, t) {
  for (var n = t + "Capture", r = []; e !== null;) {
    var o = e,
      s = o.stateNode;
    (o.tag === 5 &&
      s !== null &&
      ((o = s),
      (s = Fs(e, n)),
      s != null && r.unshift(Hs(e, s, o)),
      (s = Fs(e, t)),
      s != null && r.push(Hs(e, s, o))),
      (e = e.return));
  }
  return r;
}
function to(e) {
  if (e === null) return null;
  do e = e.return;
  while (e && e.tag !== 5);
  return e || null;
}
function Kf(e, t, n, r, o) {
  for (var s = t._reactName, a = []; n !== null && n !== r;) {
    var l = n,
      c = l.alternate,
      u = l.stateNode;
    if (c !== null && c === r) break;
    (l.tag === 5 &&
      u !== null &&
      ((l = u),
      o
        ? ((c = Fs(n, s)), c != null && a.unshift(Hs(n, c, l)))
        : o || ((c = Fs(n, s)), c != null && a.push(Hs(n, c, l)))),
      (n = n.return));
  }
  a.length !== 0 && e.push({ event: t, listeners: a });
}
var s1 = /\r\n?/g,
  i1 = /\u0000|\uFFFD/g;
function Qf(e) {
  return (typeof e == "string" ? e : "" + e)
    .replace(
      s1,
      `
`,
    )
    .replace(i1, "");
}
function Ti(e, t, n) {
  if (((t = Qf(t)), Qf(e) !== t && n)) throw Error(R(425));
}
function ga() {}
var Fc = null,
  zc = null;
function $c(e, t) {
  return (
    e === "textarea" ||
    e === "noscript" ||
    typeof t.children == "string" ||
    typeof t.children == "number" ||
    (typeof t.dangerouslySetInnerHTML == "object" &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  );
}
var Uc = typeof setTimeout == "function" ? setTimeout : void 0,
  a1 = typeof clearTimeout == "function" ? clearTimeout : void 0,
  qf = typeof Promise == "function" ? Promise : void 0,
  l1 =
    typeof queueMicrotask == "function"
      ? queueMicrotask
      : typeof qf < "u"
        ? function (e) {
            return qf.resolve(null).then(e).catch(c1);
          }
        : Uc;
function c1(e) {
  setTimeout(function () {
    throw e;
  });
}
function Hl(e, t) {
  var n = t,
    r = 0;
  do {
    var o = n.nextSibling;
    if ((e.removeChild(n), o && o.nodeType === 8))
      if (((n = o.data), n === "/$")) {
        if (r === 0) {
          (e.removeChild(o), Us(t));
          return;
        }
        r--;
      } else (n !== "$" && n !== "$?" && n !== "$!") || r++;
    n = o;
  } while (n);
  Us(t);
}
function Zn(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType;
    if (t === 1 || t === 3) break;
    if (t === 8) {
      if (((t = e.data), t === "$" || t === "$!" || t === "$?")) break;
      if (t === "/$") return null;
    }
  }
  return e;
}
function Gf(e) {
  e = e.previousSibling;
  for (var t = 0; e;) {
    if (e.nodeType === 8) {
      var n = e.data;
      if (n === "$" || n === "$!" || n === "$?") {
        if (t === 0) return e;
        t--;
      } else n === "/$" && t++;
    }
    e = e.previousSibling;
  }
  return null;
}
var Jo = Math.random().toString(36).slice(2),
  sn = "__reactFiber$" + Jo,
  Ks = "__reactProps$" + Jo,
  jn = "__reactContainer$" + Jo,
  Bc = "__reactEvents$" + Jo,
  u1 = "__reactListeners$" + Jo,
  d1 = "__reactHandles$" + Jo;
function Er(e) {
  var t = e[sn];
  if (t) return t;
  for (var n = e.parentNode; n;) {
    if ((t = n[jn] || n[sn])) {
      if (
        ((n = t.alternate),
        t.child !== null || (n !== null && n.child !== null))
      )
        for (e = Gf(e); e !== null;) {
          if ((n = e[sn])) return n;
          e = Gf(e);
        }
      return t;
    }
    ((e = n), (n = e.parentNode));
  }
  return null;
}
function fi(e) {
  return (
    (e = e[sn] || e[jn]),
    !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
  );
}
function uo(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(R(33));
}
function Ga(e) {
  return e[Ks] || null;
}
var Vc = [],
  fo = -1;
function fr(e) {
  return { current: e };
}
function je(e) {
  0 > fo || ((e.current = Vc[fo]), (Vc[fo] = null), fo--);
}
function ve(e, t) {
  (fo++, (Vc[fo] = e.current), (e.current = t));
}
var ir = {},
  nt = fr(ir),
  ft = fr(!1),
  Lr = ir;
function Lo(e, t) {
  var n = e.type.contextTypes;
  if (!n) return ir;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t)
    return r.__reactInternalMemoizedMaskedChildContext;
  var o = {},
    s;
  for (s in n) o[s] = t[s];
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = o)),
    o
  );
}
function pt(e) {
  return ((e = e.childContextTypes), e != null);
}
function va() {
  (je(ft), je(nt));
}
function Yf(e, t, n) {
  if (nt.current !== ir) throw Error(R(168));
  (ve(nt, t), ve(ft, n));
}
function Um(e, t, n) {
  var r = e.stateNode;
  if (((t = t.childContextTypes), typeof r.getChildContext != "function"))
    return n;
  r = r.getChildContext();
  for (var o in r) if (!(o in t)) throw Error(R(108, G0(e) || "Unknown", o));
  return Te({}, n, r);
}
function ya(e) {
  return (
    (e =
      ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || ir),
    (Lr = nt.current),
    ve(nt, e),
    ve(ft, ft.current),
    !0
  );
}
function Xf(e, t, n) {
  var r = e.stateNode;
  if (!r) throw Error(R(169));
  (n
    ? ((e = Um(e, t, Lr)),
      (r.__reactInternalMemoizedMergedChildContext = e),
      je(ft),
      je(nt),
      ve(nt, e))
    : je(ft),
    ve(ft, n));
}
var mn = null,
  Ya = !1,
  Kl = !1;
function Bm(e) {
  mn === null ? (mn = [e]) : mn.push(e);
}
function f1(e) {
  ((Ya = !0), Bm(e));
}
function pr() {
  if (!Kl && mn !== null) {
    Kl = !0;
    var e = 0,
      t = he;
    try {
      var n = mn;
      for (he = 1; e < n.length; e++) {
        var r = n[e];
        do r = r(!0);
        while (r !== null);
      }
      ((mn = null), (Ya = !1));
    } catch (o) {
      throw (mn !== null && (mn = mn.slice(e + 1)), pm(Hu, pr), o);
    } finally {
      ((he = t), (Kl = !1));
    }
  }
  return null;
}
var po = [],
  ho = 0,
  xa = null,
  wa = 0,
  kt = [],
  Pt = 0,
  Fr = null,
  vn = 1,
  yn = "";
function br(e, t) {
  ((po[ho++] = wa), (po[ho++] = xa), (xa = e), (wa = t));
}
function Vm(e, t, n) {
  ((kt[Pt++] = vn), (kt[Pt++] = yn), (kt[Pt++] = Fr), (Fr = e));
  var r = vn;
  e = yn;
  var o = 32 - Qt(r) - 1;
  ((r &= ~(1 << o)), (n += 1));
  var s = 32 - Qt(t) + o;
  if (30 < s) {
    var a = o - (o % 5);
    ((s = (r & ((1 << a) - 1)).toString(32)),
      (r >>= a),
      (o -= a),
      (vn = (1 << (32 - Qt(t) + o)) | (n << o) | r),
      (yn = s + e));
  } else ((vn = (1 << s) | (n << o) | r), (yn = e));
}
function ed(e) {
  e.return !== null && (br(e, 1), Vm(e, 1, 0));
}
function td(e) {
  for (; e === xa;)
    ((xa = po[--ho]), (po[ho] = null), (wa = po[--ho]), (po[ho] = null));
  for (; e === Fr;)
    ((Fr = kt[--Pt]),
      (kt[Pt] = null),
      (yn = kt[--Pt]),
      (kt[Pt] = null),
      (vn = kt[--Pt]),
      (kt[Pt] = null));
}
var xt = null,
  yt = null,
  Ee = !1,
  Ht = null;
function Wm(e, t) {
  var n = Tt(5, null, null, 0);
  ((n.elementType = "DELETED"),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n));
}
function Jf(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type;
      return (
        (t =
          t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase()
            ? null
            : t),
        t !== null
          ? ((e.stateNode = t), (xt = e), (yt = Zn(t.firstChild)), !0)
          : !1
      );
    case 6:
      return (
        (t = e.pendingProps === "" || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (xt = e), (yt = null), !0) : !1
      );
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = Fr !== null ? { id: vn, overflow: yn } : null),
            (e.memoizedState = {
              dehydrated: t,
              treeContext: n,
              retryLane: 1073741824,
            }),
            (n = Tt(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (xt = e),
            (yt = null),
            !0)
          : !1
      );
    default:
      return !1;
  }
}
function Wc(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Hc(e) {
  if (Ee) {
    var t = yt;
    if (t) {
      var n = t;
      if (!Jf(e, t)) {
        if (Wc(e)) throw Error(R(418));
        t = Zn(n.nextSibling);
        var r = xt;
        t && Jf(e, t)
          ? Wm(r, n)
          : ((e.flags = (e.flags & -4097) | 2), (Ee = !1), (xt = e));
      }
    } else {
      if (Wc(e)) throw Error(R(418));
      ((e.flags = (e.flags & -4097) | 2), (Ee = !1), (xt = e));
    }
  }
}
function Zf(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;)
    e = e.return;
  xt = e;
}
function Ri(e) {
  if (e !== xt) return !1;
  if (!Ee) return (Zf(e), (Ee = !0), !1);
  var t;
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type),
      (t = t !== "head" && t !== "body" && !$c(e.type, e.memoizedProps))),
    t && (t = yt))
  ) {
    if (Wc(e)) throw (Hm(), Error(R(418)));
    for (; t;) (Wm(e, t), (t = Zn(t.nextSibling)));
  }
  if ((Zf(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
      throw Error(R(317));
    e: {
      for (e = e.nextSibling, t = 0; e;) {
        if (e.nodeType === 8) {
          var n = e.data;
          if (n === "/$") {
            if (t === 0) {
              yt = Zn(e.nextSibling);
              break e;
            }
            t--;
          } else (n !== "$" && n !== "$!" && n !== "$?") || t++;
        }
        e = e.nextSibling;
      }
      yt = null;
    }
  } else yt = xt ? Zn(e.stateNode.nextSibling) : null;
  return !0;
}
function Hm() {
  for (var e = yt; e;) e = Zn(e.nextSibling);
}
function Fo() {
  ((yt = xt = null), (Ee = !1));
}
function nd(e) {
  Ht === null ? (Ht = [e]) : Ht.push(e);
}
var p1 = kn.ReactCurrentBatchConfig;
function hs(e, t, n) {
  if (
    ((e = n.ref), e !== null && typeof e != "function" && typeof e != "object")
  ) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(R(309));
        var r = n.stateNode;
      }
      if (!r) throw Error(R(147, e));
      var o = r,
        s = "" + e;
      return t !== null &&
        t.ref !== null &&
        typeof t.ref == "function" &&
        t.ref._stringRef === s
        ? t.ref
        : ((t = function (a) {
            var l = o.refs;
            a === null ? delete l[s] : (l[s] = a);
          }),
          (t._stringRef = s),
          t);
    }
    if (typeof e != "string") throw Error(R(284));
    if (!n._owner) throw Error(R(290, e));
  }
  return e;
}
function Ai(e, t) {
  throw (
    (e = Object.prototype.toString.call(t)),
    Error(
      R(
        31,
        e === "[object Object]"
          ? "object with keys {" + Object.keys(t).join(", ") + "}"
          : e,
      ),
    )
  );
}
function ep(e) {
  var t = e._init;
  return t(e._payload);
}
function Km(e) {
  function t(y, v) {
    if (e) {
      var x = y.deletions;
      x === null ? ((y.deletions = [v]), (y.flags |= 16)) : x.push(v);
    }
  }
  function n(y, v) {
    if (!e) return null;
    for (; v !== null;) (t(y, v), (v = v.sibling));
    return null;
  }
  function r(y, v) {
    for (y = new Map(); v !== null;)
      (v.key !== null ? y.set(v.key, v) : y.set(v.index, v), (v = v.sibling));
    return y;
  }
  function o(y, v) {
    return ((y = rr(y, v)), (y.index = 0), (y.sibling = null), y);
  }
  function s(y, v, x) {
    return (
      (y.index = x),
      e
        ? ((x = y.alternate),
          x !== null
            ? ((x = x.index), x < v ? ((y.flags |= 2), v) : x)
            : ((y.flags |= 2), v))
        : ((y.flags |= 1048576), v)
    );
  }
  function a(y) {
    return (e && y.alternate === null && (y.flags |= 2), y);
  }
  function l(y, v, x, j) {
    return v === null || v.tag !== 6
      ? ((v = Zl(x, y.mode, j)), (v.return = y), v)
      : ((v = o(v, x)), (v.return = y), v);
  }
  function c(y, v, x, j) {
    var b = x.type;
    return b === io
      ? d(y, v, x.props.children, j, x.key)
      : v !== null &&
          (v.elementType === b ||
            (typeof b == "object" &&
              b !== null &&
              b.$$typeof === Fn &&
              ep(b) === v.type))
        ? ((j = o(v, x.props)), (j.ref = hs(y, v, x)), (j.return = y), j)
        : ((j = na(x.type, x.key, x.props, null, y.mode, j)),
          (j.ref = hs(y, v, x)),
          (j.return = y),
          j);
  }
  function u(y, v, x, j) {
    return v === null ||
      v.tag !== 4 ||
      v.stateNode.containerInfo !== x.containerInfo ||
      v.stateNode.implementation !== x.implementation
      ? ((v = ec(x, y.mode, j)), (v.return = y), v)
      : ((v = o(v, x.children || [])), (v.return = y), v);
  }
  function d(y, v, x, j, b) {
    return v === null || v.tag !== 7
      ? ((v = Dr(x, y.mode, j, b)), (v.return = y), v)
      : ((v = o(v, x)), (v.return = y), v);
  }
  function p(y, v, x) {
    if ((typeof v == "string" && v !== "") || typeof v == "number")
      return ((v = Zl("" + v, y.mode, x)), (v.return = y), v);
    if (typeof v == "object" && v !== null) {
      switch (v.$$typeof) {
        case wi:
          return (
            (x = na(v.type, v.key, v.props, null, y.mode, x)),
            (x.ref = hs(y, null, v)),
            (x.return = y),
            x
          );
        case so:
          return ((v = ec(v, y.mode, x)), (v.return = y), v);
        case Fn:
          var j = v._init;
          return p(y, j(v._payload), x);
      }
      if (ws(v) || cs(v))
        return ((v = Dr(v, y.mode, x, null)), (v.return = y), v);
      Ai(y, v);
    }
    return null;
  }
  function m(y, v, x, j) {
    var b = v !== null ? v.key : null;
    if ((typeof x == "string" && x !== "") || typeof x == "number")
      return b !== null ? null : l(y, v, "" + x, j);
    if (typeof x == "object" && x !== null) {
      switch (x.$$typeof) {
        case wi:
          return x.key === b ? c(y, v, x, j) : null;
        case so:
          return x.key === b ? u(y, v, x, j) : null;
        case Fn:
          return ((b = x._init), m(y, v, b(x._payload), j));
      }
      if (ws(x) || cs(x)) return b !== null ? null : d(y, v, x, j, null);
      Ai(y, x);
    }
    return null;
  }
  function g(y, v, x, j, b) {
    if ((typeof j == "string" && j !== "") || typeof j == "number")
      return ((y = y.get(x) || null), l(v, y, "" + j, b));
    if (typeof j == "object" && j !== null) {
      switch (j.$$typeof) {
        case wi:
          return (
            (y = y.get(j.key === null ? x : j.key) || null),
            c(v, y, j, b)
          );
        case so:
          return (
            (y = y.get(j.key === null ? x : j.key) || null),
            u(v, y, j, b)
          );
        case Fn:
          var N = j._init;
          return g(y, v, x, N(j._payload), b);
      }
      if (ws(j) || cs(j)) return ((y = y.get(x) || null), d(v, y, j, b, null));
      Ai(v, j);
    }
    return null;
  }
  function S(y, v, x, j) {
    for (
      var b = null, N = null, C = v, T = (v = 0), I = null;
      C !== null && T < x.length;
      T++
    ) {
      C.index > T ? ((I = C), (C = null)) : (I = C.sibling);
      var O = m(y, C, x[T], j);
      if (O === null) {
        C === null && (C = I);
        break;
      }
      (e && C && O.alternate === null && t(y, C),
        (v = s(O, v, T)),
        N === null ? (b = O) : (N.sibling = O),
        (N = O),
        (C = I));
    }
    if (T === x.length) return (n(y, C), Ee && br(y, T), b);
    if (C === null) {
      for (; T < x.length; T++)
        ((C = p(y, x[T], j)),
          C !== null &&
            ((v = s(C, v, T)),
            N === null ? (b = C) : (N.sibling = C),
            (N = C)));
      return (Ee && br(y, T), b);
    }
    for (C = r(y, C); T < x.length; T++)
      ((I = g(C, y, T, x[T], j)),
        I !== null &&
          (e && I.alternate !== null && C.delete(I.key === null ? T : I.key),
          (v = s(I, v, T)),
          N === null ? (b = I) : (N.sibling = I),
          (N = I)));
    return (
      e &&
        C.forEach(function ($) {
          return t(y, $);
        }),
      Ee && br(y, T),
      b
    );
  }
  function h(y, v, x, j) {
    var b = cs(x);
    if (typeof b != "function") throw Error(R(150));
    if (((x = b.call(x)), x == null)) throw Error(R(151));
    for (
      var N = (b = null), C = v, T = (v = 0), I = null, O = x.next();
      C !== null && !O.done;
      T++, O = x.next()
    ) {
      C.index > T ? ((I = C), (C = null)) : (I = C.sibling);
      var $ = m(y, C, O.value, j);
      if ($ === null) {
        C === null && (C = I);
        break;
      }
      (e && C && $.alternate === null && t(y, C),
        (v = s($, v, T)),
        N === null ? (b = $) : (N.sibling = $),
        (N = $),
        (C = I));
    }
    if (O.done) return (n(y, C), Ee && br(y, T), b);
    if (C === null) {
      for (; !O.done; T++, O = x.next())
        ((O = p(y, O.value, j)),
          O !== null &&
            ((v = s(O, v, T)),
            N === null ? (b = O) : (N.sibling = O),
            (N = O)));
      return (Ee && br(y, T), b);
    }
    for (C = r(y, C); !O.done; T++, O = x.next())
      ((O = g(C, y, T, O.value, j)),
        O !== null &&
          (e && O.alternate !== null && C.delete(O.key === null ? T : O.key),
          (v = s(O, v, T)),
          N === null ? (b = O) : (N.sibling = O),
          (N = O)));
    return (
      e &&
        C.forEach(function (_) {
          return t(y, _);
        }),
      Ee && br(y, T),
      b
    );
  }
  function w(y, v, x, j) {
    if (
      (typeof x == "object" &&
        x !== null &&
        x.type === io &&
        x.key === null &&
        (x = x.props.children),
      typeof x == "object" && x !== null)
    ) {
      switch (x.$$typeof) {
        case wi:
          e: {
            for (var b = x.key, N = v; N !== null;) {
              if (N.key === b) {
                if (((b = x.type), b === io)) {
                  if (N.tag === 7) {
                    (n(y, N.sibling),
                      (v = o(N, x.props.children)),
                      (v.return = y),
                      (y = v));
                    break e;
                  }
                } else if (
                  N.elementType === b ||
                  (typeof b == "object" &&
                    b !== null &&
                    b.$$typeof === Fn &&
                    ep(b) === N.type)
                ) {
                  (n(y, N.sibling),
                    (v = o(N, x.props)),
                    (v.ref = hs(y, N, x)),
                    (v.return = y),
                    (y = v));
                  break e;
                }
                n(y, N);
                break;
              } else t(y, N);
              N = N.sibling;
            }
            x.type === io
              ? ((v = Dr(x.props.children, y.mode, j, x.key)),
                (v.return = y),
                (y = v))
              : ((j = na(x.type, x.key, x.props, null, y.mode, j)),
                (j.ref = hs(y, v, x)),
                (j.return = y),
                (y = j));
          }
          return a(y);
        case so:
          e: {
            for (N = x.key; v !== null;) {
              if (v.key === N)
                if (
                  v.tag === 4 &&
                  v.stateNode.containerInfo === x.containerInfo &&
                  v.stateNode.implementation === x.implementation
                ) {
                  (n(y, v.sibling),
                    (v = o(v, x.children || [])),
                    (v.return = y),
                    (y = v));
                  break e;
                } else {
                  n(y, v);
                  break;
                }
              else t(y, v);
              v = v.sibling;
            }
            ((v = ec(x, y.mode, j)), (v.return = y), (y = v));
          }
          return a(y);
        case Fn:
          return ((N = x._init), w(y, v, N(x._payload), j));
      }
      if (ws(x)) return S(y, v, x, j);
      if (cs(x)) return h(y, v, x, j);
      Ai(y, x);
    }
    return (typeof x == "string" && x !== "") || typeof x == "number"
      ? ((x = "" + x),
        v !== null && v.tag === 6
          ? (n(y, v.sibling), (v = o(v, x)), (v.return = y), (y = v))
          : (n(y, v), (v = Zl(x, y.mode, j)), (v.return = y), (y = v)),
        a(y))
      : n(y, v);
  }
  return w;
}
var zo = Km(!0),
  Qm = Km(!1),
  Sa = fr(null),
  ja = null,
  mo = null,
  rd = null;
function od() {
  rd = mo = ja = null;
}
function sd(e) {
  var t = Sa.current;
  (je(Sa), (e._currentValue = t));
}
function Kc(e, t, n) {
  for (; e !== null;) {
    var r = e.alternate;
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break;
    e = e.return;
  }
}
function jo(e, t) {
  ((ja = e),
    (rd = mo = null),
    (e = e.dependencies),
    e !== null &&
      e.firstContext !== null &&
      (e.lanes & t && (dt = !0), (e.firstContext = null)));
}
function At(e) {
  var t = e._currentValue;
  if (rd !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), mo === null)) {
      if (ja === null) throw Error(R(308));
      ((mo = e), (ja.dependencies = { lanes: 0, firstContext: e }));
    } else mo = mo.next = e;
  return t;
}
var kr = null;
function id(e) {
  kr === null ? (kr = [e]) : kr.push(e);
}
function qm(e, t, n, r) {
  var o = t.interleaved;
  return (
    o === null ? ((n.next = n), id(t)) : ((n.next = o.next), (o.next = n)),
    (t.interleaved = n),
    bn(e, r)
  );
}
function bn(e, t) {
  e.lanes |= t;
  var n = e.alternate;
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null;)
    ((e.childLanes |= t),
      (n = e.alternate),
      n !== null && (n.childLanes |= t),
      (n = e),
      (e = e.return));
  return n.tag === 3 ? n.stateNode : null;
}
var zn = !1;
function ad(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  };
}
function Gm(e, t) {
  ((e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      }));
}
function xn(e, t) {
  return {
    eventTime: e,
    lane: t,
    tag: 0,
    payload: null,
    callback: null,
    next: null,
  };
}
function er(e, t, n) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (((r = r.shared), se & 2)) {
    var o = r.pending;
    return (
      o === null ? (t.next = t) : ((t.next = o.next), (o.next = t)),
      (r.pending = t),
      bn(e, n)
    );
  }
  return (
    (o = r.interleaved),
    o === null ? ((t.next = t), id(r)) : ((t.next = o.next), (o.next = t)),
    (r.interleaved = t),
    bn(e, n)
  );
}
function Yi(e, t, n) {
  if (
    ((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))
  ) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Ku(e, n));
  }
}
function tp(e, t) {
  var n = e.updateQueue,
    r = e.alternate;
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var o = null,
      s = null;
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var a = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        };
        (s === null ? (o = s = a) : (s = s.next = a), (n = n.next));
      } while (n !== null);
      s === null ? (o = s = t) : (s = s.next = t);
    } else o = s = t;
    ((n = {
      baseState: r.baseState,
      firstBaseUpdate: o,
      lastBaseUpdate: s,
      shared: r.shared,
      effects: r.effects,
    }),
      (e.updateQueue = n));
    return;
  }
  ((e = n.lastBaseUpdate),
    e === null ? (n.firstBaseUpdate = t) : (e.next = t),
    (n.lastBaseUpdate = t));
}
function ba(e, t, n, r) {
  var o = e.updateQueue;
  zn = !1;
  var s = o.firstBaseUpdate,
    a = o.lastBaseUpdate,
    l = o.shared.pending;
  if (l !== null) {
    o.shared.pending = null;
    var c = l,
      u = c.next;
    ((c.next = null), a === null ? (s = u) : (a.next = u), (a = c));
    var d = e.alternate;
    d !== null &&
      ((d = d.updateQueue),
      (l = d.lastBaseUpdate),
      l !== a &&
        (l === null ? (d.firstBaseUpdate = u) : (l.next = u),
        (d.lastBaseUpdate = c)));
  }
  if (s !== null) {
    var p = o.baseState;
    ((a = 0), (d = u = c = null), (l = s));
    do {
      var m = l.lane,
        g = l.eventTime;
      if ((r & m) === m) {
        d !== null &&
          (d = d.next =
            {
              eventTime: g,
              lane: 0,
              tag: l.tag,
              payload: l.payload,
              callback: l.callback,
              next: null,
            });
        e: {
          var S = e,
            h = l;
          switch (((m = t), (g = n), h.tag)) {
            case 1:
              if (((S = h.payload), typeof S == "function")) {
                p = S.call(g, p, m);
                break e;
              }
              p = S;
              break e;
            case 3:
              S.flags = (S.flags & -65537) | 128;
            case 0:
              if (
                ((S = h.payload),
                (m = typeof S == "function" ? S.call(g, p, m) : S),
                m == null)
              )
                break e;
              p = Te({}, p, m);
              break e;
            case 2:
              zn = !0;
          }
        }
        l.callback !== null &&
          l.lane !== 0 &&
          ((e.flags |= 64),
          (m = o.effects),
          m === null ? (o.effects = [l]) : m.push(l));
      } else
        ((g = {
          eventTime: g,
          lane: m,
          tag: l.tag,
          payload: l.payload,
          callback: l.callback,
          next: null,
        }),
          d === null ? ((u = d = g), (c = p)) : (d = d.next = g),
          (a |= m));
      if (((l = l.next), l === null)) {
        if (((l = o.shared.pending), l === null)) break;
        ((m = l),
          (l = m.next),
          (m.next = null),
          (o.lastBaseUpdate = m),
          (o.shared.pending = null));
      }
    } while (!0);
    if (
      (d === null && (c = p),
      (o.baseState = c),
      (o.firstBaseUpdate = u),
      (o.lastBaseUpdate = d),
      (t = o.shared.interleaved),
      t !== null)
    ) {
      o = t;
      do ((a |= o.lane), (o = o.next));
      while (o !== t);
    } else s === null && (o.shared.lanes = 0);
    (($r |= a), (e.lanes = a), (e.memoizedState = p));
  }
}
function np(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        o = r.callback;
      if (o !== null) {
        if (((r.callback = null), (r = n), typeof o != "function"))
          throw Error(R(191, o));
        o.call(r);
      }
    }
}
var pi = {},
  cn = fr(pi),
  Qs = fr(pi),
  qs = fr(pi);
function Pr(e) {
  if (e === pi) throw Error(R(174));
  return e;
}
function ld(e, t) {
  switch ((ve(qs, t), ve(Qs, e), ve(cn, pi), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Ec(null, "");
      break;
    default:
      ((e = e === 8 ? t.parentNode : t),
        (t = e.namespaceURI || null),
        (e = e.tagName),
        (t = Ec(t, e)));
  }
  (je(cn), ve(cn, t));
}
function $o() {
  (je(cn), je(Qs), je(qs));
}
function Ym(e) {
  Pr(qs.current);
  var t = Pr(cn.current),
    n = Ec(t, e.type);
  t !== n && (ve(Qs, e), ve(cn, n));
}
function cd(e) {
  Qs.current === e && (je(cn), je(Qs));
}
var ke = fr(0);
function Na(e) {
  for (var t = e; t !== null;) {
    if (t.tag === 13) {
      var n = t.memoizedState;
      if (
        n !== null &&
        ((n = n.dehydrated), n === null || n.data === "$?" || n.data === "$!")
      )
        return t;
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t;
    } else if (t.child !== null) {
      ((t.child.return = t), (t = t.child));
      continue;
    }
    if (t === e) break;
    for (; t.sibling === null;) {
      if (t.return === null || t.return === e) return null;
      t = t.return;
    }
    ((t.sibling.return = t.return), (t = t.sibling));
  }
  return null;
}
var Ql = [];
function ud() {
  for (var e = 0; e < Ql.length; e++)
    Ql[e]._workInProgressVersionPrimary = null;
  Ql.length = 0;
}
var Xi = kn.ReactCurrentDispatcher,
  ql = kn.ReactCurrentBatchConfig,
  zr = 0,
  Pe = null,
  Be = null,
  We = null,
  Ca = !1,
  As = !1,
  Gs = 0,
  h1 = 0;
function Xe() {
  throw Error(R(321));
}
function dd(e, t) {
  if (t === null) return !1;
  for (var n = 0; n < t.length && n < e.length; n++)
    if (!Gt(e[n], t[n])) return !1;
  return !0;
}
function fd(e, t, n, r, o, s) {
  if (
    ((zr = s),
    (Pe = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (Xi.current = e === null || e.memoizedState === null ? y1 : x1),
    (e = n(r, o)),
    As)
  ) {
    s = 0;
    do {
      if (((As = !1), (Gs = 0), 25 <= s)) throw Error(R(301));
      ((s += 1),
        (We = Be = null),
        (t.updateQueue = null),
        (Xi.current = w1),
        (e = n(r, o)));
    } while (As);
  }
  if (
    ((Xi.current = Ea),
    (t = Be !== null && Be.next !== null),
    (zr = 0),
    (We = Be = Pe = null),
    (Ca = !1),
    t)
  )
    throw Error(R(300));
  return e;
}
function pd() {
  var e = Gs !== 0;
  return ((Gs = 0), e);
}
function tn() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };
  return (We === null ? (Pe.memoizedState = We = e) : (We = We.next = e), We);
}
function It() {
  if (Be === null) {
    var e = Pe.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = Be.next;
  var t = We === null ? Pe.memoizedState : We.next;
  if (t !== null) ((We = t), (Be = e));
  else {
    if (e === null) throw Error(R(310));
    ((Be = e),
      (e = {
        memoizedState: Be.memoizedState,
        baseState: Be.baseState,
        baseQueue: Be.baseQueue,
        queue: Be.queue,
        next: null,
      }),
      We === null ? (Pe.memoizedState = We = e) : (We = We.next = e));
  }
  return We;
}
function Ys(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function Gl(e) {
  var t = It(),
    n = t.queue;
  if (n === null) throw Error(R(311));
  n.lastRenderedReducer = e;
  var r = Be,
    o = r.baseQueue,
    s = n.pending;
  if (s !== null) {
    if (o !== null) {
      var a = o.next;
      ((o.next = s.next), (s.next = a));
    }
    ((r.baseQueue = o = s), (n.pending = null));
  }
  if (o !== null) {
    ((s = o.next), (r = r.baseState));
    var l = (a = null),
      c = null,
      u = s;
    do {
      var d = u.lane;
      if ((zr & d) === d)
        (c !== null &&
          (c = c.next =
            {
              lane: 0,
              action: u.action,
              hasEagerState: u.hasEagerState,
              eagerState: u.eagerState,
              next: null,
            }),
          (r = u.hasEagerState ? u.eagerState : e(r, u.action)));
      else {
        var p = {
          lane: d,
          action: u.action,
          hasEagerState: u.hasEagerState,
          eagerState: u.eagerState,
          next: null,
        };
        (c === null ? ((l = c = p), (a = r)) : (c = c.next = p),
          (Pe.lanes |= d),
          ($r |= d));
      }
      u = u.next;
    } while (u !== null && u !== s);
    (c === null ? (a = r) : (c.next = l),
      Gt(r, t.memoizedState) || (dt = !0),
      (t.memoizedState = r),
      (t.baseState = a),
      (t.baseQueue = c),
      (n.lastRenderedState = r));
  }
  if (((e = n.interleaved), e !== null)) {
    o = e;
    do ((s = o.lane), (Pe.lanes |= s), ($r |= s), (o = o.next));
    while (o !== e);
  } else o === null && (n.lanes = 0);
  return [t.memoizedState, n.dispatch];
}
function Yl(e) {
  var t = It(),
    n = t.queue;
  if (n === null) throw Error(R(311));
  n.lastRenderedReducer = e;
  var r = n.dispatch,
    o = n.pending,
    s = t.memoizedState;
  if (o !== null) {
    n.pending = null;
    var a = (o = o.next);
    do ((s = e(s, a.action)), (a = a.next));
    while (a !== o);
    (Gt(s, t.memoizedState) || (dt = !0),
      (t.memoizedState = s),
      t.baseQueue === null && (t.baseState = s),
      (n.lastRenderedState = s));
  }
  return [s, r];
}
function Xm() {}
function Jm(e, t) {
  var n = Pe,
    r = It(),
    o = t(),
    s = !Gt(r.memoizedState, o);
  if (
    (s && ((r.memoizedState = o), (dt = !0)),
    (r = r.queue),
    hd(tg.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || s || (We !== null && We.memoizedState.tag & 1))
  ) {
    if (
      ((n.flags |= 2048),
      Xs(9, eg.bind(null, n, r, o, t), void 0, null),
      He === null)
    )
      throw Error(R(349));
    zr & 30 || Zm(n, t, o);
  }
  return o;
}
function Zm(e, t, n) {
  ((e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = Pe.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (Pe.updateQueue = t),
        (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
}
function eg(e, t, n, r) {
  ((t.value = n), (t.getSnapshot = r), ng(t) && rg(e));
}
function tg(e, t, n) {
  return n(function () {
    ng(t) && rg(e);
  });
}
function ng(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !Gt(e, n);
  } catch {
    return !0;
  }
}
function rg(e) {
  var t = bn(e, 1);
  t !== null && qt(t, e, 1, -1);
}
function rp(e) {
  var t = tn();
  return (
    typeof e == "function" && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = {
      pending: null,
      interleaved: null,
      lanes: 0,
      dispatch: null,
      lastRenderedReducer: Ys,
      lastRenderedState: e,
    }),
    (t.queue = e),
    (e = e.dispatch = v1.bind(null, Pe, e)),
    [t.memoizedState, e]
  );
}
function Xs(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = Pe.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }),
        (Pe.updateQueue = t),
        (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null
          ? (t.lastEffect = e.next = e)
          : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  );
}
function og() {
  return It().memoizedState;
}
function Ji(e, t, n, r) {
  var o = tn();
  ((Pe.flags |= e),
    (o.memoizedState = Xs(1 | t, n, void 0, r === void 0 ? null : r)));
}
function Xa(e, t, n, r) {
  var o = It();
  r = r === void 0 ? null : r;
  var s = void 0;
  if (Be !== null) {
    var a = Be.memoizedState;
    if (((s = a.destroy), r !== null && dd(r, a.deps))) {
      o.memoizedState = Xs(t, n, s, r);
      return;
    }
  }
  ((Pe.flags |= e), (o.memoizedState = Xs(1 | t, n, s, r)));
}
function op(e, t) {
  return Ji(8390656, 8, e, t);
}
function hd(e, t) {
  return Xa(2048, 8, e, t);
}
function sg(e, t) {
  return Xa(4, 2, e, t);
}
function ig(e, t) {
  return Xa(4, 4, e, t);
}
function ag(e, t) {
  if (typeof t == "function")
    return (
      (e = e()),
      t(e),
      function () {
        t(null);
      }
    );
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null;
      }
    );
}
function lg(e, t, n) {
  return (
    (n = n != null ? n.concat([e]) : null),
    Xa(4, 4, ag.bind(null, t, e), n)
  );
}
function md() {}
function cg(e, t) {
  var n = It();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && dd(t, r[1])
    ? r[0]
    : ((n.memoizedState = [e, t]), e);
}
function ug(e, t) {
  var n = It();
  t = t === void 0 ? null : t;
  var r = n.memoizedState;
  return r !== null && t !== null && dd(t, r[1])
    ? r[0]
    : ((e = e()), (n.memoizedState = [e, t]), e);
}
function dg(e, t, n) {
  return zr & 21
    ? (Gt(n, t) || ((n = gm()), (Pe.lanes |= n), ($r |= n), (e.baseState = !0)),
      t)
    : (e.baseState && ((e.baseState = !1), (dt = !0)), (e.memoizedState = n));
}
function m1(e, t) {
  var n = he;
  ((he = n !== 0 && 4 > n ? n : 4), e(!0));
  var r = ql.transition;
  ql.transition = {};
  try {
    (e(!1), t());
  } finally {
    ((he = n), (ql.transition = r));
  }
}
function fg() {
  return It().memoizedState;
}
function g1(e, t, n) {
  var r = nr(e);
  if (
    ((n = {
      lane: r,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
    pg(e))
  )
    hg(t, n);
  else if (((n = qm(e, t, n, r)), n !== null)) {
    var o = it();
    (qt(n, e, r, o), mg(n, t, r));
  }
}
function v1(e, t, n) {
  var r = nr(e),
    o = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null };
  if (pg(e)) hg(t, o);
  else {
    var s = e.alternate;
    if (
      e.lanes === 0 &&
      (s === null || s.lanes === 0) &&
      ((s = t.lastRenderedReducer), s !== null)
    )
      try {
        var a = t.lastRenderedState,
          l = s(a, n);
        if (((o.hasEagerState = !0), (o.eagerState = l), Gt(l, a))) {
          var c = t.interleaved;
          (c === null
            ? ((o.next = o), id(t))
            : ((o.next = c.next), (c.next = o)),
            (t.interleaved = o));
          return;
        }
      } catch {
      } finally {
      }
    ((n = qm(e, t, o, r)),
      n !== null && ((o = it()), qt(n, e, r, o), mg(n, t, r)));
  }
}
function pg(e) {
  var t = e.alternate;
  return e === Pe || (t !== null && t === Pe);
}
function hg(e, t) {
  As = Ca = !0;
  var n = e.pending;
  (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
    (e.pending = t));
}
function mg(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes;
    ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Ku(e, n));
  }
}
var Ea = {
    readContext: At,
    useCallback: Xe,
    useContext: Xe,
    useEffect: Xe,
    useImperativeHandle: Xe,
    useInsertionEffect: Xe,
    useLayoutEffect: Xe,
    useMemo: Xe,
    useReducer: Xe,
    useRef: Xe,
    useState: Xe,
    useDebugValue: Xe,
    useDeferredValue: Xe,
    useTransition: Xe,
    useMutableSource: Xe,
    useSyncExternalStore: Xe,
    useId: Xe,
    unstable_isNewReconciler: !1,
  },
  y1 = {
    readContext: At,
    useCallback: function (e, t) {
      return ((tn().memoizedState = [e, t === void 0 ? null : t]), e);
    },
    useContext: At,
    useEffect: op,
    useImperativeHandle: function (e, t, n) {
      return (
        (n = n != null ? n.concat([e]) : null),
        Ji(4194308, 4, ag.bind(null, t, e), n)
      );
    },
    useLayoutEffect: function (e, t) {
      return Ji(4194308, 4, e, t);
    },
    useInsertionEffect: function (e, t) {
      return Ji(4, 2, e, t);
    },
    useMemo: function (e, t) {
      var n = tn();
      return (
        (t = t === void 0 ? null : t),
        (e = e()),
        (n.memoizedState = [e, t]),
        e
      );
    },
    useReducer: function (e, t, n) {
      var r = tn();
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = g1.bind(null, Pe, e)),
        [r.memoizedState, e]
      );
    },
    useRef: function (e) {
      var t = tn();
      return ((e = { current: e }), (t.memoizedState = e));
    },
    useState: rp,
    useDebugValue: md,
    useDeferredValue: function (e) {
      return (tn().memoizedState = e);
    },
    useTransition: function () {
      var e = rp(!1),
        t = e[0];
      return ((e = m1.bind(null, e[1])), (tn().memoizedState = e), [t, e]);
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = Pe,
        o = tn();
      if (Ee) {
        if (n === void 0) throw Error(R(407));
        n = n();
      } else {
        if (((n = t()), He === null)) throw Error(R(349));
        zr & 30 || Zm(r, t, n);
      }
      o.memoizedState = n;
      var s = { value: n, getSnapshot: t };
      return (
        (o.queue = s),
        op(tg.bind(null, r, s, e), [e]),
        (r.flags |= 2048),
        Xs(9, eg.bind(null, r, s, n, t), void 0, null),
        n
      );
    },
    useId: function () {
      var e = tn(),
        t = He.identifierPrefix;
      if (Ee) {
        var n = yn,
          r = vn;
        ((n = (r & ~(1 << (32 - Qt(r) - 1))).toString(32) + n),
          (t = ":" + t + "R" + n),
          (n = Gs++),
          0 < n && (t += "H" + n.toString(32)),
          (t += ":"));
      } else ((n = h1++), (t = ":" + t + "r" + n.toString(32) + ":"));
      return (e.memoizedState = t);
    },
    unstable_isNewReconciler: !1,
  },
  x1 = {
    readContext: At,
    useCallback: cg,
    useContext: At,
    useEffect: hd,
    useImperativeHandle: lg,
    useInsertionEffect: sg,
    useLayoutEffect: ig,
    useMemo: ug,
    useReducer: Gl,
    useRef: og,
    useState: function () {
      return Gl(Ys);
    },
    useDebugValue: md,
    useDeferredValue: function (e) {
      var t = It();
      return dg(t, Be.memoizedState, e);
    },
    useTransition: function () {
      var e = Gl(Ys)[0],
        t = It().memoizedState;
      return [e, t];
    },
    useMutableSource: Xm,
    useSyncExternalStore: Jm,
    useId: fg,
    unstable_isNewReconciler: !1,
  },
  w1 = {
    readContext: At,
    useCallback: cg,
    useContext: At,
    useEffect: hd,
    useImperativeHandle: lg,
    useInsertionEffect: sg,
    useLayoutEffect: ig,
    useMemo: ug,
    useReducer: Yl,
    useRef: og,
    useState: function () {
      return Yl(Ys);
    },
    useDebugValue: md,
    useDeferredValue: function (e) {
      var t = It();
      return Be === null ? (t.memoizedState = e) : dg(t, Be.memoizedState, e);
    },
    useTransition: function () {
      var e = Yl(Ys)[0],
        t = It().memoizedState;
      return [e, t];
    },
    useMutableSource: Xm,
    useSyncExternalStore: Jm,
    useId: fg,
    unstable_isNewReconciler: !1,
  };
function $t(e, t) {
  if (e && e.defaultProps) {
    ((t = Te({}, t)), (e = e.defaultProps));
    for (var n in e) t[n] === void 0 && (t[n] = e[n]);
    return t;
  }
  return t;
}
function Qc(e, t, n, r) {
  ((t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : Te({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n));
}
var Ja = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? Qr(e) === e : !1;
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals;
    var r = it(),
      o = nr(e),
      s = xn(r, o);
    ((s.payload = t),
      n != null && (s.callback = n),
      (t = er(e, s, o)),
      t !== null && (qt(t, e, o, r), Yi(t, e, o)));
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals;
    var r = it(),
      o = nr(e),
      s = xn(r, o);
    ((s.tag = 1),
      (s.payload = t),
      n != null && (s.callback = n),
      (t = er(e, s, o)),
      t !== null && (qt(t, e, o, r), Yi(t, e, o)));
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals;
    var n = it(),
      r = nr(e),
      o = xn(n, r);
    ((o.tag = 2),
      t != null && (o.callback = t),
      (t = er(e, o, r)),
      t !== null && (qt(t, e, r, n), Yi(t, e, r)));
  },
};
function sp(e, t, n, r, o, s, a) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == "function"
      ? e.shouldComponentUpdate(r, s, a)
      : t.prototype && t.prototype.isPureReactComponent
        ? !Vs(n, r) || !Vs(o, s)
        : !0
  );
}
function gg(e, t, n) {
  var r = !1,
    o = ir,
    s = t.contextType;
  return (
    typeof s == "object" && s !== null
      ? (s = At(s))
      : ((o = pt(t) ? Lr : nt.current),
        (r = t.contextTypes),
        (s = (r = r != null) ? Lo(e, o) : ir)),
    (t = new t(n, s)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Ja),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = o),
      (e.__reactInternalMemoizedMaskedChildContext = s)),
    t
  );
}
function ip(e, t, n, r) {
  ((e = t.state),
    typeof t.componentWillReceiveProps == "function" &&
      t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == "function" &&
      t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Ja.enqueueReplaceState(t, t.state, null));
}
function qc(e, t, n, r) {
  var o = e.stateNode;
  ((o.props = n), (o.state = e.memoizedState), (o.refs = {}), ad(e));
  var s = t.contextType;
  (typeof s == "object" && s !== null
    ? (o.context = At(s))
    : ((s = pt(t) ? Lr : nt.current), (o.context = Lo(e, s))),
    (o.state = e.memoizedState),
    (s = t.getDerivedStateFromProps),
    typeof s == "function" && (Qc(e, t, s, n), (o.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == "function" ||
      typeof o.getSnapshotBeforeUpdate == "function" ||
      (typeof o.UNSAFE_componentWillMount != "function" &&
        typeof o.componentWillMount != "function") ||
      ((t = o.state),
      typeof o.componentWillMount == "function" && o.componentWillMount(),
      typeof o.UNSAFE_componentWillMount == "function" &&
        o.UNSAFE_componentWillMount(),
      t !== o.state && Ja.enqueueReplaceState(o, o.state, null),
      ba(e, n, o, r),
      (o.state = e.memoizedState)),
    typeof o.componentDidMount == "function" && (e.flags |= 4194308));
}
function Uo(e, t) {
  try {
    var n = "",
      r = t;
    do ((n += q0(r)), (r = r.return));
    while (r);
    var o = n;
  } catch (s) {
    o =
      `
Error generating stack: ` +
      s.message +
      `
` +
      s.stack;
  }
  return { value: e, source: t, stack: o, digest: null };
}
function Xl(e, t, n) {
  return { value: e, source: null, stack: n ?? null, digest: t ?? null };
}
function Gc(e, t) {
  try {
    console.error(t.value);
  } catch (n) {
    setTimeout(function () {
      throw n;
    });
  }
}
var S1 = typeof WeakMap == "function" ? WeakMap : Map;
function vg(e, t, n) {
  ((n = xn(-1, n)), (n.tag = 3), (n.payload = { element: null }));
  var r = t.value;
  return (
    (n.callback = function () {
      (Pa || ((Pa = !0), (su = r)), Gc(e, t));
    }),
    n
  );
}
function yg(e, t, n) {
  ((n = xn(-1, n)), (n.tag = 3));
  var r = e.type.getDerivedStateFromError;
  if (typeof r == "function") {
    var o = t.value;
    ((n.payload = function () {
      return r(o);
    }),
      (n.callback = function () {
        Gc(e, t);
      }));
  }
  var s = e.stateNode;
  return (
    s !== null &&
      typeof s.componentDidCatch == "function" &&
      (n.callback = function () {
        (Gc(e, t),
          typeof r != "function" &&
            (tr === null ? (tr = new Set([this])) : tr.add(this)));
        var a = t.stack;
        this.componentDidCatch(t.value, {
          componentStack: a !== null ? a : "",
        });
      }),
    n
  );
}
function ap(e, t, n) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new S1();
    var o = new Set();
    r.set(t, o);
  } else ((o = r.get(t)), o === void 0 && ((o = new Set()), r.set(t, o)));
  o.has(n) || (o.add(n), (e = _1.bind(null, e, t, n)), t.then(e, e));
}
function lp(e) {
  do {
    var t;
    if (
      ((t = e.tag === 13) &&
        ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)),
      t)
    )
      return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function cp(e, t, n, r, o) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = o), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 &&
            (n.alternate === null
              ? (n.tag = 17)
              : ((t = xn(-1, 1)), (t.tag = 2), er(n, t, 1))),
          (n.lanes |= 1)),
      e);
}
var j1 = kn.ReactCurrentOwner,
  dt = !1;
function ot(e, t, n, r) {
  t.child = e === null ? Qm(t, null, n, r) : zo(t, e.child, n, r);
}
function up(e, t, n, r, o) {
  n = n.render;
  var s = t.ref;
  return (
    jo(t, o),
    (r = fd(e, t, n, r, s, o)),
    (n = pd()),
    e !== null && !dt
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~o),
        Nn(e, t, o))
      : (Ee && n && ed(t), (t.flags |= 1), ot(e, t, r, o), t.child)
  );
}
function dp(e, t, n, r, o) {
  if (e === null) {
    var s = n.type;
    return typeof s == "function" &&
      !bd(s) &&
      s.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = s), xg(e, t, s, r, o))
      : ((e = na(n.type, null, r, t, t.mode, o)),
        (e.ref = t.ref),
        (e.return = t),
        (t.child = e));
  }
  if (((s = e.child), !(e.lanes & o))) {
    var a = s.memoizedProps;
    if (
      ((n = n.compare), (n = n !== null ? n : Vs), n(a, r) && e.ref === t.ref)
    )
      return Nn(e, t, o);
  }
  return (
    (t.flags |= 1),
    (e = rr(s, r)),
    (e.ref = t.ref),
    (e.return = t),
    (t.child = e)
  );
}
function xg(e, t, n, r, o) {
  if (e !== null) {
    var s = e.memoizedProps;
    if (Vs(s, r) && e.ref === t.ref)
      if (((dt = !1), (t.pendingProps = r = s), (e.lanes & o) !== 0))
        e.flags & 131072 && (dt = !0);
      else return ((t.lanes = e.lanes), Nn(e, t, o));
  }
  return Yc(e, t, n, r, o);
}
function wg(e, t, n) {
  var r = t.pendingProps,
    o = r.children,
    s = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden")
    if (!(t.mode & 1))
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        ve(vo, gt),
        (gt |= n));
    else {
      if (!(n & 1073741824))
        return (
          (e = s !== null ? s.baseLanes | n : n),
          (t.lanes = t.childLanes = 1073741824),
          (t.memoizedState = {
            baseLanes: e,
            cachePool: null,
            transitions: null,
          }),
          (t.updateQueue = null),
          ve(vo, gt),
          (gt |= e),
          null
        );
      ((t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = s !== null ? s.baseLanes : n),
        ve(vo, gt),
        (gt |= r));
    }
  else
    (s !== null ? ((r = s.baseLanes | n), (t.memoizedState = null)) : (r = n),
      ve(vo, gt),
      (gt |= r));
  return (ot(e, t, o, n), t.child);
}
function Sg(e, t) {
  var n = t.ref;
  ((e === null && n !== null) || (e !== null && e.ref !== n)) &&
    ((t.flags |= 512), (t.flags |= 2097152));
}
function Yc(e, t, n, r, o) {
  var s = pt(n) ? Lr : nt.current;
  return (
    (s = Lo(t, s)),
    jo(t, o),
    (n = fd(e, t, n, r, s, o)),
    (r = pd()),
    e !== null && !dt
      ? ((t.updateQueue = e.updateQueue),
        (t.flags &= -2053),
        (e.lanes &= ~o),
        Nn(e, t, o))
      : (Ee && r && ed(t), (t.flags |= 1), ot(e, t, n, o), t.child)
  );
}
function fp(e, t, n, r, o) {
  if (pt(n)) {
    var s = !0;
    ya(t);
  } else s = !1;
  if ((jo(t, o), t.stateNode === null))
    (Zi(e, t), gg(t, n, r), qc(t, n, r, o), (r = !0));
  else if (e === null) {
    var a = t.stateNode,
      l = t.memoizedProps;
    a.props = l;
    var c = a.context,
      u = n.contextType;
    typeof u == "object" && u !== null
      ? (u = At(u))
      : ((u = pt(n) ? Lr : nt.current), (u = Lo(t, u)));
    var d = n.getDerivedStateFromProps,
      p =
        typeof d == "function" ||
        typeof a.getSnapshotBeforeUpdate == "function";
    (p ||
      (typeof a.UNSAFE_componentWillReceiveProps != "function" &&
        typeof a.componentWillReceiveProps != "function") ||
      ((l !== r || c !== u) && ip(t, a, r, u)),
      (zn = !1));
    var m = t.memoizedState;
    ((a.state = m),
      ba(t, r, a, o),
      (c = t.memoizedState),
      l !== r || m !== c || ft.current || zn
        ? (typeof d == "function" && (Qc(t, n, d, r), (c = t.memoizedState)),
          (l = zn || sp(t, n, l, r, m, c, u))
            ? (p ||
                (typeof a.UNSAFE_componentWillMount != "function" &&
                  typeof a.componentWillMount != "function") ||
                (typeof a.componentWillMount == "function" &&
                  a.componentWillMount(),
                typeof a.UNSAFE_componentWillMount == "function" &&
                  a.UNSAFE_componentWillMount()),
              typeof a.componentDidMount == "function" && (t.flags |= 4194308))
            : (typeof a.componentDidMount == "function" && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = c)),
          (a.props = r),
          (a.state = c),
          (a.context = u),
          (r = l))
        : (typeof a.componentDidMount == "function" && (t.flags |= 4194308),
          (r = !1)));
  } else {
    ((a = t.stateNode),
      Gm(e, t),
      (l = t.memoizedProps),
      (u = t.type === t.elementType ? l : $t(t.type, l)),
      (a.props = u),
      (p = t.pendingProps),
      (m = a.context),
      (c = n.contextType),
      typeof c == "object" && c !== null
        ? (c = At(c))
        : ((c = pt(n) ? Lr : nt.current), (c = Lo(t, c))));
    var g = n.getDerivedStateFromProps;
    ((d =
      typeof g == "function" ||
      typeof a.getSnapshotBeforeUpdate == "function") ||
      (typeof a.UNSAFE_componentWillReceiveProps != "function" &&
        typeof a.componentWillReceiveProps != "function") ||
      ((l !== p || m !== c) && ip(t, a, r, c)),
      (zn = !1),
      (m = t.memoizedState),
      (a.state = m),
      ba(t, r, a, o));
    var S = t.memoizedState;
    l !== p || m !== S || ft.current || zn
      ? (typeof g == "function" && (Qc(t, n, g, r), (S = t.memoizedState)),
        (u = zn || sp(t, n, u, r, m, S, c) || !1)
          ? (d ||
              (typeof a.UNSAFE_componentWillUpdate != "function" &&
                typeof a.componentWillUpdate != "function") ||
              (typeof a.componentWillUpdate == "function" &&
                a.componentWillUpdate(r, S, c),
              typeof a.UNSAFE_componentWillUpdate == "function" &&
                a.UNSAFE_componentWillUpdate(r, S, c)),
            typeof a.componentDidUpdate == "function" && (t.flags |= 4),
            typeof a.getSnapshotBeforeUpdate == "function" && (t.flags |= 1024))
          : (typeof a.componentDidUpdate != "function" ||
              (l === e.memoizedProps && m === e.memoizedState) ||
              (t.flags |= 4),
            typeof a.getSnapshotBeforeUpdate != "function" ||
              (l === e.memoizedProps && m === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = S)),
        (a.props = r),
        (a.state = S),
        (a.context = c),
        (r = u))
      : (typeof a.componentDidUpdate != "function" ||
          (l === e.memoizedProps && m === e.memoizedState) ||
          (t.flags |= 4),
        typeof a.getSnapshotBeforeUpdate != "function" ||
          (l === e.memoizedProps && m === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1));
  }
  return Xc(e, t, n, r, s, o);
}
function Xc(e, t, n, r, o, s) {
  Sg(e, t);
  var a = (t.flags & 128) !== 0;
  if (!r && !a) return (o && Xf(t, n, !1), Nn(e, t, s));
  ((r = t.stateNode), (j1.current = t));
  var l =
    a && typeof n.getDerivedStateFromError != "function" ? null : r.render();
  return (
    (t.flags |= 1),
    e !== null && a
      ? ((t.child = zo(t, e.child, null, s)), (t.child = zo(t, null, l, s)))
      : ot(e, t, l, s),
    (t.memoizedState = r.state),
    o && Xf(t, n, !0),
    t.child
  );
}
function jg(e) {
  var t = e.stateNode;
  (t.pendingContext
    ? Yf(e, t.pendingContext, t.pendingContext !== t.context)
    : t.context && Yf(e, t.context, !1),
    ld(e, t.containerInfo));
}
function pp(e, t, n, r, o) {
  return (Fo(), nd(o), (t.flags |= 256), ot(e, t, n, r), t.child);
}
var Jc = { dehydrated: null, treeContext: null, retryLane: 0 };
function Zc(e) {
  return { baseLanes: e, cachePool: null, transitions: null };
}
function bg(e, t, n) {
  var r = t.pendingProps,
    o = ke.current,
    s = !1,
    a = (t.flags & 128) !== 0,
    l;
  if (
    ((l = a) ||
      (l = e !== null && e.memoizedState === null ? !1 : (o & 2) !== 0),
    l
      ? ((s = !0), (t.flags &= -129))
      : (e === null || e.memoizedState !== null) && (o |= 1),
    ve(ke, o & 1),
    e === null)
  )
    return (
      Hc(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1
            ? e.data === "$!"
              ? (t.lanes = 8)
              : (t.lanes = 1073741824)
            : (t.lanes = 1),
          null)
        : ((a = r.children),
          (e = r.fallback),
          s
            ? ((r = t.mode),
              (s = t.child),
              (a = { mode: "hidden", children: a }),
              !(r & 1) && s !== null
                ? ((s.childLanes = 0), (s.pendingProps = a))
                : (s = tl(a, r, 0, null)),
              (e = Dr(e, r, n, null)),
              (s.return = t),
              (e.return = t),
              (s.sibling = e),
              (t.child = s),
              (t.child.memoizedState = Zc(n)),
              (t.memoizedState = Jc),
              e)
            : gd(t, a))
    );
  if (((o = e.memoizedState), o !== null && ((l = o.dehydrated), l !== null)))
    return b1(e, t, a, r, l, o, n);
  if (s) {
    ((s = r.fallback), (a = t.mode), (o = e.child), (l = o.sibling));
    var c = { mode: "hidden", children: r.children };
    return (
      !(a & 1) && t.child !== o
        ? ((r = t.child),
          (r.childLanes = 0),
          (r.pendingProps = c),
          (t.deletions = null))
        : ((r = rr(o, c)), (r.subtreeFlags = o.subtreeFlags & 14680064)),
      l !== null ? (s = rr(l, s)) : ((s = Dr(s, a, n, null)), (s.flags |= 2)),
      (s.return = t),
      (r.return = t),
      (r.sibling = s),
      (t.child = r),
      (r = s),
      (s = t.child),
      (a = e.child.memoizedState),
      (a =
        a === null
          ? Zc(n)
          : {
              baseLanes: a.baseLanes | n,
              cachePool: null,
              transitions: a.transitions,
            }),
      (s.memoizedState = a),
      (s.childLanes = e.childLanes & ~n),
      (t.memoizedState = Jc),
      r
    );
  }
  return (
    (s = e.child),
    (e = s.sibling),
    (r = rr(s, { mode: "visible", children: r.children })),
    !(t.mode & 1) && (r.lanes = n),
    (r.return = t),
    (r.sibling = null),
    e !== null &&
      ((n = t.deletions),
      n === null ? ((t.deletions = [e]), (t.flags |= 16)) : n.push(e)),
    (t.child = r),
    (t.memoizedState = null),
    r
  );
}
function gd(e, t) {
  return (
    (t = tl({ mode: "visible", children: t }, e.mode, 0, null)),
    (t.return = e),
    (e.child = t)
  );
}
function Ii(e, t, n, r) {
  return (
    r !== null && nd(r),
    zo(t, e.child, null, n),
    (e = gd(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  );
}
function b1(e, t, n, r, o, s, a) {
  if (n)
    return t.flags & 256
      ? ((t.flags &= -257), (r = Xl(Error(R(422)))), Ii(e, t, a, r))
      : t.memoizedState !== null
        ? ((t.child = e.child), (t.flags |= 128), null)
        : ((s = r.fallback),
          (o = t.mode),
          (r = tl({ mode: "visible", children: r.children }, o, 0, null)),
          (s = Dr(s, o, a, null)),
          (s.flags |= 2),
          (r.return = t),
          (s.return = t),
          (r.sibling = s),
          (t.child = r),
          t.mode & 1 && zo(t, e.child, null, a),
          (t.child.memoizedState = Zc(a)),
          (t.memoizedState = Jc),
          s);
  if (!(t.mode & 1)) return Ii(e, t, a, null);
  if (o.data === "$!") {
    if (((r = o.nextSibling && o.nextSibling.dataset), r)) var l = r.dgst;
    return (
      (r = l),
      (s = Error(R(419))),
      (r = Xl(s, r, void 0)),
      Ii(e, t, a, r)
    );
  }
  if (((l = (a & e.childLanes) !== 0), dt || l)) {
    if (((r = He), r !== null)) {
      switch (a & -a) {
        case 4:
          o = 2;
          break;
        case 16:
          o = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          o = 32;
          break;
        case 536870912:
          o = 268435456;
          break;
        default:
          o = 0;
      }
      ((o = o & (r.suspendedLanes | a) ? 0 : o),
        o !== 0 &&
          o !== s.retryLane &&
          ((s.retryLane = o), bn(e, o), qt(r, e, o, -1)));
    }
    return (jd(), (r = Xl(Error(R(421)))), Ii(e, t, a, r));
  }
  return o.data === "$?"
    ? ((t.flags |= 128),
      (t.child = e.child),
      (t = D1.bind(null, e)),
      (o._reactRetry = t),
      null)
    : ((e = s.treeContext),
      (yt = Zn(o.nextSibling)),
      (xt = t),
      (Ee = !0),
      (Ht = null),
      e !== null &&
        ((kt[Pt++] = vn),
        (kt[Pt++] = yn),
        (kt[Pt++] = Fr),
        (vn = e.id),
        (yn = e.overflow),
        (Fr = t)),
      (t = gd(t, r.children)),
      (t.flags |= 4096),
      t);
}
function hp(e, t, n) {
  e.lanes |= t;
  var r = e.alternate;
  (r !== null && (r.lanes |= t), Kc(e.return, t, n));
}
function Jl(e, t, n, r, o) {
  var s = e.memoizedState;
  s === null
    ? (e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: r,
        tail: n,
        tailMode: o,
      })
    : ((s.isBackwards = t),
      (s.rendering = null),
      (s.renderingStartTime = 0),
      (s.last = r),
      (s.tail = n),
      (s.tailMode = o));
}
function Ng(e, t, n) {
  var r = t.pendingProps,
    o = r.revealOrder,
    s = r.tail;
  if ((ot(e, t, r.children, n), (r = ke.current), r & 2))
    ((r = (r & 1) | 2), (t.flags |= 128));
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null;) {
        if (e.tag === 13) e.memoizedState !== null && hp(e, n, t);
        else if (e.tag === 19) hp(e, n, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null;) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    r &= 1;
  }
  if ((ve(ke, r), !(t.mode & 1))) t.memoizedState = null;
  else
    switch (o) {
      case "forwards":
        for (n = t.child, o = null; n !== null;)
          ((e = n.alternate),
            e !== null && Na(e) === null && (o = n),
            (n = n.sibling));
        ((n = o),
          n === null
            ? ((o = t.child), (t.child = null))
            : ((o = n.sibling), (n.sibling = null)),
          Jl(t, !1, o, n, s));
        break;
      case "backwards":
        for (n = null, o = t.child, t.child = null; o !== null;) {
          if (((e = o.alternate), e !== null && Na(e) === null)) {
            t.child = o;
            break;
          }
          ((e = o.sibling), (o.sibling = n), (n = o), (o = e));
        }
        Jl(t, !0, n, null, s);
        break;
      case "together":
        Jl(t, !1, null, null, void 0);
        break;
      default:
        t.memoizedState = null;
    }
  return t.child;
}
function Zi(e, t) {
  !(t.mode & 1) &&
    e !== null &&
    ((e.alternate = null), (t.alternate = null), (t.flags |= 2));
}
function Nn(e, t, n) {
  if (
    (e !== null && (t.dependencies = e.dependencies),
    ($r |= t.lanes),
    !(n & t.childLanes))
  )
    return null;
  if (e !== null && t.child !== e.child) throw Error(R(153));
  if (t.child !== null) {
    for (
      e = t.child, n = rr(e, e.pendingProps), t.child = n, n.return = t;
      e.sibling !== null;
    )
      ((e = e.sibling),
        (n = n.sibling = rr(e, e.pendingProps)),
        (n.return = t));
    n.sibling = null;
  }
  return t.child;
}
function N1(e, t, n) {
  switch (t.tag) {
    case 3:
      (jg(t), Fo());
      break;
    case 5:
      Ym(t);
      break;
    case 1:
      pt(t.type) && ya(t);
      break;
    case 4:
      ld(t, t.stateNode.containerInfo);
      break;
    case 10:
      var r = t.type._context,
        o = t.memoizedProps.value;
      (ve(Sa, r._currentValue), (r._currentValue = o));
      break;
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (ve(ke, ke.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
            ? bg(e, t, n)
            : (ve(ke, ke.current & 1),
              (e = Nn(e, t, n)),
              e !== null ? e.sibling : null);
      ve(ke, ke.current & 1);
      break;
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return Ng(e, t, n);
        t.flags |= 128;
      }
      if (
        ((o = t.memoizedState),
        o !== null &&
          ((o.rendering = null), (o.tail = null), (o.lastEffect = null)),
        ve(ke, ke.current),
        r)
      )
        break;
      return null;
    case 22:
    case 23:
      return ((t.lanes = 0), wg(e, t, n));
  }
  return Nn(e, t, n);
}
var Cg, eu, Eg, kg;
Cg = function (e, t) {
  for (var n = t.child; n !== null;) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode);
    else if (n.tag !== 4 && n.child !== null) {
      ((n.child.return = n), (n = n.child));
      continue;
    }
    if (n === t) break;
    for (; n.sibling === null;) {
      if (n.return === null || n.return === t) return;
      n = n.return;
    }
    ((n.sibling.return = n.return), (n = n.sibling));
  }
};
eu = function () {};
Eg = function (e, t, n, r) {
  var o = e.memoizedProps;
  if (o !== r) {
    ((e = t.stateNode), Pr(cn.current));
    var s = null;
    switch (n) {
      case "input":
        ((o = jc(e, o)), (r = jc(e, r)), (s = []));
        break;
      case "select":
        ((o = Te({}, o, { value: void 0 })),
          (r = Te({}, r, { value: void 0 })),
          (s = []));
        break;
      case "textarea":
        ((o = Cc(e, o)), (r = Cc(e, r)), (s = []));
        break;
      default:
        typeof o.onClick != "function" &&
          typeof r.onClick == "function" &&
          (e.onclick = ga);
    }
    kc(n, r);
    var a;
    n = null;
    for (u in o)
      if (!r.hasOwnProperty(u) && o.hasOwnProperty(u) && o[u] != null)
        if (u === "style") {
          var l = o[u];
          for (a in l) l.hasOwnProperty(a) && (n || (n = {}), (n[a] = ""));
        } else
          u !== "dangerouslySetInnerHTML" &&
            u !== "children" &&
            u !== "suppressContentEditableWarning" &&
            u !== "suppressHydrationWarning" &&
            u !== "autoFocus" &&
            (Ds.hasOwnProperty(u)
              ? s || (s = [])
              : (s = s || []).push(u, null));
    for (u in r) {
      var c = r[u];
      if (
        ((l = o != null ? o[u] : void 0),
        r.hasOwnProperty(u) && c !== l && (c != null || l != null))
      )
        if (u === "style")
          if (l) {
            for (a in l)
              !l.hasOwnProperty(a) ||
                (c && c.hasOwnProperty(a)) ||
                (n || (n = {}), (n[a] = ""));
            for (a in c)
              c.hasOwnProperty(a) &&
                l[a] !== c[a] &&
                (n || (n = {}), (n[a] = c[a]));
          } else (n || (s || (s = []), s.push(u, n)), (n = c));
        else
          u === "dangerouslySetInnerHTML"
            ? ((c = c ? c.__html : void 0),
              (l = l ? l.__html : void 0),
              c != null && l !== c && (s = s || []).push(u, c))
            : u === "children"
              ? (typeof c != "string" && typeof c != "number") ||
                (s = s || []).push(u, "" + c)
              : u !== "suppressContentEditableWarning" &&
                u !== "suppressHydrationWarning" &&
                (Ds.hasOwnProperty(u)
                  ? (c != null && u === "onScroll" && Se("scroll", e),
                    s || l === c || (s = []))
                  : (s = s || []).push(u, c));
    }
    n && (s = s || []).push("style", n);
    var u = s;
    (t.updateQueue = u) && (t.flags |= 4);
  }
};
kg = function (e, t, n, r) {
  n !== r && (t.flags |= 4);
};
function ms(e, t) {
  if (!Ee)
    switch (e.tailMode) {
      case "hidden":
        t = e.tail;
        for (var n = null; t !== null;)
          (t.alternate !== null && (n = t), (t = t.sibling));
        n === null ? (e.tail = null) : (n.sibling = null);
        break;
      case "collapsed":
        n = e.tail;
        for (var r = null; n !== null;)
          (n.alternate !== null && (r = n), (n = n.sibling));
        r === null
          ? t || e.tail === null
            ? (e.tail = null)
            : (e.tail.sibling = null)
          : (r.sibling = null);
    }
}
function Je(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0;
  if (t)
    for (var o = e.child; o !== null;)
      ((n |= o.lanes | o.childLanes),
        (r |= o.subtreeFlags & 14680064),
        (r |= o.flags & 14680064),
        (o.return = e),
        (o = o.sibling));
  else
    for (o = e.child; o !== null;)
      ((n |= o.lanes | o.childLanes),
        (r |= o.subtreeFlags),
        (r |= o.flags),
        (o.return = e),
        (o = o.sibling));
  return ((e.subtreeFlags |= r), (e.childLanes = n), t);
}
function C1(e, t, n) {
  var r = t.pendingProps;
  switch ((td(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return (Je(t), null);
    case 1:
      return (pt(t.type) && va(), Je(t), null);
    case 3:
      return (
        (r = t.stateNode),
        $o(),
        je(ft),
        je(nt),
        ud(),
        r.pendingContext &&
          ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (Ri(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), Ht !== null && (lu(Ht), (Ht = null)))),
        eu(e, t),
        Je(t),
        null
      );
    case 5:
      cd(t);
      var o = Pr(qs.current);
      if (((n = t.type), e !== null && t.stateNode != null))
        (Eg(e, t, n, r, o),
          e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152)));
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(R(166));
          return (Je(t), null);
        }
        if (((e = Pr(cn.current)), Ri(t))) {
          ((r = t.stateNode), (n = t.type));
          var s = t.memoizedProps;
          switch (((r[sn] = t), (r[Ks] = s), (e = (t.mode & 1) !== 0), n)) {
            case "dialog":
              (Se("cancel", r), Se("close", r));
              break;
            case "iframe":
            case "object":
            case "embed":
              Se("load", r);
              break;
            case "video":
            case "audio":
              for (o = 0; o < js.length; o++) Se(js[o], r);
              break;
            case "source":
              Se("error", r);
              break;
            case "img":
            case "image":
            case "link":
              (Se("error", r), Se("load", r));
              break;
            case "details":
              Se("toggle", r);
              break;
            case "input":
              (bf(r, s), Se("invalid", r));
              break;
            case "select":
              ((r._wrapperState = { wasMultiple: !!s.multiple }),
                Se("invalid", r));
              break;
            case "textarea":
              (Cf(r, s), Se("invalid", r));
          }
          (kc(n, s), (o = null));
          for (var a in s)
            if (s.hasOwnProperty(a)) {
              var l = s[a];
              a === "children"
                ? typeof l == "string"
                  ? r.textContent !== l &&
                    (s.suppressHydrationWarning !== !0 &&
                      Ti(r.textContent, l, e),
                    (o = ["children", l]))
                  : typeof l == "number" &&
                    r.textContent !== "" + l &&
                    (s.suppressHydrationWarning !== !0 &&
                      Ti(r.textContent, l, e),
                    (o = ["children", "" + l]))
                : Ds.hasOwnProperty(a) &&
                  l != null &&
                  a === "onScroll" &&
                  Se("scroll", r);
            }
          switch (n) {
            case "input":
              (Si(r), Nf(r, s, !0));
              break;
            case "textarea":
              (Si(r), Ef(r));
              break;
            case "select":
            case "option":
              break;
            default:
              typeof s.onClick == "function" && (r.onclick = ga);
          }
          ((r = o), (t.updateQueue = r), r !== null && (t.flags |= 4));
        } else {
          ((a = o.nodeType === 9 ? o : o.ownerDocument),
            e === "http://www.w3.org/1999/xhtml" && (e = tm(n)),
            e === "http://www.w3.org/1999/xhtml"
              ? n === "script"
                ? ((e = a.createElement("div")),
                  (e.innerHTML = "<script><\/script>"),
                  (e = e.removeChild(e.firstChild)))
                : typeof r.is == "string"
                  ? (e = a.createElement(n, { is: r.is }))
                  : ((e = a.createElement(n)),
                    n === "select" &&
                      ((a = e),
                      r.multiple
                        ? (a.multiple = !0)
                        : r.size && (a.size = r.size)))
              : (e = a.createElementNS(e, n)),
            (e[sn] = t),
            (e[Ks] = r),
            Cg(e, t, !1, !1),
            (t.stateNode = e));
          e: {
            switch (((a = Pc(n, r)), n)) {
              case "dialog":
                (Se("cancel", e), Se("close", e), (o = r));
                break;
              case "iframe":
              case "object":
              case "embed":
                (Se("load", e), (o = r));
                break;
              case "video":
              case "audio":
                for (o = 0; o < js.length; o++) Se(js[o], e);
                o = r;
                break;
              case "source":
                (Se("error", e), (o = r));
                break;
              case "img":
              case "image":
              case "link":
                (Se("error", e), Se("load", e), (o = r));
                break;
              case "details":
                (Se("toggle", e), (o = r));
                break;
              case "input":
                (bf(e, r), (o = jc(e, r)), Se("invalid", e));
                break;
              case "option":
                o = r;
                break;
              case "select":
                ((e._wrapperState = { wasMultiple: !!r.multiple }),
                  (o = Te({}, r, { value: void 0 })),
                  Se("invalid", e));
                break;
              case "textarea":
                (Cf(e, r), (o = Cc(e, r)), Se("invalid", e));
                break;
              default:
                o = r;
            }
            (kc(n, o), (l = o));
            for (s in l)
              if (l.hasOwnProperty(s)) {
                var c = l[s];
                s === "style"
                  ? om(e, c)
                  : s === "dangerouslySetInnerHTML"
                    ? ((c = c ? c.__html : void 0), c != null && nm(e, c))
                    : s === "children"
                      ? typeof c == "string"
                        ? (n !== "textarea" || c !== "") && Ls(e, c)
                        : typeof c == "number" && Ls(e, "" + c)
                      : s !== "suppressContentEditableWarning" &&
                        s !== "suppressHydrationWarning" &&
                        s !== "autoFocus" &&
                        (Ds.hasOwnProperty(s)
                          ? c != null && s === "onScroll" && Se("scroll", e)
                          : c != null && $u(e, s, c, a));
              }
            switch (n) {
              case "input":
                (Si(e), Nf(e, r, !1));
                break;
              case "textarea":
                (Si(e), Ef(e));
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + sr(r.value));
                break;
              case "select":
                ((e.multiple = !!r.multiple),
                  (s = r.value),
                  s != null
                    ? yo(e, !!r.multiple, s, !1)
                    : r.defaultValue != null &&
                      yo(e, !!r.multiple, r.defaultValue, !0));
                break;
              default:
                typeof o.onClick == "function" && (e.onclick = ga);
            }
            switch (n) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (t.flags |= 4);
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152));
      }
      return (Je(t), null);
    case 6:
      if (e && t.stateNode != null) kg(e, t, e.memoizedProps, r);
      else {
        if (typeof r != "string" && t.stateNode === null) throw Error(R(166));
        if (((n = Pr(qs.current)), Pr(cn.current), Ri(t))) {
          if (
            ((r = t.stateNode),
            (n = t.memoizedProps),
            (r[sn] = t),
            (s = r.nodeValue !== n) && ((e = xt), e !== null))
          )
            switch (e.tag) {
              case 3:
                Ti(r.nodeValue, n, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 &&
                  Ti(r.nodeValue, n, (e.mode & 1) !== 0);
            }
          s && (t.flags |= 4);
        } else
          ((r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)),
            (r[sn] = t),
            (t.stateNode = r));
      }
      return (Je(t), null);
    case 13:
      if (
        (je(ke),
        (r = t.memoizedState),
        e === null ||
          (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
      ) {
        if (Ee && yt !== null && t.mode & 1 && !(t.flags & 128))
          (Hm(), Fo(), (t.flags |= 98560), (s = !1));
        else if (((s = Ri(t)), r !== null && r.dehydrated !== null)) {
          if (e === null) {
            if (!s) throw Error(R(318));
            if (
              ((s = t.memoizedState),
              (s = s !== null ? s.dehydrated : null),
              !s)
            )
              throw Error(R(317));
            s[sn] = t;
          } else
            (Fo(),
              !(t.flags & 128) && (t.memoizedState = null),
              (t.flags |= 4));
          (Je(t), (s = !1));
        } else (Ht !== null && (lu(Ht), (Ht = null)), (s = !0));
        if (!s) return t.flags & 65536 ? t : null;
      }
      return t.flags & 128
        ? ((t.lanes = n), t)
        : ((r = r !== null),
          r !== (e !== null && e.memoizedState !== null) &&
            r &&
            ((t.child.flags |= 8192),
            t.mode & 1 &&
              (e === null || ke.current & 1 ? Ve === 0 && (Ve = 3) : jd())),
          t.updateQueue !== null && (t.flags |= 4),
          Je(t),
          null);
    case 4:
      return (
        $o(),
        eu(e, t),
        e === null && Ws(t.stateNode.containerInfo),
        Je(t),
        null
      );
    case 10:
      return (sd(t.type._context), Je(t), null);
    case 17:
      return (pt(t.type) && va(), Je(t), null);
    case 19:
      if ((je(ke), (s = t.memoizedState), s === null)) return (Je(t), null);
      if (((r = (t.flags & 128) !== 0), (a = s.rendering), a === null))
        if (r) ms(s, !1);
        else {
          if (Ve !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null;) {
              if (((a = Na(e)), a !== null)) {
                for (
                  t.flags |= 128,
                    ms(s, !1),
                    r = a.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;
                )
                  ((s = n),
                    (e = r),
                    (s.flags &= 14680066),
                    (a = s.alternate),
                    a === null
                      ? ((s.childLanes = 0),
                        (s.lanes = e),
                        (s.child = null),
                        (s.subtreeFlags = 0),
                        (s.memoizedProps = null),
                        (s.memoizedState = null),
                        (s.updateQueue = null),
                        (s.dependencies = null),
                        (s.stateNode = null))
                      : ((s.childLanes = a.childLanes),
                        (s.lanes = a.lanes),
                        (s.child = a.child),
                        (s.subtreeFlags = 0),
                        (s.deletions = null),
                        (s.memoizedProps = a.memoizedProps),
                        (s.memoizedState = a.memoizedState),
                        (s.updateQueue = a.updateQueue),
                        (s.type = a.type),
                        (e = a.dependencies),
                        (s.dependencies =
                          e === null
                            ? null
                            : {
                                lanes: e.lanes,
                                firstContext: e.firstContext,
                              })),
                    (n = n.sibling));
                return (ve(ke, (ke.current & 1) | 2), t.child);
              }
              e = e.sibling;
            }
          s.tail !== null &&
            Le() > Bo &&
            ((t.flags |= 128), (r = !0), ms(s, !1), (t.lanes = 4194304));
        }
      else {
        if (!r)
          if (((e = Na(a)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              ms(s, !0),
              s.tail === null && s.tailMode === "hidden" && !a.alternate && !Ee)
            )
              return (Je(t), null);
          } else
            2 * Le() - s.renderingStartTime > Bo &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), ms(s, !1), (t.lanes = 4194304));
        s.isBackwards
          ? ((a.sibling = t.child), (t.child = a))
          : ((n = s.last),
            n !== null ? (n.sibling = a) : (t.child = a),
            (s.last = a));
      }
      return s.tail !== null
        ? ((t = s.tail),
          (s.rendering = t),
          (s.tail = t.sibling),
          (s.renderingStartTime = Le()),
          (t.sibling = null),
          (n = ke.current),
          ve(ke, r ? (n & 1) | 2 : n & 1),
          t)
        : (Je(t), null);
    case 22:
    case 23:
      return (
        Sd(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1
          ? gt & 1073741824 && (Je(t), t.subtreeFlags & 6 && (t.flags |= 8192))
          : Je(t),
        null
      );
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(R(156, t.tag));
}
function E1(e, t) {
  switch ((td(t), t.tag)) {
    case 1:
      return (
        pt(t.type) && va(),
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 3:
      return (
        $o(),
        je(ft),
        je(nt),
        ud(),
        (e = t.flags),
        e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 5:
      return (cd(t), null);
    case 13:
      if (
        (je(ke), (e = t.memoizedState), e !== null && e.dehydrated !== null)
      ) {
        if (t.alternate === null) throw Error(R(340));
        Fo();
      }
      return (
        (e = t.flags),
        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
      );
    case 19:
      return (je(ke), null);
    case 4:
      return ($o(), null);
    case 10:
      return (sd(t.type._context), null);
    case 22:
    case 23:
      return (Sd(), null);
    case 24:
      return null;
    default:
      return null;
  }
}
var Oi = !1,
  tt = !1,
  k1 = typeof WeakSet == "function" ? WeakSet : Set,
  F = null;
function go(e, t) {
  var n = e.ref;
  if (n !== null)
    if (typeof n == "function")
      try {
        n(null);
      } catch (r) {
        Me(e, t, r);
      }
    else n.current = null;
}
function tu(e, t, n) {
  try {
    n();
  } catch (r) {
    Me(e, t, r);
  }
}
var mp = !1;
function P1(e, t) {
  if (((Fc = pa), (e = Im()), Zu(e))) {
    if ("selectionStart" in e)
      var n = { start: e.selectionStart, end: e.selectionEnd };
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window;
        var r = n.getSelection && n.getSelection();
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode;
          var o = r.anchorOffset,
            s = r.focusNode;
          r = r.focusOffset;
          try {
            (n.nodeType, s.nodeType);
          } catch {
            n = null;
            break e;
          }
          var a = 0,
            l = -1,
            c = -1,
            u = 0,
            d = 0,
            p = e,
            m = null;
          t: for (;;) {
            for (
              var g;
              p !== n || (o !== 0 && p.nodeType !== 3) || (l = a + o),
                p !== s || (r !== 0 && p.nodeType !== 3) || (c = a + r),
                p.nodeType === 3 && (a += p.nodeValue.length),
                (g = p.firstChild) !== null;
            )
              ((m = p), (p = g));
            for (;;) {
              if (p === e) break t;
              if (
                (m === n && ++u === o && (l = a),
                m === s && ++d === r && (c = a),
                (g = p.nextSibling) !== null)
              )
                break;
              ((p = m), (m = p.parentNode));
            }
            p = g;
          }
          n = l === -1 || c === -1 ? null : { start: l, end: c };
        } else n = null;
      }
    n = n || { start: 0, end: 0 };
  } else n = null;
  for (zc = { focusedElem: e, selectionRange: n }, pa = !1, F = t; F !== null;)
    if (((t = F), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null))
      ((e.return = t), (F = e));
    else
      for (; F !== null;) {
        t = F;
        try {
          var S = t.alternate;
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break;
              case 1:
                if (S !== null) {
                  var h = S.memoizedProps,
                    w = S.memoizedState,
                    y = t.stateNode,
                    v = y.getSnapshotBeforeUpdate(
                      t.elementType === t.type ? h : $t(t.type, h),
                      w,
                    );
                  y.__reactInternalSnapshotBeforeUpdate = v;
                }
                break;
              case 3:
                var x = t.stateNode.containerInfo;
                x.nodeType === 1
                  ? (x.textContent = "")
                  : x.nodeType === 9 &&
                    x.documentElement &&
                    x.removeChild(x.documentElement);
                break;
              case 5:
              case 6:
              case 4:
              case 17:
                break;
              default:
                throw Error(R(163));
            }
        } catch (j) {
          Me(t, t.return, j);
        }
        if (((e = t.sibling), e !== null)) {
          ((e.return = t.return), (F = e));
          break;
        }
        F = t.return;
      }
  return ((S = mp), (mp = !1), S);
}
function Is(e, t, n) {
  var r = t.updateQueue;
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var o = (r = r.next);
    do {
      if ((o.tag & e) === e) {
        var s = o.destroy;
        ((o.destroy = void 0), s !== void 0 && tu(t, n, s));
      }
      o = o.next;
    } while (o !== r);
  }
}
function Za(e, t) {
  if (
    ((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)
  ) {
    var n = (t = t.next);
    do {
      if ((n.tag & e) === e) {
        var r = n.create;
        n.destroy = r();
      }
      n = n.next;
    } while (n !== t);
  }
}
function nu(e) {
  var t = e.ref;
  if (t !== null) {
    var n = e.stateNode;
    switch (e.tag) {
      case 5:
        e = n;
        break;
      default:
        e = n;
    }
    typeof t == "function" ? t(e) : (t.current = e);
  }
}
function Pg(e) {
  var t = e.alternate;
  (t !== null && ((e.alternate = null), Pg(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode),
      t !== null &&
        (delete t[sn], delete t[Ks], delete t[Bc], delete t[u1], delete t[d1])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null));
}
function Tg(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function gp(e) {
  e: for (;;) {
    for (; e.sibling === null;) {
      if (e.return === null || Tg(e.return)) return null;
      e = e.return;
    }
    for (
      e.sibling.return = e.return, e = e.sibling;
      e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
    ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e;
      ((e.child.return = e), (e = e.child));
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function ru(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8
            ? ((t = n.parentNode), t.insertBefore(e, n))
            : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = ga)));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (ru(e, t, n), e = e.sibling; e !== null;)
      (ru(e, t, n), (e = e.sibling));
}
function ou(e, t, n) {
  var r = e.tag;
  if (r === 5 || r === 6)
    ((e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e));
  else if (r !== 4 && ((e = e.child), e !== null))
    for (ou(e, t, n), e = e.sibling; e !== null;)
      (ou(e, t, n), (e = e.sibling));
}
var Ke = null,
  Wt = !1;
function On(e, t, n) {
  for (n = n.child; n !== null;) (Rg(e, t, n), (n = n.sibling));
}
function Rg(e, t, n) {
  if (ln && typeof ln.onCommitFiberUnmount == "function")
    try {
      ln.onCommitFiberUnmount(Ha, n);
    } catch {}
  switch (n.tag) {
    case 5:
      tt || go(n, t);
    case 6:
      var r = Ke,
        o = Wt;
      ((Ke = null),
        On(e, t, n),
        (Ke = r),
        (Wt = o),
        Ke !== null &&
          (Wt
            ? ((e = Ke),
              (n = n.stateNode),
              e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : Ke.removeChild(n.stateNode)));
      break;
    case 18:
      Ke !== null &&
        (Wt
          ? ((e = Ke),
            (n = n.stateNode),
            e.nodeType === 8
              ? Hl(e.parentNode, n)
              : e.nodeType === 1 && Hl(e, n),
            Us(e))
          : Hl(Ke, n.stateNode));
      break;
    case 4:
      ((r = Ke),
        (o = Wt),
        (Ke = n.stateNode.containerInfo),
        (Wt = !0),
        On(e, t, n),
        (Ke = r),
        (Wt = o));
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (
        !tt &&
        ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))
      ) {
        o = r = r.next;
        do {
          var s = o,
            a = s.destroy;
          ((s = s.tag),
            a !== void 0 && (s & 2 || s & 4) && tu(n, t, a),
            (o = o.next));
        } while (o !== r);
      }
      On(e, t, n);
      break;
    case 1:
      if (
        !tt &&
        (go(n, t),
        (r = n.stateNode),
        typeof r.componentWillUnmount == "function")
      )
        try {
          ((r.props = n.memoizedProps),
            (r.state = n.memoizedState),
            r.componentWillUnmount());
        } catch (l) {
          Me(n, t, l);
        }
      On(e, t, n);
      break;
    case 21:
      On(e, t, n);
      break;
    case 22:
      n.mode & 1
        ? ((tt = (r = tt) || n.memoizedState !== null), On(e, t, n), (tt = r))
        : On(e, t, n);
      break;
    default:
      On(e, t, n);
  }
}
function vp(e) {
  var t = e.updateQueue;
  if (t !== null) {
    e.updateQueue = null;
    var n = e.stateNode;
    (n === null && (n = e.stateNode = new k1()),
      t.forEach(function (r) {
        var o = L1.bind(null, e, r);
        n.has(r) || (n.add(r), r.then(o, o));
      }));
  }
}
function Lt(e, t) {
  var n = t.deletions;
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var o = n[r];
      try {
        var s = e,
          a = t,
          l = a;
        e: for (; l !== null;) {
          switch (l.tag) {
            case 5:
              ((Ke = l.stateNode), (Wt = !1));
              break e;
            case 3:
              ((Ke = l.stateNode.containerInfo), (Wt = !0));
              break e;
            case 4:
              ((Ke = l.stateNode.containerInfo), (Wt = !0));
              break e;
          }
          l = l.return;
        }
        if (Ke === null) throw Error(R(160));
        (Rg(s, a, o), (Ke = null), (Wt = !1));
        var c = o.alternate;
        (c !== null && (c.return = null), (o.return = null));
      } catch (u) {
        Me(o, t, u);
      }
    }
  if (t.subtreeFlags & 12854)
    for (t = t.child; t !== null;) (Ag(t, e), (t = t.sibling));
}
function Ag(e, t) {
  var n = e.alternate,
    r = e.flags;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((Lt(t, e), en(e), r & 4)) {
        try {
          (Is(3, e, e.return), Za(3, e));
        } catch (h) {
          Me(e, e.return, h);
        }
        try {
          Is(5, e, e.return);
        } catch (h) {
          Me(e, e.return, h);
        }
      }
      break;
    case 1:
      (Lt(t, e), en(e), r & 512 && n !== null && go(n, n.return));
      break;
    case 5:
      if (
        (Lt(t, e),
        en(e),
        r & 512 && n !== null && go(n, n.return),
        e.flags & 32)
      ) {
        var o = e.stateNode;
        try {
          Ls(o, "");
        } catch (h) {
          Me(e, e.return, h);
        }
      }
      if (r & 4 && ((o = e.stateNode), o != null)) {
        var s = e.memoizedProps,
          a = n !== null ? n.memoizedProps : s,
          l = e.type,
          c = e.updateQueue;
        if (((e.updateQueue = null), c !== null))
          try {
            (l === "input" && s.type === "radio" && s.name != null && Zh(o, s),
              Pc(l, a));
            var u = Pc(l, s);
            for (a = 0; a < c.length; a += 2) {
              var d = c[a],
                p = c[a + 1];
              d === "style"
                ? om(o, p)
                : d === "dangerouslySetInnerHTML"
                  ? nm(o, p)
                  : d === "children"
                    ? Ls(o, p)
                    : $u(o, d, p, u);
            }
            switch (l) {
              case "input":
                bc(o, s);
                break;
              case "textarea":
                em(o, s);
                break;
              case "select":
                var m = o._wrapperState.wasMultiple;
                o._wrapperState.wasMultiple = !!s.multiple;
                var g = s.value;
                g != null
                  ? yo(o, !!s.multiple, g, !1)
                  : m !== !!s.multiple &&
                    (s.defaultValue != null
                      ? yo(o, !!s.multiple, s.defaultValue, !0)
                      : yo(o, !!s.multiple, s.multiple ? [] : "", !1));
            }
            o[Ks] = s;
          } catch (h) {
            Me(e, e.return, h);
          }
      }
      break;
    case 6:
      if ((Lt(t, e), en(e), r & 4)) {
        if (e.stateNode === null) throw Error(R(162));
        ((o = e.stateNode), (s = e.memoizedProps));
        try {
          o.nodeValue = s;
        } catch (h) {
          Me(e, e.return, h);
        }
      }
      break;
    case 3:
      if (
        (Lt(t, e), en(e), r & 4 && n !== null && n.memoizedState.isDehydrated)
      )
        try {
          Us(t.containerInfo);
        } catch (h) {
          Me(e, e.return, h);
        }
      break;
    case 4:
      (Lt(t, e), en(e));
      break;
    case 13:
      (Lt(t, e),
        en(e),
        (o = e.child),
        o.flags & 8192 &&
          ((s = o.memoizedState !== null),
          (o.stateNode.isHidden = s),
          !s ||
            (o.alternate !== null && o.alternate.memoizedState !== null) ||
            (xd = Le())),
        r & 4 && vp(e));
      break;
    case 22:
      if (
        ((d = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((tt = (u = tt) || d), Lt(t, e), (tt = u)) : Lt(t, e),
        en(e),
        r & 8192)
      ) {
        if (
          ((u = e.memoizedState !== null),
          (e.stateNode.isHidden = u) && !d && e.mode & 1)
        )
          for (F = e, d = e.child; d !== null;) {
            for (p = F = d; F !== null;) {
              switch (((m = F), (g = m.child), m.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Is(4, m, m.return);
                  break;
                case 1:
                  go(m, m.return);
                  var S = m.stateNode;
                  if (typeof S.componentWillUnmount == "function") {
                    ((r = m), (n = m.return));
                    try {
                      ((t = r),
                        (S.props = t.memoizedProps),
                        (S.state = t.memoizedState),
                        S.componentWillUnmount());
                    } catch (h) {
                      Me(r, n, h);
                    }
                  }
                  break;
                case 5:
                  go(m, m.return);
                  break;
                case 22:
                  if (m.memoizedState !== null) {
                    xp(p);
                    continue;
                  }
              }
              g !== null ? ((g.return = m), (F = g)) : xp(p);
            }
            d = d.sibling;
          }
        e: for (d = null, p = e; ;) {
          if (p.tag === 5) {
            if (d === null) {
              d = p;
              try {
                ((o = p.stateNode),
                  u
                    ? ((s = o.style),
                      typeof s.setProperty == "function"
                        ? s.setProperty("display", "none", "important")
                        : (s.display = "none"))
                    : ((l = p.stateNode),
                      (c = p.memoizedProps.style),
                      (a =
                        c != null && c.hasOwnProperty("display")
                          ? c.display
                          : null),
                      (l.style.display = rm("display", a))));
              } catch (h) {
                Me(e, e.return, h);
              }
            }
          } else if (p.tag === 6) {
            if (d === null)
              try {
                p.stateNode.nodeValue = u ? "" : p.memoizedProps;
              } catch (h) {
                Me(e, e.return, h);
              }
          } else if (
            ((p.tag !== 22 && p.tag !== 23) ||
              p.memoizedState === null ||
              p === e) &&
            p.child !== null
          ) {
            ((p.child.return = p), (p = p.child));
            continue;
          }
          if (p === e) break e;
          for (; p.sibling === null;) {
            if (p.return === null || p.return === e) break e;
            (d === p && (d = null), (p = p.return));
          }
          (d === p && (d = null),
            (p.sibling.return = p.return),
            (p = p.sibling));
        }
      }
      break;
    case 19:
      (Lt(t, e), en(e), r & 4 && vp(e));
      break;
    case 21:
      break;
    default:
      (Lt(t, e), en(e));
  }
}
function en(e) {
  var t = e.flags;
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null;) {
          if (Tg(n)) {
            var r = n;
            break e;
          }
          n = n.return;
        }
        throw Error(R(160));
      }
      switch (r.tag) {
        case 5:
          var o = r.stateNode;
          r.flags & 32 && (Ls(o, ""), (r.flags &= -33));
          var s = gp(e);
          ou(e, s, o);
          break;
        case 3:
        case 4:
          var a = r.stateNode.containerInfo,
            l = gp(e);
          ru(e, l, a);
          break;
        default:
          throw Error(R(161));
      }
    } catch (c) {
      Me(e, e.return, c);
    }
    e.flags &= -3;
  }
  t & 4096 && (e.flags &= -4097);
}
function T1(e, t, n) {
  ((F = e), Ig(e));
}
function Ig(e, t, n) {
  for (var r = (e.mode & 1) !== 0; F !== null;) {
    var o = F,
      s = o.child;
    if (o.tag === 22 && r) {
      var a = o.memoizedState !== null || Oi;
      if (!a) {
        var l = o.alternate,
          c = (l !== null && l.memoizedState !== null) || tt;
        l = Oi;
        var u = tt;
        if (((Oi = a), (tt = c) && !u))
          for (F = o; F !== null;)
            ((a = F),
              (c = a.child),
              a.tag === 22 && a.memoizedState !== null
                ? wp(o)
                : c !== null
                  ? ((c.return = a), (F = c))
                  : wp(o));
        for (; s !== null;) ((F = s), Ig(s), (s = s.sibling));
        ((F = o), (Oi = l), (tt = u));
      }
      yp(e);
    } else
      o.subtreeFlags & 8772 && s !== null ? ((s.return = o), (F = s)) : yp(e);
  }
}
function yp(e) {
  for (; F !== null;) {
    var t = F;
    if (t.flags & 8772) {
      var n = t.alternate;
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              tt || Za(5, t);
              break;
            case 1:
              var r = t.stateNode;
              if (t.flags & 4 && !tt)
                if (n === null) r.componentDidMount();
                else {
                  var o =
                    t.elementType === t.type
                      ? n.memoizedProps
                      : $t(t.type, n.memoizedProps);
                  r.componentDidUpdate(
                    o,
                    n.memoizedState,
                    r.__reactInternalSnapshotBeforeUpdate,
                  );
                }
              var s = t.updateQueue;
              s !== null && np(t, s, r);
              break;
            case 3:
              var a = t.updateQueue;
              if (a !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode;
                      break;
                    case 1:
                      n = t.child.stateNode;
                  }
                np(t, a, n);
              }
              break;
            case 5:
              var l = t.stateNode;
              if (n === null && t.flags & 4) {
                n = l;
                var c = t.memoizedProps;
                switch (t.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    c.autoFocus && n.focus();
                    break;
                  case "img":
                    c.src && (n.src = c.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (t.memoizedState === null) {
                var u = t.alternate;
                if (u !== null) {
                  var d = u.memoizedState;
                  if (d !== null) {
                    var p = d.dehydrated;
                    p !== null && Us(p);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(R(163));
          }
        tt || (t.flags & 512 && nu(t));
      } catch (m) {
        Me(t, t.return, m);
      }
    }
    if (t === e) {
      F = null;
      break;
    }
    if (((n = t.sibling), n !== null)) {
      ((n.return = t.return), (F = n));
      break;
    }
    F = t.return;
  }
}
function xp(e) {
  for (; F !== null;) {
    var t = F;
    if (t === e) {
      F = null;
      break;
    }
    var n = t.sibling;
    if (n !== null) {
      ((n.return = t.return), (F = n));
      break;
    }
    F = t.return;
  }
}
function wp(e) {
  for (; F !== null;) {
    var t = F;
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return;
          try {
            Za(4, t);
          } catch (c) {
            Me(t, n, c);
          }
          break;
        case 1:
          var r = t.stateNode;
          if (typeof r.componentDidMount == "function") {
            var o = t.return;
            try {
              r.componentDidMount();
            } catch (c) {
              Me(t, o, c);
            }
          }
          var s = t.return;
          try {
            nu(t);
          } catch (c) {
            Me(t, s, c);
          }
          break;
        case 5:
          var a = t.return;
          try {
            nu(t);
          } catch (c) {
            Me(t, a, c);
          }
      }
    } catch (c) {
      Me(t, t.return, c);
    }
    if (t === e) {
      F = null;
      break;
    }
    var l = t.sibling;
    if (l !== null) {
      ((l.return = t.return), (F = l));
      break;
    }
    F = t.return;
  }
}
var R1 = Math.ceil,
  ka = kn.ReactCurrentDispatcher,
  vd = kn.ReactCurrentOwner,
  Rt = kn.ReactCurrentBatchConfig,
  se = 0,
  He = null,
  $e = null,
  Qe = 0,
  gt = 0,
  vo = fr(0),
  Ve = 0,
  Js = null,
  $r = 0,
  el = 0,
  yd = 0,
  Os = null,
  ut = null,
  xd = 0,
  Bo = 1 / 0,
  hn = null,
  Pa = !1,
  su = null,
  tr = null,
  Mi = !1,
  qn = null,
  Ta = 0,
  Ms = 0,
  iu = null,
  ea = -1,
  ta = 0;
function it() {
  return se & 6 ? Le() : ea !== -1 ? ea : (ea = Le());
}
function nr(e) {
  return e.mode & 1
    ? se & 2 && Qe !== 0
      ? Qe & -Qe
      : p1.transition !== null
        ? (ta === 0 && (ta = gm()), ta)
        : ((e = he),
          e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : bm(e.type))),
          e)
    : 1;
}
function qt(e, t, n, r) {
  if (50 < Ms) throw ((Ms = 0), (iu = null), Error(R(185)));
  (ui(e, n, r),
    (!(se & 2) || e !== He) &&
      (e === He && (!(se & 2) && (el |= n), Ve === 4 && Un(e, Qe)),
      ht(e, r),
      n === 1 && se === 0 && !(t.mode & 1) && ((Bo = Le() + 500), Ya && pr())));
}
function ht(e, t) {
  var n = e.callbackNode;
  pw(e, t);
  var r = fa(e, e === He ? Qe : 0);
  if (r === 0)
    (n !== null && Tf(n), (e.callbackNode = null), (e.callbackPriority = 0));
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && Tf(n), t === 1))
      (e.tag === 0 ? f1(Sp.bind(null, e)) : Bm(Sp.bind(null, e)),
        l1(function () {
          !(se & 6) && pr();
        }),
        (n = null));
    else {
      switch (vm(r)) {
        case 1:
          n = Hu;
          break;
        case 4:
          n = hm;
          break;
        case 16:
          n = da;
          break;
        case 536870912:
          n = mm;
          break;
        default:
          n = da;
      }
      n = $g(n, Og.bind(null, e));
    }
    ((e.callbackPriority = t), (e.callbackNode = n));
  }
}
function Og(e, t) {
  if (((ea = -1), (ta = 0), se & 6)) throw Error(R(327));
  var n = e.callbackNode;
  if (bo() && e.callbackNode !== n) return null;
  var r = fa(e, e === He ? Qe : 0);
  if (r === 0) return null;
  if (r & 30 || r & e.expiredLanes || t) t = Ra(e, r);
  else {
    t = r;
    var o = se;
    se |= 2;
    var s = _g();
    (He !== e || Qe !== t) && ((hn = null), (Bo = Le() + 500), _r(e, t));
    do
      try {
        O1();
        break;
      } catch (l) {
        Mg(e, l);
      }
    while (!0);
    (od(),
      (ka.current = s),
      (se = o),
      $e !== null ? (t = 0) : ((He = null), (Qe = 0), (t = Ve)));
  }
  if (t !== 0) {
    if (
      (t === 2 && ((o = Oc(e)), o !== 0 && ((r = o), (t = au(e, o)))), t === 1)
    )
      throw ((n = Js), _r(e, 0), Un(e, r), ht(e, Le()), n);
    if (t === 6) Un(e, r);
    else {
      if (
        ((o = e.current.alternate),
        !(r & 30) &&
          !A1(o) &&
          ((t = Ra(e, r)),
          t === 2 && ((s = Oc(e)), s !== 0 && ((r = s), (t = au(e, s)))),
          t === 1))
      )
        throw ((n = Js), _r(e, 0), Un(e, r), ht(e, Le()), n);
      switch (((e.finishedWork = o), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(R(345));
        case 2:
          Nr(e, ut, hn);
          break;
        case 3:
          if (
            (Un(e, r), (r & 130023424) === r && ((t = xd + 500 - Le()), 10 < t))
          ) {
            if (fa(e, 0) !== 0) break;
            if (((o = e.suspendedLanes), (o & r) !== r)) {
              (it(), (e.pingedLanes |= e.suspendedLanes & o));
              break;
            }
            e.timeoutHandle = Uc(Nr.bind(null, e, ut, hn), t);
            break;
          }
          Nr(e, ut, hn);
          break;
        case 4:
          if ((Un(e, r), (r & 4194240) === r)) break;
          for (t = e.eventTimes, o = -1; 0 < r;) {
            var a = 31 - Qt(r);
            ((s = 1 << a), (a = t[a]), a > o && (o = a), (r &= ~s));
          }
          if (
            ((r = o),
            (r = Le() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                  ? 480
                  : 1080 > r
                    ? 1080
                    : 1920 > r
                      ? 1920
                      : 3e3 > r
                        ? 3e3
                        : 4320 > r
                          ? 4320
                          : 1960 * R1(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = Uc(Nr.bind(null, e, ut, hn), r);
            break;
          }
          Nr(e, ut, hn);
          break;
        case 5:
          Nr(e, ut, hn);
          break;
        default:
          throw Error(R(329));
      }
    }
  }
  return (ht(e, Le()), e.callbackNode === n ? Og.bind(null, e) : null);
}
function au(e, t) {
  var n = Os;
  return (
    e.current.memoizedState.isDehydrated && (_r(e, t).flags |= 256),
    (e = Ra(e, t)),
    e !== 2 && ((t = ut), (ut = n), t !== null && lu(t)),
    e
  );
}
function lu(e) {
  ut === null ? (ut = e) : ut.push.apply(ut, e);
}
function A1(e) {
  for (var t = e; ;) {
    if (t.flags & 16384) {
      var n = t.updateQueue;
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var o = n[r],
            s = o.getSnapshot;
          o = o.value;
          try {
            if (!Gt(s(), o)) return !1;
          } catch {
            return !1;
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
      ((n.return = t), (t = n));
    else {
      if (t === e) break;
      for (; t.sibling === null;) {
        if (t.return === null || t.return === e) return !0;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
  }
  return !0;
}
function Un(e, t) {
  for (
    t &= ~yd,
      t &= ~el,
      e.suspendedLanes |= t,
      e.pingedLanes &= ~t,
      e = e.expirationTimes;
    0 < t;
  ) {
    var n = 31 - Qt(t),
      r = 1 << n;
    ((e[n] = -1), (t &= ~r));
  }
}
function Sp(e) {
  if (se & 6) throw Error(R(327));
  bo();
  var t = fa(e, 0);
  if (!(t & 1)) return (ht(e, Le()), null);
  var n = Ra(e, t);
  if (e.tag !== 0 && n === 2) {
    var r = Oc(e);
    r !== 0 && ((t = r), (n = au(e, r)));
  }
  if (n === 1) throw ((n = Js), _r(e, 0), Un(e, t), ht(e, Le()), n);
  if (n === 6) throw Error(R(345));
  return (
    (e.finishedWork = e.current.alternate),
    (e.finishedLanes = t),
    Nr(e, ut, hn),
    ht(e, Le()),
    null
  );
}
function wd(e, t) {
  var n = se;
  se |= 1;
  try {
    return e(t);
  } finally {
    ((se = n), se === 0 && ((Bo = Le() + 500), Ya && pr()));
  }
}
function Ur(e) {
  qn !== null && qn.tag === 0 && !(se & 6) && bo();
  var t = se;
  se |= 1;
  var n = Rt.transition,
    r = he;
  try {
    if (((Rt.transition = null), (he = 1), e)) return e();
  } finally {
    ((he = r), (Rt.transition = n), (se = t), !(se & 6) && pr());
  }
}
function Sd() {
  ((gt = vo.current), je(vo));
}
function _r(e, t) {
  ((e.finishedWork = null), (e.finishedLanes = 0));
  var n = e.timeoutHandle;
  if ((n !== -1 && ((e.timeoutHandle = -1), a1(n)), $e !== null))
    for (n = $e.return; n !== null;) {
      var r = n;
      switch ((td(r), r.tag)) {
        case 1:
          ((r = r.type.childContextTypes), r != null && va());
          break;
        case 3:
          ($o(), je(ft), je(nt), ud());
          break;
        case 5:
          cd(r);
          break;
        case 4:
          $o();
          break;
        case 13:
          je(ke);
          break;
        case 19:
          je(ke);
          break;
        case 10:
          sd(r.type._context);
          break;
        case 22:
        case 23:
          Sd();
      }
      n = n.return;
    }
  if (
    ((He = e),
    ($e = e = rr(e.current, null)),
    (Qe = gt = t),
    (Ve = 0),
    (Js = null),
    (yd = el = $r = 0),
    (ut = Os = null),
    kr !== null)
  ) {
    for (t = 0; t < kr.length; t++)
      if (((n = kr[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null;
        var o = r.next,
          s = n.pending;
        if (s !== null) {
          var a = s.next;
          ((s.next = o), (r.next = a));
        }
        n.pending = r;
      }
    kr = null;
  }
  return e;
}
function Mg(e, t) {
  do {
    var n = $e;
    try {
      if ((od(), (Xi.current = Ea), Ca)) {
        for (var r = Pe.memoizedState; r !== null;) {
          var o = r.queue;
          (o !== null && (o.pending = null), (r = r.next));
        }
        Ca = !1;
      }
      if (
        ((zr = 0),
        (We = Be = Pe = null),
        (As = !1),
        (Gs = 0),
        (vd.current = null),
        n === null || n.return === null)
      ) {
        ((Ve = 1), (Js = t), ($e = null));
        break;
      }
      e: {
        var s = e,
          a = n.return,
          l = n,
          c = t;
        if (
          ((t = Qe),
          (l.flags |= 32768),
          c !== null && typeof c == "object" && typeof c.then == "function")
        ) {
          var u = c,
            d = l,
            p = d.tag;
          if (!(d.mode & 1) && (p === 0 || p === 11 || p === 15)) {
            var m = d.alternate;
            m
              ? ((d.updateQueue = m.updateQueue),
                (d.memoizedState = m.memoizedState),
                (d.lanes = m.lanes))
              : ((d.updateQueue = null), (d.memoizedState = null));
          }
          var g = lp(a);
          if (g !== null) {
            ((g.flags &= -257),
              cp(g, a, l, s, t),
              g.mode & 1 && ap(s, u, t),
              (t = g),
              (c = u));
            var S = t.updateQueue;
            if (S === null) {
              var h = new Set();
              (h.add(c), (t.updateQueue = h));
            } else S.add(c);
            break e;
          } else {
            if (!(t & 1)) {
              (ap(s, u, t), jd());
              break e;
            }
            c = Error(R(426));
          }
        } else if (Ee && l.mode & 1) {
          var w = lp(a);
          if (w !== null) {
            (!(w.flags & 65536) && (w.flags |= 256),
              cp(w, a, l, s, t),
              nd(Uo(c, l)));
            break e;
          }
        }
        ((s = c = Uo(c, l)),
          Ve !== 4 && (Ve = 2),
          Os === null ? (Os = [s]) : Os.push(s),
          (s = a));
        do {
          switch (s.tag) {
            case 3:
              ((s.flags |= 65536), (t &= -t), (s.lanes |= t));
              var y = vg(s, c, t);
              tp(s, y);
              break e;
            case 1:
              l = c;
              var v = s.type,
                x = s.stateNode;
              if (
                !(s.flags & 128) &&
                (typeof v.getDerivedStateFromError == "function" ||
                  (x !== null &&
                    typeof x.componentDidCatch == "function" &&
                    (tr === null || !tr.has(x))))
              ) {
                ((s.flags |= 65536), (t &= -t), (s.lanes |= t));
                var j = yg(s, l, t);
                tp(s, j);
                break e;
              }
          }
          s = s.return;
        } while (s !== null);
      }
      Lg(n);
    } catch (b) {
      ((t = b), $e === n && n !== null && ($e = n = n.return));
      continue;
    }
    break;
  } while (!0);
}
function _g() {
  var e = ka.current;
  return ((ka.current = Ea), e === null ? Ea : e);
}
function jd() {
  ((Ve === 0 || Ve === 3 || Ve === 2) && (Ve = 4),
    He === null || (!($r & 268435455) && !(el & 268435455)) || Un(He, Qe));
}
function Ra(e, t) {
  var n = se;
  se |= 2;
  var r = _g();
  (He !== e || Qe !== t) && ((hn = null), _r(e, t));
  do
    try {
      I1();
      break;
    } catch (o) {
      Mg(e, o);
    }
  while (!0);
  if ((od(), (se = n), (ka.current = r), $e !== null)) throw Error(R(261));
  return ((He = null), (Qe = 0), Ve);
}
function I1() {
  for (; $e !== null;) Dg($e);
}
function O1() {
  for (; $e !== null && !ow();) Dg($e);
}
function Dg(e) {
  var t = zg(e.alternate, e, gt);
  ((e.memoizedProps = e.pendingProps),
    t === null ? Lg(e) : ($e = t),
    (vd.current = null));
}
function Lg(e) {
  var t = e;
  do {
    var n = t.alternate;
    if (((e = t.return), t.flags & 32768)) {
      if (((n = E1(n, t)), n !== null)) {
        ((n.flags &= 32767), ($e = n));
        return;
      }
      if (e !== null)
        ((e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null));
      else {
        ((Ve = 6), ($e = null));
        return;
      }
    } else if (((n = C1(n, t, gt)), n !== null)) {
      $e = n;
      return;
    }
    if (((t = t.sibling), t !== null)) {
      $e = t;
      return;
    }
    $e = t = e;
  } while (t !== null);
  Ve === 0 && (Ve = 5);
}
function Nr(e, t, n) {
  var r = he,
    o = Rt.transition;
  try {
    ((Rt.transition = null), (he = 1), M1(e, t, n, r));
  } finally {
    ((Rt.transition = o), (he = r));
  }
  return null;
}
function M1(e, t, n, r) {
  do bo();
  while (qn !== null);
  if (se & 6) throw Error(R(327));
  n = e.finishedWork;
  var o = e.finishedLanes;
  if (n === null) return null;
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current))
    throw Error(R(177));
  ((e.callbackNode = null), (e.callbackPriority = 0));
  var s = n.lanes | n.childLanes;
  if (
    (hw(e, s),
    e === He && (($e = He = null), (Qe = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      Mi ||
      ((Mi = !0),
      $g(da, function () {
        return (bo(), null);
      })),
    (s = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || s)
  ) {
    ((s = Rt.transition), (Rt.transition = null));
    var a = he;
    he = 1;
    var l = se;
    ((se |= 4),
      (vd.current = null),
      P1(e, n),
      Ag(n, e),
      e1(zc),
      (pa = !!Fc),
      (zc = Fc = null),
      (e.current = n),
      T1(n),
      sw(),
      (se = l),
      (he = a),
      (Rt.transition = s));
  } else e.current = n;
  if (
    (Mi && ((Mi = !1), (qn = e), (Ta = o)),
    (s = e.pendingLanes),
    s === 0 && (tr = null),
    lw(n.stateNode),
    ht(e, Le()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++)
      ((o = t[n]), r(o.value, { componentStack: o.stack, digest: o.digest }));
  if (Pa) throw ((Pa = !1), (e = su), (su = null), e);
  return (
    Ta & 1 && e.tag !== 0 && bo(),
    (s = e.pendingLanes),
    s & 1 ? (e === iu ? Ms++ : ((Ms = 0), (iu = e))) : (Ms = 0),
    pr(),
    null
  );
}
function bo() {
  if (qn !== null) {
    var e = vm(Ta),
      t = Rt.transition,
      n = he;
    try {
      if (((Rt.transition = null), (he = 16 > e ? 16 : e), qn === null))
        var r = !1;
      else {
        if (((e = qn), (qn = null), (Ta = 0), se & 6)) throw Error(R(331));
        var o = se;
        for (se |= 4, F = e.current; F !== null;) {
          var s = F,
            a = s.child;
          if (F.flags & 16) {
            var l = s.deletions;
            if (l !== null) {
              for (var c = 0; c < l.length; c++) {
                var u = l[c];
                for (F = u; F !== null;) {
                  var d = F;
                  switch (d.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Is(8, d, s);
                  }
                  var p = d.child;
                  if (p !== null) ((p.return = d), (F = p));
                  else
                    for (; F !== null;) {
                      d = F;
                      var m = d.sibling,
                        g = d.return;
                      if ((Pg(d), d === u)) {
                        F = null;
                        break;
                      }
                      if (m !== null) {
                        ((m.return = g), (F = m));
                        break;
                      }
                      F = g;
                    }
                }
              }
              var S = s.alternate;
              if (S !== null) {
                var h = S.child;
                if (h !== null) {
                  S.child = null;
                  do {
                    var w = h.sibling;
                    ((h.sibling = null), (h = w));
                  } while (h !== null);
                }
              }
              F = s;
            }
          }
          if (s.subtreeFlags & 2064 && a !== null) ((a.return = s), (F = a));
          else
            e: for (; F !== null;) {
              if (((s = F), s.flags & 2048))
                switch (s.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Is(9, s, s.return);
                }
              var y = s.sibling;
              if (y !== null) {
                ((y.return = s.return), (F = y));
                break e;
              }
              F = s.return;
            }
        }
        var v = e.current;
        for (F = v; F !== null;) {
          a = F;
          var x = a.child;
          if (a.subtreeFlags & 2064 && x !== null) ((x.return = a), (F = x));
          else
            e: for (a = v; F !== null;) {
              if (((l = F), l.flags & 2048))
                try {
                  switch (l.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Za(9, l);
                  }
                } catch (b) {
                  Me(l, l.return, b);
                }
              if (l === a) {
                F = null;
                break e;
              }
              var j = l.sibling;
              if (j !== null) {
                ((j.return = l.return), (F = j));
                break e;
              }
              F = l.return;
            }
        }
        if (
          ((se = o), pr(), ln && typeof ln.onPostCommitFiberRoot == "function")
        )
          try {
            ln.onPostCommitFiberRoot(Ha, e);
          } catch {}
        r = !0;
      }
      return r;
    } finally {
      ((he = n), (Rt.transition = t));
    }
  }
  return !1;
}
function jp(e, t, n) {
  ((t = Uo(n, t)),
    (t = vg(e, t, 1)),
    (e = er(e, t, 1)),
    (t = it()),
    e !== null && (ui(e, 1, t), ht(e, t)));
}
function Me(e, t, n) {
  if (e.tag === 3) jp(e, e, n);
  else
    for (; t !== null;) {
      if (t.tag === 3) {
        jp(t, e, n);
        break;
      } else if (t.tag === 1) {
        var r = t.stateNode;
        if (
          typeof t.type.getDerivedStateFromError == "function" ||
          (typeof r.componentDidCatch == "function" &&
            (tr === null || !tr.has(r)))
        ) {
          ((e = Uo(n, e)),
            (e = yg(t, e, 1)),
            (t = er(t, e, 1)),
            (e = it()),
            t !== null && (ui(t, 1, e), ht(t, e)));
          break;
        }
      }
      t = t.return;
    }
}
function _1(e, t, n) {
  var r = e.pingCache;
  (r !== null && r.delete(t),
    (t = it()),
    (e.pingedLanes |= e.suspendedLanes & n),
    He === e &&
      (Qe & n) === n &&
      (Ve === 4 || (Ve === 3 && (Qe & 130023424) === Qe && 500 > Le() - xd)
        ? _r(e, 0)
        : (yd |= n)),
    ht(e, t));
}
function Fg(e, t) {
  t === 0 &&
    (e.mode & 1
      ? ((t = Ni), (Ni <<= 1), !(Ni & 130023424) && (Ni = 4194304))
      : (t = 1));
  var n = it();
  ((e = bn(e, t)), e !== null && (ui(e, t, n), ht(e, n)));
}
function D1(e) {
  var t = e.memoizedState,
    n = 0;
  (t !== null && (n = t.retryLane), Fg(e, n));
}
function L1(e, t) {
  var n = 0;
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        o = e.memoizedState;
      o !== null && (n = o.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(R(314));
  }
  (r !== null && r.delete(t), Fg(e, n));
}
var zg;
zg = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || ft.current) dt = !0;
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return ((dt = !1), N1(e, t, n));
      dt = !!(e.flags & 131072);
    }
  else ((dt = !1), Ee && t.flags & 1048576 && Vm(t, wa, t.index));
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type;
      (Zi(e, t), (e = t.pendingProps));
      var o = Lo(t, nt.current);
      (jo(t, n), (o = fd(null, t, r, e, o, n)));
      var s = pd();
      return (
        (t.flags |= 1),
        typeof o == "object" &&
        o !== null &&
        typeof o.render == "function" &&
        o.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            pt(r) ? ((s = !0), ya(t)) : (s = !1),
            (t.memoizedState =
              o.state !== null && o.state !== void 0 ? o.state : null),
            ad(t),
            (o.updater = Ja),
            (t.stateNode = o),
            (o._reactInternals = t),
            qc(t, r, e, n),
            (t = Xc(null, t, r, !0, s, n)))
          : ((t.tag = 0), Ee && s && ed(t), ot(null, t, o, n), (t = t.child)),
        t
      );
    case 16:
      r = t.elementType;
      e: {
        switch (
          (Zi(e, t),
          (e = t.pendingProps),
          (o = r._init),
          (r = o(r._payload)),
          (t.type = r),
          (o = t.tag = z1(r)),
          (e = $t(r, e)),
          o)
        ) {
          case 0:
            t = Yc(null, t, r, e, n);
            break e;
          case 1:
            t = fp(null, t, r, e, n);
            break e;
          case 11:
            t = up(null, t, r, e, n);
            break e;
          case 14:
            t = dp(null, t, r, $t(r.type, e), n);
            break e;
        }
        throw Error(R(306, r, ""));
      }
      return t;
    case 0:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : $t(r, o)),
        Yc(e, t, r, o, n)
      );
    case 1:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : $t(r, o)),
        fp(e, t, r, o, n)
      );
    case 3:
      e: {
        if ((jg(t), e === null)) throw Error(R(387));
        ((r = t.pendingProps),
          (s = t.memoizedState),
          (o = s.element),
          Gm(e, t),
          ba(t, r, null, n));
        var a = t.memoizedState;
        if (((r = a.element), s.isDehydrated))
          if (
            ((s = {
              element: r,
              isDehydrated: !1,
              cache: a.cache,
              pendingSuspenseBoundaries: a.pendingSuspenseBoundaries,
              transitions: a.transitions,
            }),
            (t.updateQueue.baseState = s),
            (t.memoizedState = s),
            t.flags & 256)
          ) {
            ((o = Uo(Error(R(423)), t)), (t = pp(e, t, r, n, o)));
            break e;
          } else if (r !== o) {
            ((o = Uo(Error(R(424)), t)), (t = pp(e, t, r, n, o)));
            break e;
          } else
            for (
              yt = Zn(t.stateNode.containerInfo.firstChild),
                xt = t,
                Ee = !0,
                Ht = null,
                n = Qm(t, null, r, n),
                t.child = n;
              n;
            )
              ((n.flags = (n.flags & -3) | 4096), (n = n.sibling));
        else {
          if ((Fo(), r === o)) {
            t = Nn(e, t, n);
            break e;
          }
          ot(e, t, r, n);
        }
        t = t.child;
      }
      return t;
    case 5:
      return (
        Ym(t),
        e === null && Hc(t),
        (r = t.type),
        (o = t.pendingProps),
        (s = e !== null ? e.memoizedProps : null),
        (a = o.children),
        $c(r, o) ? (a = null) : s !== null && $c(r, s) && (t.flags |= 32),
        Sg(e, t),
        ot(e, t, a, n),
        t.child
      );
    case 6:
      return (e === null && Hc(t), null);
    case 13:
      return bg(e, t, n);
    case 4:
      return (
        ld(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = zo(t, null, r, n)) : ot(e, t, r, n),
        t.child
      );
    case 11:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : $t(r, o)),
        up(e, t, r, o, n)
      );
    case 7:
      return (ot(e, t, t.pendingProps, n), t.child);
    case 8:
      return (ot(e, t, t.pendingProps.children, n), t.child);
    case 12:
      return (ot(e, t, t.pendingProps.children, n), t.child);
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (o = t.pendingProps),
          (s = t.memoizedProps),
          (a = o.value),
          ve(Sa, r._currentValue),
          (r._currentValue = a),
          s !== null)
        )
          if (Gt(s.value, a)) {
            if (s.children === o.children && !ft.current) {
              t = Nn(e, t, n);
              break e;
            }
          } else
            for (s = t.child, s !== null && (s.return = t); s !== null;) {
              var l = s.dependencies;
              if (l !== null) {
                a = s.child;
                for (var c = l.firstContext; c !== null;) {
                  if (c.context === r) {
                    if (s.tag === 1) {
                      ((c = xn(-1, n & -n)), (c.tag = 2));
                      var u = s.updateQueue;
                      if (u !== null) {
                        u = u.shared;
                        var d = u.pending;
                        (d === null
                          ? (c.next = c)
                          : ((c.next = d.next), (d.next = c)),
                          (u.pending = c));
                      }
                    }
                    ((s.lanes |= n),
                      (c = s.alternate),
                      c !== null && (c.lanes |= n),
                      Kc(s.return, n, t),
                      (l.lanes |= n));
                    break;
                  }
                  c = c.next;
                }
              } else if (s.tag === 10) a = s.type === t.type ? null : s.child;
              else if (s.tag === 18) {
                if (((a = s.return), a === null)) throw Error(R(341));
                ((a.lanes |= n),
                  (l = a.alternate),
                  l !== null && (l.lanes |= n),
                  Kc(a, n, t),
                  (a = s.sibling));
              } else a = s.child;
              if (a !== null) a.return = s;
              else
                for (a = s; a !== null;) {
                  if (a === t) {
                    a = null;
                    break;
                  }
                  if (((s = a.sibling), s !== null)) {
                    ((s.return = a.return), (a = s));
                    break;
                  }
                  a = a.return;
                }
              s = a;
            }
        (ot(e, t, o.children, n), (t = t.child));
      }
      return t;
    case 9:
      return (
        (o = t.type),
        (r = t.pendingProps.children),
        jo(t, n),
        (o = At(o)),
        (r = r(o)),
        (t.flags |= 1),
        ot(e, t, r, n),
        t.child
      );
    case 14:
      return (
        (r = t.type),
        (o = $t(r, t.pendingProps)),
        (o = $t(r.type, o)),
        dp(e, t, r, o, n)
      );
    case 15:
      return xg(e, t, t.type, t.pendingProps, n);
    case 17:
      return (
        (r = t.type),
        (o = t.pendingProps),
        (o = t.elementType === r ? o : $t(r, o)),
        Zi(e, t),
        (t.tag = 1),
        pt(r) ? ((e = !0), ya(t)) : (e = !1),
        jo(t, n),
        gg(t, r, o),
        qc(t, r, o, n),
        Xc(null, t, r, !0, e, n)
      );
    case 19:
      return Ng(e, t, n);
    case 22:
      return wg(e, t, n);
  }
  throw Error(R(156, t.tag));
};
function $g(e, t) {
  return pm(e, t);
}
function F1(e, t, n, r) {
  ((this.tag = e),
    (this.key = n),
    (this.sibling =
      this.child =
      this.return =
      this.stateNode =
      this.type =
      this.elementType =
        null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies =
      this.memoizedState =
      this.updateQueue =
      this.memoizedProps =
        null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null));
}
function Tt(e, t, n, r) {
  return new F1(e, t, n, r);
}
function bd(e) {
  return ((e = e.prototype), !(!e || !e.isReactComponent));
}
function z1(e) {
  if (typeof e == "function") return bd(e) ? 1 : 0;
  if (e != null) {
    if (((e = e.$$typeof), e === Bu)) return 11;
    if (e === Vu) return 14;
  }
  return 2;
}
function rr(e, t) {
  var n = e.alternate;
  return (
    n === null
      ? ((n = Tt(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t),
        (n.type = e.type),
        (n.flags = 0),
        (n.subtreeFlags = 0),
        (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies =
      t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  );
}
function na(e, t, n, r, o, s) {
  var a = 2;
  if (((r = e), typeof e == "function")) bd(e) && (a = 1);
  else if (typeof e == "string") a = 5;
  else
    e: switch (e) {
      case io:
        return Dr(n.children, o, s, t);
      case Uu:
        ((a = 8), (o |= 8));
        break;
      case yc:
        return (
          (e = Tt(12, n, t, o | 2)),
          (e.elementType = yc),
          (e.lanes = s),
          e
        );
      case xc:
        return ((e = Tt(13, n, t, o)), (e.elementType = xc), (e.lanes = s), e);
      case wc:
        return ((e = Tt(19, n, t, o)), (e.elementType = wc), (e.lanes = s), e);
      case Yh:
        return tl(n, o, s, t);
      default:
        if (typeof e == "object" && e !== null)
          switch (e.$$typeof) {
            case qh:
              a = 10;
              break e;
            case Gh:
              a = 9;
              break e;
            case Bu:
              a = 11;
              break e;
            case Vu:
              a = 14;
              break e;
            case Fn:
              ((a = 16), (r = null));
              break e;
          }
        throw Error(R(130, e == null ? e : typeof e, ""));
    }
  return (
    (t = Tt(a, n, t, o)),
    (t.elementType = e),
    (t.type = r),
    (t.lanes = s),
    t
  );
}
function Dr(e, t, n, r) {
  return ((e = Tt(7, e, r, t)), (e.lanes = n), e);
}
function tl(e, t, n, r) {
  return (
    (e = Tt(22, e, r, t)),
    (e.elementType = Yh),
    (e.lanes = n),
    (e.stateNode = { isHidden: !1 }),
    e
  );
}
function Zl(e, t, n) {
  return ((e = Tt(6, e, null, t)), (e.lanes = n), e);
}
function ec(e, t, n) {
  return (
    (t = Tt(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation,
    }),
    t
  );
}
function $1(e, t, n, r, o) {
  ((this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork =
      this.pingCache =
      this.current =
      this.pendingChildren =
        null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = Ml(0)),
    (this.expirationTimes = Ml(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = Ml(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = o),
    (this.mutableSourceEagerHydrationData = null));
}
function Nd(e, t, n, r, o, s, a, l, c) {
  return (
    (e = new $1(e, t, n, l, c)),
    t === 1 ? ((t = 1), s === !0 && (t |= 8)) : (t = 0),
    (s = Tt(3, null, null, t)),
    (e.current = s),
    (s.stateNode = e),
    (s.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    ad(s),
    e
  );
}
function U1(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: so,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: t,
    implementation: n,
  };
}
function Ug(e) {
  if (!e) return ir;
  e = e._reactInternals;
  e: {
    if (Qr(e) !== e || e.tag !== 1) throw Error(R(170));
    var t = e;
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context;
          break e;
        case 1:
          if (pt(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      t = t.return;
    } while (t !== null);
    throw Error(R(171));
  }
  if (e.tag === 1) {
    var n = e.type;
    if (pt(n)) return Um(e, n, t);
  }
  return t;
}
function Bg(e, t, n, r, o, s, a, l, c) {
  return (
    (e = Nd(n, r, !0, e, o, s, a, l, c)),
    (e.context = Ug(null)),
    (n = e.current),
    (r = it()),
    (o = nr(n)),
    (s = xn(r, o)),
    (s.callback = t ?? null),
    er(n, s, o),
    (e.current.lanes = o),
    ui(e, o, r),
    ht(e, r),
    e
  );
}
function nl(e, t, n, r) {
  var o = t.current,
    s = it(),
    a = nr(o);
  return (
    (n = Ug(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = xn(s, a)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    (e = er(o, t, a)),
    e !== null && (qt(e, o, a, s), Yi(e, o, a)),
    a
  );
}
function Aa(e) {
  if (((e = e.current), !e.child)) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function bp(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane;
    e.retryLane = n !== 0 && n < t ? n : t;
  }
}
function Cd(e, t) {
  (bp(e, t), (e = e.alternate) && bp(e, t));
}
function B1() {
  return null;
}
var Vg =
  typeof reportError == "function"
    ? reportError
    : function (e) {
        console.error(e);
      };
function Ed(e) {
  this._internalRoot = e;
}
rl.prototype.render = Ed.prototype.render = function (e) {
  var t = this._internalRoot;
  if (t === null) throw Error(R(409));
  nl(e, t, null, null);
};
rl.prototype.unmount = Ed.prototype.unmount = function () {
  var e = this._internalRoot;
  if (e !== null) {
    this._internalRoot = null;
    var t = e.containerInfo;
    (Ur(function () {
      nl(null, e, null, null);
    }),
      (t[jn] = null));
  }
};
function rl(e) {
  this._internalRoot = e;
}
rl.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = wm();
    e = { blockedOn: null, target: e, priority: t };
    for (var n = 0; n < $n.length && t !== 0 && t < $n[n].priority; n++);
    ($n.splice(n, 0, e), n === 0 && jm(e));
  }
};
function kd(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
}
function ol(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "))
  );
}
function Np() {}
function V1(e, t, n, r, o) {
  if (o) {
    if (typeof r == "function") {
      var s = r;
      r = function () {
        var u = Aa(a);
        s.call(u);
      };
    }
    var a = Bg(t, r, e, 0, null, !1, !1, "", Np);
    return (
      (e._reactRootContainer = a),
      (e[jn] = a.current),
      Ws(e.nodeType === 8 ? e.parentNode : e),
      Ur(),
      a
    );
  }
  for (; (o = e.lastChild);) e.removeChild(o);
  if (typeof r == "function") {
    var l = r;
    r = function () {
      var u = Aa(c);
      l.call(u);
    };
  }
  var c = Nd(e, 0, !1, null, null, !1, !1, "", Np);
  return (
    (e._reactRootContainer = c),
    (e[jn] = c.current),
    Ws(e.nodeType === 8 ? e.parentNode : e),
    Ur(function () {
      nl(t, c, n, r);
    }),
    c
  );
}
function sl(e, t, n, r, o) {
  var s = n._reactRootContainer;
  if (s) {
    var a = s;
    if (typeof o == "function") {
      var l = o;
      o = function () {
        var c = Aa(a);
        l.call(c);
      };
    }
    nl(t, a, e, o);
  } else a = V1(n, t, e, o, r);
  return Aa(a);
}
ym = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode;
      if (t.current.memoizedState.isDehydrated) {
        var n = Ss(t.pendingLanes);
        n !== 0 &&
          (Ku(t, n | 1), ht(t, Le()), !(se & 6) && ((Bo = Le() + 500), pr()));
      }
      break;
    case 13:
      (Ur(function () {
        var r = bn(e, 1);
        if (r !== null) {
          var o = it();
          qt(r, e, 1, o);
        }
      }),
        Cd(e, 1));
  }
};
Qu = function (e) {
  if (e.tag === 13) {
    var t = bn(e, 134217728);
    if (t !== null) {
      var n = it();
      qt(t, e, 134217728, n);
    }
    Cd(e, 134217728);
  }
};
xm = function (e) {
  if (e.tag === 13) {
    var t = nr(e),
      n = bn(e, t);
    if (n !== null) {
      var r = it();
      qt(n, e, t, r);
    }
    Cd(e, t);
  }
};
wm = function () {
  return he;
};
Sm = function (e, t) {
  var n = he;
  try {
    return ((he = e), t());
  } finally {
    he = n;
  }
};
Rc = function (e, t, n) {
  switch (t) {
    case "input":
      if ((bc(e, n), (t = n.name), n.type === "radio" && t != null)) {
        for (n = e; n.parentNode;) n = n.parentNode;
        for (
          n = n.querySelectorAll(
            "input[name=" + JSON.stringify("" + t) + '][type="radio"]',
          ),
            t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t];
          if (r !== e && r.form === e.form) {
            var o = Ga(r);
            if (!o) throw Error(R(90));
            (Jh(r), bc(r, o));
          }
        }
      }
      break;
    case "textarea":
      em(e, n);
      break;
    case "select":
      ((t = n.value), t != null && yo(e, !!n.multiple, t, !1));
  }
};
am = wd;
lm = Ur;
var W1 = { usingClientEntryPoint: !1, Events: [fi, uo, Ga, sm, im, wd] },
  gs = {
    findFiberByHostInstance: Er,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom",
  },
  H1 = {
    bundleType: gs.bundleType,
    version: gs.version,
    rendererPackageName: gs.rendererPackageName,
    rendererConfig: gs.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: kn.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return ((e = dm(e)), e === null ? null : e.stateNode);
    },
    findFiberByHostInstance: gs.findFiberByHostInstance || B1,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426",
  };
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
  var _i = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!_i.isDisabled && _i.supportsFiber)
    try {
      ((Ha = _i.inject(H1)), (ln = _i));
    } catch {}
}
jt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W1;
jt.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
  if (!kd(t)) throw Error(R(200));
  return U1(e, t, null, n);
};
jt.createRoot = function (e, t) {
  if (!kd(e)) throw Error(R(299));
  var n = !1,
    r = "",
    o = Vg;
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (o = t.onRecoverableError)),
    (t = Nd(e, 1, !1, null, null, n, !1, r, o)),
    (e[jn] = t.current),
    Ws(e.nodeType === 8 ? e.parentNode : e),
    new Ed(t)
  );
};
jt.findDOMNode = function (e) {
  if (e == null) return null;
  if (e.nodeType === 1) return e;
  var t = e._reactInternals;
  if (t === void 0)
    throw typeof e.render == "function"
      ? Error(R(188))
      : ((e = Object.keys(e).join(",")), Error(R(268, e)));
  return ((e = dm(t)), (e = e === null ? null : e.stateNode), e);
};
jt.flushSync = function (e) {
  return Ur(e);
};
jt.hydrate = function (e, t, n) {
  if (!ol(t)) throw Error(R(200));
  return sl(null, e, t, !0, n);
};
jt.hydrateRoot = function (e, t, n) {
  if (!kd(e)) throw Error(R(405));
  var r = (n != null && n.hydratedSources) || null,
    o = !1,
    s = "",
    a = Vg;
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (o = !0),
      n.identifierPrefix !== void 0 && (s = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (a = n.onRecoverableError)),
    (t = Bg(t, null, e, 1, n ?? null, o, !1, s, a)),
    (e[jn] = t.current),
    Ws(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      ((n = r[e]),
        (o = n._getVersion),
        (o = o(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, o])
          : t.mutableSourceEagerHydrationData.push(n, o));
  return new rl(t);
};
jt.render = function (e, t, n) {
  if (!ol(t)) throw Error(R(200));
  return sl(null, e, t, !1, n);
};
jt.unmountComponentAtNode = function (e) {
  if (!ol(e)) throw Error(R(40));
  return e._reactRootContainer
    ? (Ur(function () {
        sl(null, null, e, !1, function () {
          ((e._reactRootContainer = null), (e[jn] = null));
        });
      }),
      !0)
    : !1;
};
jt.unstable_batchedUpdates = wd;
jt.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!ol(n)) throw Error(R(200));
  if (e == null || e._reactInternals === void 0) throw Error(R(38));
  return sl(e, t, n, !1, r);
};
jt.version = "18.3.1-next-f1338f8080-20240426";
function Wg() {
  if (!(
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" ||
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function"
  ))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Wg);
    } catch (e) {
      console.error(e);
    }
}
(Wg(), (Wh.exports = jt));
var qr = Wh.exports;
const Hg = Ih(qr);
var Kg,
  Cp = qr;
((Kg = Cp.createRoot), Cp.hydrateRoot);
const K1 = 1,
  Q1 = 1e6;
let tc = 0;
function q1() {
  return ((tc = (tc + 1) % Number.MAX_SAFE_INTEGER), tc.toString());
}
const nc = new Map(),
  Ep = (e) => {
    if (nc.has(e)) return;
    const t = setTimeout(() => {
      (nc.delete(e), _s({ type: "REMOVE_TOAST", toastId: e }));
    }, Q1);
    nc.set(e, t);
  },
  G1 = (e, t) => {
    switch (t.type) {
      case "ADD_TOAST":
        return { ...e, toasts: [t.toast, ...e.toasts].slice(0, K1) };
      case "UPDATE_TOAST":
        return {
          ...e,
          toasts: e.toasts.map((n) =>
            n.id === t.toast.id ? { ...n, ...t.toast } : n,
          ),
        };
      case "DISMISS_TOAST": {
        const { toastId: n } = t;
        return (
          n
            ? Ep(n)
            : e.toasts.forEach((r) => {
                Ep(r.id);
              }),
          {
            ...e,
            toasts: e.toasts.map((r) =>
              r.id === n || n === void 0 ? { ...r, open: !1 } : r,
            ),
          }
        );
      }
      case "REMOVE_TOAST":
        return t.toastId === void 0
          ? { ...e, toasts: [] }
          : { ...e, toasts: e.toasts.filter((n) => n.id !== t.toastId) };
    }
  },
  ra = [];
let oa = { toasts: [] };
function _s(e) {
  ((oa = G1(oa, e)),
    ra.forEach((t) => {
      t(oa);
    }));
}
function Y1({ ...e }) {
  const t = q1(),
    n = (o) => _s({ type: "UPDATE_TOAST", toast: { ...o, id: t } }),
    r = () => _s({ type: "DISMISS_TOAST", toastId: t });
  return (
    _s({
      type: "ADD_TOAST",
      toast: {
        ...e,
        id: t,
        open: !0,
        onOpenChange: (o) => {
          o || r();
        },
      },
    }),
    { id: t, dismiss: r, update: n }
  );
}
function X1() {
  const [e, t] = f.useState(oa);
  return (
    f.useEffect(
      () => (
        ra.push(t),
        () => {
          const n = ra.indexOf(t);
          n > -1 && ra.splice(n, 1);
        }
      ),
      [e],
    ),
    {
      ...e,
      toast: Y1,
      dismiss: (n) => _s({ type: "DISMISS_TOAST", toastId: n }),
    }
  );
}
function ee(e, t, { checkForDefaultPrevented: n = !0 } = {}) {
  return function (o) {
    if ((e == null || e(o), n === !1 || !o.defaultPrevented))
      return t == null ? void 0 : t(o);
  };
}
function kp(e, t) {
  if (typeof e == "function") return e(t);
  e != null && (e.current = t);
}
function Qg(...e) {
  return (t) => {
    let n = !1;
    const r = e.map((o) => {
      const s = kp(o, t);
      return (!n && typeof s == "function" && (n = !0), s);
    });
    if (n)
      return () => {
        for (let o = 0; o < r.length; o++) {
          const s = r[o];
          typeof s == "function" ? s() : kp(e[o], null);
        }
      };
  };
}
function Ne(...e) {
  return f.useCallback(Qg(...e), e);
}
function J1(e, t) {
  const n = f.createContext(t),
    r = (s) => {
      const { children: a, ...l } = s,
        c = f.useMemo(() => l, Object.values(l));
      return i.jsx(n.Provider, { value: c, children: a });
    };
  r.displayName = e + "Provider";
  function o(s) {
    const a = f.useContext(n);
    if (a) return a;
    if (t !== void 0) return t;
    throw new Error(`\`${s}\` must be used within \`${e}\``);
  }
  return [r, o];
}
function Gr(e, t = []) {
  let n = [];
  function r(s, a) {
    const l = f.createContext(a),
      c = n.length;
    n = [...n, a];
    const u = (p) => {
      var y;
      const { scope: m, children: g, ...S } = p,
        h = ((y = m == null ? void 0 : m[e]) == null ? void 0 : y[c]) || l,
        w = f.useMemo(() => S, Object.values(S));
      return i.jsx(h.Provider, { value: w, children: g });
    };
    u.displayName = s + "Provider";
    function d(p, m) {
      var h;
      const g = ((h = m == null ? void 0 : m[e]) == null ? void 0 : h[c]) || l,
        S = f.useContext(g);
      if (S) return S;
      if (a !== void 0) return a;
      throw new Error(`\`${p}\` must be used within \`${s}\``);
    }
    return [u, d];
  }
  const o = () => {
    const s = n.map((a) => f.createContext(a));
    return function (l) {
      const c = (l == null ? void 0 : l[e]) || s;
      return f.useMemo(() => ({ [`__scope${e}`]: { ...l, [e]: c } }), [l, c]);
    };
  };
  return ((o.scopeName = e), [r, Z1(o, ...t)]);
}
function Z1(...e) {
  const t = e[0];
  if (e.length === 1) return t;
  const n = () => {
    const r = e.map((o) => ({ useScope: o(), scopeName: o.scopeName }));
    return function (s) {
      const a = r.reduce((l, { useScope: c, scopeName: u }) => {
        const p = c(s)[`__scope${u}`];
        return { ...l, ...p };
      }, {});
      return f.useMemo(() => ({ [`__scope${t.scopeName}`]: a }), [a]);
    };
  };
  return ((n.scopeName = t.scopeName), n);
}
function Vo(e) {
  const t = tS(e),
    n = f.forwardRef((r, o) => {
      const { children: s, ...a } = r,
        l = f.Children.toArray(s),
        c = l.find(rS);
      if (c) {
        const u = c.props.children,
          d = l.map((p) =>
            p === c
              ? f.Children.count(u) > 1
                ? f.Children.only(null)
                : f.isValidElement(u)
                  ? u.props.children
                  : null
              : p,
          );
        return i.jsx(t, {
          ...a,
          ref: o,
          children: f.isValidElement(u) ? f.cloneElement(u, void 0, d) : null,
        });
      }
      return i.jsx(t, { ...a, ref: o, children: s });
    });
  return ((n.displayName = `${e}.Slot`), n);
}
var eS = Vo("Slot");
function tS(e) {
  const t = f.forwardRef((n, r) => {
    const { children: o, ...s } = n;
    if (f.isValidElement(o)) {
      const a = sS(o),
        l = oS(s, o.props);
      return (
        o.type !== f.Fragment && (l.ref = r ? Qg(r, a) : a),
        f.cloneElement(o, l)
      );
    }
    return f.Children.count(o) > 1 ? f.Children.only(null) : null;
  });
  return ((t.displayName = `${e}.SlotClone`), t);
}
var qg = Symbol("radix.slottable");
function nS(e) {
  const t = ({ children: n }) => i.jsx(i.Fragment, { children: n });
  return ((t.displayName = `${e}.Slottable`), (t.__radixId = qg), t);
}
function rS(e) {
  return (
    f.isValidElement(e) &&
    typeof e.type == "function" &&
    "__radixId" in e.type &&
    e.type.__radixId === qg
  );
}
function oS(e, t) {
  const n = { ...t };
  for (const r in t) {
    const o = e[r],
      s = t[r];
    /^on[A-Z]/.test(r)
      ? o && s
        ? (n[r] = (...l) => {
            const c = s(...l);
            return (o(...l), c);
          })
        : o && (n[r] = o)
      : r === "style"
        ? (n[r] = { ...o, ...s })
        : r === "className" && (n[r] = [o, s].filter(Boolean).join(" "));
  }
  return { ...e, ...n };
}
function sS(e) {
  var r, o;
  let t =
      (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null
        ? void 0
        : r.get,
    n = t && "isReactWarning" in t && t.isReactWarning;
  return n
    ? e.ref
    : ((t =
        (o = Object.getOwnPropertyDescriptor(e, "ref")) == null
          ? void 0
          : o.get),
      (n = t && "isReactWarning" in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref);
}
function Gg(e) {
  const t = e + "CollectionProvider",
    [n, r] = Gr(t),
    [o, s] = n(t, { collectionRef: { current: null }, itemMap: new Map() }),
    a = (h) => {
      const { scope: w, children: y } = h,
        v = A.useRef(null),
        x = A.useRef(new Map()).current;
      return i.jsx(o, { scope: w, itemMap: x, collectionRef: v, children: y });
    };
  a.displayName = t;
  const l = e + "CollectionSlot",
    c = Vo(l),
    u = A.forwardRef((h, w) => {
      const { scope: y, children: v } = h,
        x = s(l, y),
        j = Ne(w, x.collectionRef);
      return i.jsx(c, { ref: j, children: v });
    });
  u.displayName = l;
  const d = e + "CollectionItemSlot",
    p = "data-radix-collection-item",
    m = Vo(d),
    g = A.forwardRef((h, w) => {
      const { scope: y, children: v, ...x } = h,
        j = A.useRef(null),
        b = Ne(w, j),
        N = s(d, y);
      return (
        A.useEffect(
          () => (
            N.itemMap.set(j, { ref: j, ...x }),
            () => void N.itemMap.delete(j)
          ),
        ),
        i.jsx(m, { [p]: "", ref: b, children: v })
      );
    });
  g.displayName = d;
  function S(h) {
    const w = s(e + "CollectionConsumer", h);
    return A.useCallback(() => {
      const v = w.collectionRef.current;
      if (!v) return [];
      const x = Array.from(v.querySelectorAll(`[${p}]`));
      return Array.from(w.itemMap.values()).sort(
        (N, C) => x.indexOf(N.ref.current) - x.indexOf(C.ref.current),
      );
    }, [w.collectionRef, w.itemMap]);
  }
  return [{ Provider: a, Slot: u, ItemSlot: g }, S, r];
}
var iS = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul",
  ],
  ne = iS.reduce((e, t) => {
    const n = Vo(`Primitive.${t}`),
      r = f.forwardRef((o, s) => {
        const { asChild: a, ...l } = o,
          c = a ? n : t;
        return (
          typeof window < "u" && (window[Symbol.for("radix-ui")] = !0),
          i.jsx(c, { ...l, ref: s })
        );
      });
    return ((r.displayName = `Primitive.${t}`), { ...e, [t]: r });
  }, {});
function Yg(e, t) {
  e && qr.flushSync(() => e.dispatchEvent(t));
}
function Ot(e) {
  const t = f.useRef(e);
  return (
    f.useEffect(() => {
      t.current = e;
    }),
    f.useMemo(
      () =>
        (...n) => {
          var r;
          return (r = t.current) == null ? void 0 : r.call(t, ...n);
        },
      [],
    )
  );
}
function aS(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = Ot(e);
  f.useEffect(() => {
    const r = (o) => {
      o.key === "Escape" && n(o);
    };
    return (
      t.addEventListener("keydown", r, { capture: !0 }),
      () => t.removeEventListener("keydown", r, { capture: !0 })
    );
  }, [n, t]);
}
var lS = "DismissableLayer",
  cu = "dismissableLayer.update",
  cS = "dismissableLayer.pointerDownOutside",
  uS = "dismissableLayer.focusOutside",
  Pp,
  Xg = f.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set(),
  }),
  hi = f.forwardRef((e, t) => {
    const {
        disableOutsidePointerEvents: n = !1,
        onEscapeKeyDown: r,
        onPointerDownOutside: o,
        onFocusOutside: s,
        onInteractOutside: a,
        onDismiss: l,
        ...c
      } = e,
      u = f.useContext(Xg),
      [d, p] = f.useState(null),
      m =
        (d == null ? void 0 : d.ownerDocument) ??
        (globalThis == null ? void 0 : globalThis.document),
      [, g] = f.useState({}),
      S = Ne(t, (C) => p(C)),
      h = Array.from(u.layers),
      [w] = [...u.layersWithOutsidePointerEventsDisabled].slice(-1),
      y = h.indexOf(w),
      v = d ? h.indexOf(d) : -1,
      x = u.layersWithOutsidePointerEventsDisabled.size > 0,
      j = v >= y,
      b = fS((C) => {
        const T = C.target,
          I = [...u.branches].some((O) => O.contains(T));
        !j ||
          I ||
          (o == null || o(C),
          a == null || a(C),
          C.defaultPrevented || l == null || l());
      }, m),
      N = pS((C) => {
        const T = C.target;
        [...u.branches].some((O) => O.contains(T)) ||
          (s == null || s(C),
          a == null || a(C),
          C.defaultPrevented || l == null || l());
      }, m);
    return (
      aS((C) => {
        v === u.layers.size - 1 &&
          (r == null || r(C),
          !C.defaultPrevented && l && (C.preventDefault(), l()));
      }, m),
      f.useEffect(() => {
        if (d)
          return (
            n &&
              (u.layersWithOutsidePointerEventsDisabled.size === 0 &&
                ((Pp = m.body.style.pointerEvents),
                (m.body.style.pointerEvents = "none")),
              u.layersWithOutsidePointerEventsDisabled.add(d)),
            u.layers.add(d),
            Tp(),
            () => {
              n &&
                u.layersWithOutsidePointerEventsDisabled.size === 1 &&
                (m.body.style.pointerEvents = Pp);
            }
          );
      }, [d, m, n, u]),
      f.useEffect(
        () => () => {
          d &&
            (u.layers.delete(d),
            u.layersWithOutsidePointerEventsDisabled.delete(d),
            Tp());
        },
        [d, u],
      ),
      f.useEffect(() => {
        const C = () => g({});
        return (
          document.addEventListener(cu, C),
          () => document.removeEventListener(cu, C)
        );
      }, []),
      i.jsx(ne.div, {
        ...c,
        ref: S,
        style: {
          pointerEvents: x ? (j ? "auto" : "none") : void 0,
          ...e.style,
        },
        onFocusCapture: ee(e.onFocusCapture, N.onFocusCapture),
        onBlurCapture: ee(e.onBlurCapture, N.onBlurCapture),
        onPointerDownCapture: ee(
          e.onPointerDownCapture,
          b.onPointerDownCapture,
        ),
      })
    );
  });
hi.displayName = lS;
var dS = "DismissableLayerBranch",
  Jg = f.forwardRef((e, t) => {
    const n = f.useContext(Xg),
      r = f.useRef(null),
      o = Ne(t, r);
    return (
      f.useEffect(() => {
        const s = r.current;
        if (s)
          return (
            n.branches.add(s),
            () => {
              n.branches.delete(s);
            }
          );
      }, [n.branches]),
      i.jsx(ne.div, { ...e, ref: o })
    );
  });
Jg.displayName = dS;
function fS(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = Ot(e),
    r = f.useRef(!1),
    o = f.useRef(() => {});
  return (
    f.useEffect(() => {
      const s = (l) => {
          if (l.target && !r.current) {
            let c = function () {
              Zg(cS, n, u, { discrete: !0 });
            };
            const u = { originalEvent: l };
            l.pointerType === "touch"
              ? (t.removeEventListener("click", o.current),
                (o.current = c),
                t.addEventListener("click", o.current, { once: !0 }))
              : c();
          } else t.removeEventListener("click", o.current);
          r.current = !1;
        },
        a = window.setTimeout(() => {
          t.addEventListener("pointerdown", s);
        }, 0);
      return () => {
        (window.clearTimeout(a),
          t.removeEventListener("pointerdown", s),
          t.removeEventListener("click", o.current));
      };
    }, [t, n]),
    { onPointerDownCapture: () => (r.current = !0) }
  );
}
function pS(e, t = globalThis == null ? void 0 : globalThis.document) {
  const n = Ot(e),
    r = f.useRef(!1);
  return (
    f.useEffect(() => {
      const o = (s) => {
        s.target &&
          !r.current &&
          Zg(uS, n, { originalEvent: s }, { discrete: !1 });
      };
      return (
        t.addEventListener("focusin", o),
        () => t.removeEventListener("focusin", o)
      );
    }, [t, n]),
    {
      onFocusCapture: () => (r.current = !0),
      onBlurCapture: () => (r.current = !1),
    }
  );
}
function Tp() {
  const e = new CustomEvent(cu);
  document.dispatchEvent(e);
}
function Zg(e, t, n, { discrete: r }) {
  const o = n.originalEvent.target,
    s = new CustomEvent(e, { bubbles: !1, cancelable: !0, detail: n });
  (t && o.addEventListener(e, t, { once: !0 }),
    r ? Yg(o, s) : o.dispatchEvent(s));
}
var hS = hi,
  mS = Jg,
  Ue = globalThis != null && globalThis.document ? f.useLayoutEffect : () => {},
  gS = "Portal",
  il = f.forwardRef((e, t) => {
    var l;
    const { container: n, ...r } = e,
      [o, s] = f.useState(!1);
    Ue(() => s(!0), []);
    const a =
      n ||
      (o &&
        ((l = globalThis == null ? void 0 : globalThis.document) == null
          ? void 0
          : l.body));
    return a ? Hg.createPortal(i.jsx(ne.div, { ...r, ref: t }), a) : null;
  });
il.displayName = gS;
function vS(e, t) {
  return f.useReducer((n, r) => t[n][r] ?? n, e);
}
var Zo = (e) => {
  const { present: t, children: n } = e,
    r = yS(t),
    o =
      typeof n == "function" ? n({ present: r.isPresent }) : f.Children.only(n),
    s = Ne(r.ref, xS(o));
  return typeof n == "function" || r.isPresent
    ? f.cloneElement(o, { ref: s })
    : null;
};
Zo.displayName = "Presence";
function yS(e) {
  const [t, n] = f.useState(),
    r = f.useRef(null),
    o = f.useRef(e),
    s = f.useRef("none"),
    a = e ? "mounted" : "unmounted",
    [l, c] = vS(a, {
      mounted: { UNMOUNT: "unmounted", ANIMATION_OUT: "unmountSuspended" },
      unmountSuspended: { MOUNT: "mounted", ANIMATION_END: "unmounted" },
      unmounted: { MOUNT: "mounted" },
    });
  return (
    f.useEffect(() => {
      const u = Di(r.current);
      s.current = l === "mounted" ? u : "none";
    }, [l]),
    Ue(() => {
      const u = r.current,
        d = o.current;
      if (d !== e) {
        const m = s.current,
          g = Di(u);
        (e
          ? c("MOUNT")
          : g === "none" || (u == null ? void 0 : u.display) === "none"
            ? c("UNMOUNT")
            : c(d && m !== g ? "ANIMATION_OUT" : "UNMOUNT"),
          (o.current = e));
      }
    }, [e, c]),
    Ue(() => {
      if (t) {
        let u;
        const d = t.ownerDocument.defaultView ?? window,
          p = (g) => {
            const h = Di(r.current).includes(g.animationName);
            if (g.target === t && h && (c("ANIMATION_END"), !o.current)) {
              const w = t.style.animationFillMode;
              ((t.style.animationFillMode = "forwards"),
                (u = d.setTimeout(() => {
                  t.style.animationFillMode === "forwards" &&
                    (t.style.animationFillMode = w);
                })));
            }
          },
          m = (g) => {
            g.target === t && (s.current = Di(r.current));
          };
        return (
          t.addEventListener("animationstart", m),
          t.addEventListener("animationcancel", p),
          t.addEventListener("animationend", p),
          () => {
            (d.clearTimeout(u),
              t.removeEventListener("animationstart", m),
              t.removeEventListener("animationcancel", p),
              t.removeEventListener("animationend", p));
          }
        );
      } else c("ANIMATION_END");
    }, [t, c]),
    {
      isPresent: ["mounted", "unmountSuspended"].includes(l),
      ref: f.useCallback((u) => {
        ((r.current = u ? getComputedStyle(u) : null), n(u));
      }, []),
    }
  );
}
function Di(e) {
  return (e == null ? void 0 : e.animationName) || "none";
}
function xS(e) {
  var r, o;
  let t =
      (r = Object.getOwnPropertyDescriptor(e.props, "ref")) == null
        ? void 0
        : r.get,
    n = t && "isReactWarning" in t && t.isReactWarning;
  return n
    ? e.ref
    : ((t =
        (o = Object.getOwnPropertyDescriptor(e, "ref")) == null
          ? void 0
          : o.get),
      (n = t && "isReactWarning" in t && t.isReactWarning),
      n ? e.props.ref : e.props.ref || e.ref);
}
var wS = Lu[" useInsertionEffect ".trim().toString()] || Ue;
function Ia({ prop: e, defaultProp: t, onChange: n = () => {}, caller: r }) {
  const [o, s, a] = SS({ defaultProp: t, onChange: n }),
    l = e !== void 0,
    c = l ? e : o;
  {
    const d = f.useRef(e !== void 0);
    f.useEffect(() => {
      const p = d.current;
      (p !== l &&
        console.warn(
          `${r} is changing from ${p ? "controlled" : "uncontrolled"} to ${l ? "controlled" : "uncontrolled"}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`,
        ),
        (d.current = l));
    }, [l, r]);
  }
  const u = f.useCallback(
    (d) => {
      var p;
      if (l) {
        const m = jS(d) ? d(e) : d;
        m !== e && ((p = a.current) == null || p.call(a, m));
      } else s(d);
    },
    [l, e, s, a],
  );
  return [c, u];
}
function SS({ defaultProp: e, onChange: t }) {
  const [n, r] = f.useState(e),
    o = f.useRef(n),
    s = f.useRef(t);
  return (
    wS(() => {
      s.current = t;
    }, [t]),
    f.useEffect(() => {
      var a;
      o.current !== n &&
        ((a = s.current) == null || a.call(s, n), (o.current = n));
    }, [n, o]),
    [n, r, s]
  );
}
function jS(e) {
  return typeof e == "function";
}
var ev = Object.freeze({
    position: "absolute",
    border: 0,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    wordWrap: "normal",
  }),
  bS = "VisuallyHidden",
  al = f.forwardRef((e, t) =>
    i.jsx(ne.span, { ...e, ref: t, style: { ...ev, ...e.style } }),
  );
al.displayName = bS;
var NS = al,
  Pd = "ToastProvider",
  [Td, CS, ES] = Gg("Toast"),
  [tv, Yk] = Gr("Toast", [ES]),
  [kS, ll] = tv(Pd),
  nv = (e) => {
    const {
        __scopeToast: t,
        label: n = "Notification",
        duration: r = 5e3,
        swipeDirection: o = "right",
        swipeThreshold: s = 50,
        children: a,
      } = e,
      [l, c] = f.useState(null),
      [u, d] = f.useState(0),
      p = f.useRef(!1),
      m = f.useRef(!1);
    return (
      n.trim() ||
        console.error(
          `Invalid prop \`label\` supplied to \`${Pd}\`. Expected non-empty \`string\`.`,
        ),
      i.jsx(Td.Provider, {
        scope: t,
        children: i.jsx(kS, {
          scope: t,
          label: n,
          duration: r,
          swipeDirection: o,
          swipeThreshold: s,
          toastCount: u,
          viewport: l,
          onViewportChange: c,
          onToastAdd: f.useCallback(() => d((g) => g + 1), []),
          onToastRemove: f.useCallback(() => d((g) => g - 1), []),
          isFocusedToastEscapeKeyDownRef: p,
          isClosePausedRef: m,
          children: a,
        }),
      })
    );
  };
nv.displayName = Pd;
var rv = "ToastViewport",
  PS = ["F8"],
  uu = "toast.viewportPause",
  du = "toast.viewportResume",
  ov = f.forwardRef((e, t) => {
    const {
        __scopeToast: n,
        hotkey: r = PS,
        label: o = "Notifications ({hotkey})",
        ...s
      } = e,
      a = ll(rv, n),
      l = CS(n),
      c = f.useRef(null),
      u = f.useRef(null),
      d = f.useRef(null),
      p = f.useRef(null),
      m = Ne(t, p, a.onViewportChange),
      g = r.join("+").replace(/Key/g, "").replace(/Digit/g, ""),
      S = a.toastCount > 0;
    (f.useEffect(() => {
      const w = (y) => {
        var x;
        r.length !== 0 &&
          r.every((j) => y[j] || y.code === j) &&
          ((x = p.current) == null || x.focus());
      };
      return (
        document.addEventListener("keydown", w),
        () => document.removeEventListener("keydown", w)
      );
    }, [r]),
      f.useEffect(() => {
        const w = c.current,
          y = p.current;
        if (S && w && y) {
          const v = () => {
              if (!a.isClosePausedRef.current) {
                const N = new CustomEvent(uu);
                (y.dispatchEvent(N), (a.isClosePausedRef.current = !0));
              }
            },
            x = () => {
              if (a.isClosePausedRef.current) {
                const N = new CustomEvent(du);
                (y.dispatchEvent(N), (a.isClosePausedRef.current = !1));
              }
            },
            j = (N) => {
              !w.contains(N.relatedTarget) && x();
            },
            b = () => {
              w.contains(document.activeElement) || x();
            };
          return (
            w.addEventListener("focusin", v),
            w.addEventListener("focusout", j),
            w.addEventListener("pointermove", v),
            w.addEventListener("pointerleave", b),
            window.addEventListener("blur", v),
            window.addEventListener("focus", x),
            () => {
              (w.removeEventListener("focusin", v),
                w.removeEventListener("focusout", j),
                w.removeEventListener("pointermove", v),
                w.removeEventListener("pointerleave", b),
                window.removeEventListener("blur", v),
                window.removeEventListener("focus", x));
            }
          );
        }
      }, [S, a.isClosePausedRef]));
    const h = f.useCallback(
      ({ tabbingDirection: w }) => {
        const v = l().map((x) => {
          const j = x.ref.current,
            b = [j, ...US(j)];
          return w === "forwards" ? b : b.reverse();
        });
        return (w === "forwards" ? v.reverse() : v).flat();
      },
      [l],
    );
    return (
      f.useEffect(() => {
        const w = p.current;
        if (w) {
          const y = (v) => {
            var b, N, C;
            const x = v.altKey || v.ctrlKey || v.metaKey;
            if (v.key === "Tab" && !x) {
              const T = document.activeElement,
                I = v.shiftKey;
              if (v.target === w && I) {
                (b = u.current) == null || b.focus();
                return;
              }
              const _ = h({ tabbingDirection: I ? "backwards" : "forwards" }),
                V = _.findIndex((M) => M === T);
              rc(_.slice(V + 1))
                ? v.preventDefault()
                : I
                  ? (N = u.current) == null || N.focus()
                  : (C = d.current) == null || C.focus();
            }
          };
          return (
            w.addEventListener("keydown", y),
            () => w.removeEventListener("keydown", y)
          );
        }
      }, [l, h]),
      i.jsxs(mS, {
        ref: c,
        role: "region",
        "aria-label": o.replace("{hotkey}", g),
        tabIndex: -1,
        style: { pointerEvents: S ? void 0 : "none" },
        children: [
          S &&
            i.jsx(fu, {
              ref: u,
              onFocusFromOutsideViewport: () => {
                const w = h({ tabbingDirection: "forwards" });
                rc(w);
              },
            }),
          i.jsx(Td.Slot, {
            scope: n,
            children: i.jsx(ne.ol, { tabIndex: -1, ...s, ref: m }),
          }),
          S &&
            i.jsx(fu, {
              ref: d,
              onFocusFromOutsideViewport: () => {
                const w = h({ tabbingDirection: "backwards" });
                rc(w);
              },
            }),
        ],
      })
    );
  });
ov.displayName = rv;
var sv = "ToastFocusProxy",
  fu = f.forwardRef((e, t) => {
    const { __scopeToast: n, onFocusFromOutsideViewport: r, ...o } = e,
      s = ll(sv, n);
    return i.jsx(al, {
      "aria-hidden": !0,
      tabIndex: 0,
      ...o,
      ref: t,
      style: { position: "fixed" },
      onFocus: (a) => {
        var u;
        const l = a.relatedTarget;
        !((u = s.viewport) != null && u.contains(l)) && r();
      },
    });
  });
fu.displayName = sv;
var mi = "Toast",
  TS = "toast.swipeStart",
  RS = "toast.swipeMove",
  AS = "toast.swipeCancel",
  IS = "toast.swipeEnd",
  iv = f.forwardRef((e, t) => {
    const { forceMount: n, open: r, defaultOpen: o, onOpenChange: s, ...a } = e,
      [l, c] = Ia({ prop: r, defaultProp: o ?? !0, onChange: s, caller: mi });
    return i.jsx(Zo, {
      present: n || l,
      children: i.jsx(_S, {
        open: l,
        ...a,
        ref: t,
        onClose: () => c(!1),
        onPause: Ot(e.onPause),
        onResume: Ot(e.onResume),
        onSwipeStart: ee(e.onSwipeStart, (u) => {
          u.currentTarget.setAttribute("data-swipe", "start");
        }),
        onSwipeMove: ee(e.onSwipeMove, (u) => {
          const { x: d, y: p } = u.detail.delta;
          (u.currentTarget.setAttribute("data-swipe", "move"),
            u.currentTarget.style.setProperty(
              "--radix-toast-swipe-move-x",
              `${d}px`,
            ),
            u.currentTarget.style.setProperty(
              "--radix-toast-swipe-move-y",
              `${p}px`,
            ));
        }),
        onSwipeCancel: ee(e.onSwipeCancel, (u) => {
          (u.currentTarget.setAttribute("data-swipe", "cancel"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-end-x"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-end-y"));
        }),
        onSwipeEnd: ee(e.onSwipeEnd, (u) => {
          const { x: d, y: p } = u.detail.delta;
          (u.currentTarget.setAttribute("data-swipe", "end"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-move-x"),
            u.currentTarget.style.removeProperty("--radix-toast-swipe-move-y"),
            u.currentTarget.style.setProperty(
              "--radix-toast-swipe-end-x",
              `${d}px`,
            ),
            u.currentTarget.style.setProperty(
              "--radix-toast-swipe-end-y",
              `${p}px`,
            ),
            c(!1));
        }),
      }),
    });
  });
iv.displayName = mi;
var [OS, MS] = tv(mi, { onClose() {} }),
  _S = f.forwardRef((e, t) => {
    const {
        __scopeToast: n,
        type: r = "foreground",
        duration: o,
        open: s,
        onClose: a,
        onEscapeKeyDown: l,
        onPause: c,
        onResume: u,
        onSwipeStart: d,
        onSwipeMove: p,
        onSwipeCancel: m,
        onSwipeEnd: g,
        ...S
      } = e,
      h = ll(mi, n),
      [w, y] = f.useState(null),
      v = Ne(t, (M) => y(M)),
      x = f.useRef(null),
      j = f.useRef(null),
      b = o || h.duration,
      N = f.useRef(0),
      C = f.useRef(b),
      T = f.useRef(0),
      { onToastAdd: I, onToastRemove: O } = h,
      $ = Ot(() => {
        var H;
        ((w == null ? void 0 : w.contains(document.activeElement)) &&
          ((H = h.viewport) == null || H.focus()),
          a());
      }),
      _ = f.useCallback(
        (M) => {
          !M ||
            M === 1 / 0 ||
            (window.clearTimeout(T.current),
            (N.current = new Date().getTime()),
            (T.current = window.setTimeout($, M)));
        },
        [$],
      );
    (f.useEffect(() => {
      const M = h.viewport;
      if (M) {
        const H = () => {
            (_(C.current), u == null || u());
          },
          z = () => {
            const B = new Date().getTime() - N.current;
            ((C.current = C.current - B),
              window.clearTimeout(T.current),
              c == null || c());
          };
        return (
          M.addEventListener(uu, z),
          M.addEventListener(du, H),
          () => {
            (M.removeEventListener(uu, z), M.removeEventListener(du, H));
          }
        );
      }
    }, [h.viewport, b, c, u, _]),
      f.useEffect(() => {
        s && !h.isClosePausedRef.current && _(b);
      }, [s, b, h.isClosePausedRef, _]),
      f.useEffect(() => (I(), () => O()), [I, O]));
    const V = f.useMemo(() => (w ? pv(w) : null), [w]);
    return h.viewport
      ? i.jsxs(i.Fragment, {
          children: [
            V &&
              i.jsx(DS, {
                __scopeToast: n,
                role: "status",
                "aria-live": r === "foreground" ? "assertive" : "polite",
                "aria-atomic": !0,
                children: V,
              }),
            i.jsx(OS, {
              scope: n,
              onClose: $,
              children: qr.createPortal(
                i.jsx(Td.ItemSlot, {
                  scope: n,
                  children: i.jsx(hS, {
                    asChild: !0,
                    onEscapeKeyDown: ee(l, () => {
                      (h.isFocusedToastEscapeKeyDownRef.current || $(),
                        (h.isFocusedToastEscapeKeyDownRef.current = !1));
                    }),
                    children: i.jsx(ne.li, {
                      role: "status",
                      "aria-live": "off",
                      "aria-atomic": !0,
                      tabIndex: 0,
                      "data-state": s ? "open" : "closed",
                      "data-swipe-direction": h.swipeDirection,
                      ...S,
                      ref: v,
                      style: {
                        userSelect: "none",
                        touchAction: "none",
                        ...e.style,
                      },
                      onKeyDown: ee(e.onKeyDown, (M) => {
                        M.key === "Escape" &&
                          (l == null || l(M.nativeEvent),
                          M.nativeEvent.defaultPrevented ||
                            ((h.isFocusedToastEscapeKeyDownRef.current = !0),
                            $()));
                      }),
                      onPointerDown: ee(e.onPointerDown, (M) => {
                        M.button === 0 &&
                          (x.current = { x: M.clientX, y: M.clientY });
                      }),
                      onPointerMove: ee(e.onPointerMove, (M) => {
                        if (!x.current) return;
                        const H = M.clientX - x.current.x,
                          z = M.clientY - x.current.y,
                          B = !!j.current,
                          E = ["left", "right"].includes(h.swipeDirection),
                          P = ["left", "up"].includes(h.swipeDirection)
                            ? Math.min
                            : Math.max,
                          D = E ? P(0, H) : 0,
                          W = E ? 0 : P(0, z),
                          U = M.pointerType === "touch" ? 10 : 2,
                          J = { x: D, y: W },
                          Q = { originalEvent: M, delta: J };
                        B
                          ? ((j.current = J), Li(RS, p, Q, { discrete: !1 }))
                          : Rp(J, h.swipeDirection, U)
                            ? ((j.current = J),
                              Li(TS, d, Q, { discrete: !1 }),
                              M.target.setPointerCapture(M.pointerId))
                            : (Math.abs(H) > U || Math.abs(z) > U) &&
                              (x.current = null);
                      }),
                      onPointerUp: ee(e.onPointerUp, (M) => {
                        const H = j.current,
                          z = M.target;
                        if (
                          (z.hasPointerCapture(M.pointerId) &&
                            z.releasePointerCapture(M.pointerId),
                          (j.current = null),
                          (x.current = null),
                          H)
                        ) {
                          const B = M.currentTarget,
                            E = { originalEvent: M, delta: H };
                          (Rp(H, h.swipeDirection, h.swipeThreshold)
                            ? Li(IS, g, E, { discrete: !0 })
                            : Li(AS, m, E, { discrete: !0 }),
                            B.addEventListener(
                              "click",
                              (P) => P.preventDefault(),
                              { once: !0 },
                            ));
                        }
                      }),
                    }),
                  }),
                }),
                h.viewport,
              ),
            }),
          ],
        })
      : null;
  }),
  DS = (e) => {
    const { __scopeToast: t, children: n, ...r } = e,
      o = ll(mi, t),
      [s, a] = f.useState(!1),
      [l, c] = f.useState(!1);
    return (
      zS(() => a(!0)),
      f.useEffect(() => {
        const u = window.setTimeout(() => c(!0), 1e3);
        return () => window.clearTimeout(u);
      }, []),
      l
        ? null
        : i.jsx(il, {
            asChild: !0,
            children: i.jsx(al, {
              ...r,
              children:
                s && i.jsxs(i.Fragment, { children: [o.label, " ", n] }),
            }),
          })
    );
  },
  LS = "ToastTitle",
  av = f.forwardRef((e, t) => {
    const { __scopeToast: n, ...r } = e;
    return i.jsx(ne.div, { ...r, ref: t });
  });
av.displayName = LS;
var FS = "ToastDescription",
  lv = f.forwardRef((e, t) => {
    const { __scopeToast: n, ...r } = e;
    return i.jsx(ne.div, { ...r, ref: t });
  });
lv.displayName = FS;
var cv = "ToastAction",
  uv = f.forwardRef((e, t) => {
    const { altText: n, ...r } = e;
    return n.trim()
      ? i.jsx(fv, {
          altText: n,
          asChild: !0,
          children: i.jsx(Rd, { ...r, ref: t }),
        })
      : (console.error(
          `Invalid prop \`altText\` supplied to \`${cv}\`. Expected non-empty \`string\`.`,
        ),
        null);
  });
uv.displayName = cv;
var dv = "ToastClose",
  Rd = f.forwardRef((e, t) => {
    const { __scopeToast: n, ...r } = e,
      o = MS(dv, n);
    return i.jsx(fv, {
      asChild: !0,
      children: i.jsx(ne.button, {
        type: "button",
        ...r,
        ref: t,
        onClick: ee(e.onClick, o.onClose),
      }),
    });
  });
Rd.displayName = dv;
var fv = f.forwardRef((e, t) => {
  const { __scopeToast: n, altText: r, ...o } = e;
  return i.jsx(ne.div, {
    "data-radix-toast-announce-exclude": "",
    "data-radix-toast-announce-alt": r || void 0,
    ...o,
    ref: t,
  });
});
function pv(e) {
  const t = [];
  return (
    Array.from(e.childNodes).forEach((r) => {
      if (
        (r.nodeType === r.TEXT_NODE && r.textContent && t.push(r.textContent),
        $S(r))
      ) {
        const o = r.ariaHidden || r.hidden || r.style.display === "none",
          s = r.dataset.radixToastAnnounceExclude === "";
        if (!o)
          if (s) {
            const a = r.dataset.radixToastAnnounceAlt;
            a && t.push(a);
          } else t.push(...pv(r));
      }
    }),
    t
  );
}
function Li(e, t, n, { discrete: r }) {
  const o = n.originalEvent.currentTarget,
    s = new CustomEvent(e, { bubbles: !0, cancelable: !0, detail: n });
  (t && o.addEventListener(e, t, { once: !0 }),
    r ? Yg(o, s) : o.dispatchEvent(s));
}
var Rp = (e, t, n = 0) => {
  const r = Math.abs(e.x),
    o = Math.abs(e.y),
    s = r > o;
  return t === "left" || t === "right" ? s && r > n : !s && o > n;
};
function zS(e = () => {}) {
  const t = Ot(e);
  Ue(() => {
    let n = 0,
      r = 0;
    return (
      (n = window.requestAnimationFrame(
        () => (r = window.requestAnimationFrame(t)),
      )),
      () => {
        (window.cancelAnimationFrame(n), window.cancelAnimationFrame(r));
      }
    );
  }, [t]);
}
function $S(e) {
  return e.nodeType === e.ELEMENT_NODE;
}
function US(e) {
  const t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (r) => {
        const o = r.tagName === "INPUT" && r.type === "hidden";
        return r.disabled || r.hidden || o
          ? NodeFilter.FILTER_SKIP
          : r.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; n.nextNode();) t.push(n.currentNode);
  return t;
}
function rc(e) {
  const t = document.activeElement;
  return e.some((n) =>
    n === t ? !0 : (n.focus(), document.activeElement !== t),
  );
}
var BS = nv,
  hv = ov,
  mv = iv,
  gv = av,
  vv = lv,
  yv = uv,
  xv = Rd;
function wv(e) {
  var t,
    n,
    r = "";
  if (typeof e == "string" || typeof e == "number") r += e;
  else if (typeof e == "object")
    if (Array.isArray(e)) {
      var o = e.length;
      for (t = 0; t < o; t++)
        e[t] && (n = wv(e[t])) && (r && (r += " "), (r += n));
    } else for (n in e) e[n] && (r && (r += " "), (r += n));
  return r;
}
function Sv() {
  for (var e, t, n = 0, r = "", o = arguments.length; n < o; n++)
    (e = arguments[n]) && (t = wv(e)) && (r && (r += " "), (r += t));
  return r;
}
const Ap = (e) => (typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e),
  Ip = Sv,
  cl = (e, t) => (n) => {
    var r;
    if ((t == null ? void 0 : t.variants) == null)
      return Ip(
        e,
        n == null ? void 0 : n.class,
        n == null ? void 0 : n.className,
      );
    const { variants: o, defaultVariants: s } = t,
      a = Object.keys(o).map((u) => {
        const d = n == null ? void 0 : n[u],
          p = s == null ? void 0 : s[u];
        if (d === null) return null;
        const m = Ap(d) || Ap(p);
        return o[u][m];
      }),
      l =
        n &&
        Object.entries(n).reduce((u, d) => {
          let [p, m] = d;
          return (m === void 0 || (u[p] = m), u);
        }, {}),
      c =
        t == null || (r = t.compoundVariants) === null || r === void 0
          ? void 0
          : r.reduce((u, d) => {
              let { class: p, className: m, ...g } = d;
              return Object.entries(g).every((S) => {
                let [h, w] = S;
                return Array.isArray(w)
                  ? w.includes({ ...s, ...l }[h])
                  : { ...s, ...l }[h] === w;
              })
                ? [...u, p, m]
                : u;
            }, []);
    return Ip(
      e,
      a,
      c,
      n == null ? void 0 : n.class,
      n == null ? void 0 : n.className,
    );
  };
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const VS = (e) => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  jv = (...e) =>
    e
      .filter((t, n, r) => !!t && t.trim() !== "" && r.indexOf(t) === n)
      .join(" ")
      .trim();
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var WS = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const HS = f.forwardRef(
  (
    {
      color: e = "currentColor",
      size: t = 24,
      strokeWidth: n = 2,
      absoluteStrokeWidth: r,
      className: o = "",
      children: s,
      iconNode: a,
      ...l
    },
    c,
  ) =>
    f.createElement(
      "svg",
      {
        ref: c,
        ...WS,
        width: t,
        height: t,
        stroke: e,
        strokeWidth: r ? (Number(n) * 24) / Number(t) : n,
        className: jv("lucide", o),
        ...l,
      },
      [
        ...a.map(([u, d]) => f.createElement(u, d)),
        ...(Array.isArray(s) ? s : [s]),
      ],
    ),
);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const _e = (e, t) => {
  const n = f.forwardRef(({ className: r, ...o }, s) =>
    f.createElement(HS, {
      ref: s,
      iconNode: t,
      className: jv(`lucide-${VS(e)}`, r),
      ...o,
    }),
  );
  return ((n.displayName = `${e}`), n);
};
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const KS = _e("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const QS = _e("Calendar", [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  [
    "rect",
    { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" },
  ],
  ["path", { d: "M3 10h18", key: "8toen8" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Cr = _e("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const bv = _e("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const qS = _e("ChevronUp", [
  ["path", { d: "m18 15-6-6-6 6", key: "153udz" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const GS = _e("CircleAlert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Op = _e("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Mp = _e("Clock", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["polyline", { points: "12 6 12 12 16 14", key: "68esgv" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ad = _e("DollarSign", [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  [
    "path",
    { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" },
  ],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const YS = _e("Eye", [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0",
    },
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Nv = _e("FileText", [
  [
    "path",
    {
      d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
      key: "1rqfz7",
    },
  ],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const es = _e("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Cv = _e("LogOut", [
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }],
  ["polyline", { points: "16 17 21 12 16 7", key: "1gabdz" }],
  ["line", { x1: "21", x2: "9", y1: "12", y2: "12", key: "1uyos4" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ev = _e("MapPin", [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
      key: "1r0f0z",
    },
  ],
  ["circle", { cx: "12", cy: "10", r: "3", key: "ilqhr7" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Oa = _e("MessageSquare", [
  [
    "path",
    {
      d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
      key: "1lielz",
    },
  ],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Wo = _e("Plus", [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Ma = _e("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Id = _e("Send", [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3",
    },
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const XS = _e("Star", [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s",
    },
  ],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const ul = _e("User", [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const Od = _e("Wrench", [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
      key: "cbrjhi",
    },
  ],
]);
/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const kv = _e("X", [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ]),
  Md = "-",
  JS = (e) => {
    const t = ej(e),
      { conflictingClassGroups: n, conflictingClassGroupModifiers: r } = e;
    return {
      getClassGroupId: (a) => {
        const l = a.split(Md);
        return (l[0] === "" && l.length !== 1 && l.shift(), Pv(l, t) || ZS(a));
      },
      getConflictingClassGroupIds: (a, l) => {
        const c = n[a] || [];
        return l && r[a] ? [...c, ...r[a]] : c;
      },
    };
  },
  Pv = (e, t) => {
    var a;
    if (e.length === 0) return t.classGroupId;
    const n = e[0],
      r = t.nextPart.get(n),
      o = r ? Pv(e.slice(1), r) : void 0;
    if (o) return o;
    if (t.validators.length === 0) return;
    const s = e.join(Md);
    return (a = t.validators.find(({ validator: l }) => l(s))) == null
      ? void 0
      : a.classGroupId;
  },
  _p = /^\[(.+)\]$/,
  ZS = (e) => {
    if (_p.test(e)) {
      const t = _p.exec(e)[1],
        n = t == null ? void 0 : t.substring(0, t.indexOf(":"));
      if (n) return "arbitrary.." + n;
    }
  },
  ej = (e) => {
    const { theme: t, prefix: n } = e,
      r = { nextPart: new Map(), validators: [] };
    return (
      nj(Object.entries(e.classGroups), n).forEach(([s, a]) => {
        pu(a, r, s, t);
      }),
      r
    );
  },
  pu = (e, t, n, r) => {
    e.forEach((o) => {
      if (typeof o == "string") {
        const s = o === "" ? t : Dp(t, o);
        s.classGroupId = n;
        return;
      }
      if (typeof o == "function") {
        if (tj(o)) {
          pu(o(r), t, n, r);
          return;
        }
        t.validators.push({ validator: o, classGroupId: n });
        return;
      }
      Object.entries(o).forEach(([s, a]) => {
        pu(a, Dp(t, s), n, r);
      });
    });
  },
  Dp = (e, t) => {
    let n = e;
    return (
      t.split(Md).forEach((r) => {
        (n.nextPart.has(r) ||
          n.nextPart.set(r, { nextPart: new Map(), validators: [] }),
          (n = n.nextPart.get(r)));
      }),
      n
    );
  },
  tj = (e) => e.isThemeGetter,
  nj = (e, t) =>
    t
      ? e.map(([n, r]) => {
          const o = r.map((s) =>
            typeof s == "string"
              ? t + s
              : typeof s == "object"
                ? Object.fromEntries(
                    Object.entries(s).map(([a, l]) => [t + a, l]),
                  )
                : s,
          );
          return [n, o];
        })
      : e,
  rj = (e) => {
    if (e < 1) return { get: () => {}, set: () => {} };
    let t = 0,
      n = new Map(),
      r = new Map();
    const o = (s, a) => {
      (n.set(s, a), t++, t > e && ((t = 0), (r = n), (n = new Map())));
    };
    return {
      get(s) {
        let a = n.get(s);
        if (a !== void 0) return a;
        if ((a = r.get(s)) !== void 0) return (o(s, a), a);
      },
      set(s, a) {
        n.has(s) ? n.set(s, a) : o(s, a);
      },
    };
  },
  Tv = "!",
  oj = (e) => {
    const { separator: t, experimentalParseClassName: n } = e,
      r = t.length === 1,
      o = t[0],
      s = t.length,
      a = (l) => {
        const c = [];
        let u = 0,
          d = 0,
          p;
        for (let w = 0; w < l.length; w++) {
          let y = l[w];
          if (u === 0) {
            if (y === o && (r || l.slice(w, w + s) === t)) {
              (c.push(l.slice(d, w)), (d = w + s));
              continue;
            }
            if (y === "/") {
              p = w;
              continue;
            }
          }
          y === "[" ? u++ : y === "]" && u--;
        }
        const m = c.length === 0 ? l : l.substring(d),
          g = m.startsWith(Tv),
          S = g ? m.substring(1) : m,
          h = p && p > d ? p - d : void 0;
        return {
          modifiers: c,
          hasImportantModifier: g,
          baseClassName: S,
          maybePostfixModifierPosition: h,
        };
      };
    return n ? (l) => n({ className: l, parseClassName: a }) : a;
  },
  sj = (e) => {
    if (e.length <= 1) return e;
    const t = [];
    let n = [];
    return (
      e.forEach((r) => {
        r[0] === "[" ? (t.push(...n.sort(), r), (n = [])) : n.push(r);
      }),
      t.push(...n.sort()),
      t
    );
  },
  ij = (e) => ({ cache: rj(e.cacheSize), parseClassName: oj(e), ...JS(e) }),
  aj = /\s+/,
  lj = (e, t) => {
    const {
        parseClassName: n,
        getClassGroupId: r,
        getConflictingClassGroupIds: o,
      } = t,
      s = [],
      a = e.trim().split(aj);
    let l = "";
    for (let c = a.length - 1; c >= 0; c -= 1) {
      const u = a[c],
        {
          modifiers: d,
          hasImportantModifier: p,
          baseClassName: m,
          maybePostfixModifierPosition: g,
        } = n(u);
      let S = !!g,
        h = r(S ? m.substring(0, g) : m);
      if (!h) {
        if (!S) {
          l = u + (l.length > 0 ? " " + l : l);
          continue;
        }
        if (((h = r(m)), !h)) {
          l = u + (l.length > 0 ? " " + l : l);
          continue;
        }
        S = !1;
      }
      const w = sj(d).join(":"),
        y = p ? w + Tv : w,
        v = y + h;
      if (s.includes(v)) continue;
      s.push(v);
      const x = o(h, S);
      for (let j = 0; j < x.length; ++j) {
        const b = x[j];
        s.push(y + b);
      }
      l = u + (l.length > 0 ? " " + l : l);
    }
    return l;
  };
function cj() {
  let e = 0,
    t,
    n,
    r = "";
  for (; e < arguments.length;)
    (t = arguments[e++]) && (n = Rv(t)) && (r && (r += " "), (r += n));
  return r;
}
const Rv = (e) => {
  if (typeof e == "string") return e;
  let t,
    n = "";
  for (let r = 0; r < e.length; r++)
    e[r] && (t = Rv(e[r])) && (n && (n += " "), (n += t));
  return n;
};
function uj(e, ...t) {
  let n,
    r,
    o,
    s = a;
  function a(c) {
    const u = t.reduce((d, p) => p(d), e());
    return ((n = ij(u)), (r = n.cache.get), (o = n.cache.set), (s = l), l(c));
  }
  function l(c) {
    const u = r(c);
    if (u) return u;
    const d = lj(c, n);
    return (o(c, d), d);
  }
  return function () {
    return s(cj.apply(null, arguments));
  };
}
const we = (e) => {
    const t = (n) => n[e] || [];
    return ((t.isThemeGetter = !0), t);
  },
  Av = /^\[(?:([a-z-]+):)?(.+)\]$/i,
  dj = /^\d+\/\d+$/,
  fj = new Set(["px", "full", "screen"]),
  pj = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  hj =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  mj = /^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,
  gj = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  vj =
    /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  fn = (e) => No(e) || fj.has(e) || dj.test(e),
  Mn = (e) => ts(e, "length", Cj),
  No = (e) => !!e && !Number.isNaN(Number(e)),
  oc = (e) => ts(e, "number", No),
  vs = (e) => !!e && Number.isInteger(Number(e)),
  yj = (e) => e.endsWith("%") && No(e.slice(0, -1)),
  Z = (e) => Av.test(e),
  _n = (e) => pj.test(e),
  xj = new Set(["length", "size", "percentage"]),
  wj = (e) => ts(e, xj, Iv),
  Sj = (e) => ts(e, "position", Iv),
  jj = new Set(["image", "url"]),
  bj = (e) => ts(e, jj, kj),
  Nj = (e) => ts(e, "", Ej),
  ys = () => !0,
  ts = (e, t, n) => {
    const r = Av.exec(e);
    return r
      ? r[1]
        ? typeof t == "string"
          ? r[1] === t
          : t.has(r[1])
        : n(r[2])
      : !1;
  },
  Cj = (e) => hj.test(e) && !mj.test(e),
  Iv = () => !1,
  Ej = (e) => gj.test(e),
  kj = (e) => vj.test(e),
  Pj = () => {
    const e = we("colors"),
      t = we("spacing"),
      n = we("blur"),
      r = we("brightness"),
      o = we("borderColor"),
      s = we("borderRadius"),
      a = we("borderSpacing"),
      l = we("borderWidth"),
      c = we("contrast"),
      u = we("grayscale"),
      d = we("hueRotate"),
      p = we("invert"),
      m = we("gap"),
      g = we("gradientColorStops"),
      S = we("gradientColorStopPositions"),
      h = we("inset"),
      w = we("margin"),
      y = we("opacity"),
      v = we("padding"),
      x = we("saturate"),
      j = we("scale"),
      b = we("sepia"),
      N = we("skew"),
      C = we("space"),
      T = we("translate"),
      I = () => ["auto", "contain", "none"],
      O = () => ["auto", "hidden", "clip", "visible", "scroll"],
      $ = () => ["auto", Z, t],
      _ = () => [Z, t],
      V = () => ["", fn, Mn],
      M = () => ["auto", No, Z],
      H = () => [
        "bottom",
        "center",
        "left",
        "left-bottom",
        "left-top",
        "right",
        "right-bottom",
        "right-top",
        "top",
      ],
      z = () => ["solid", "dashed", "dotted", "double", "none"],
      B = () => [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "darken",
        "lighten",
        "color-dodge",
        "color-burn",
        "hard-light",
        "soft-light",
        "difference",
        "exclusion",
        "hue",
        "saturation",
        "color",
        "luminosity",
      ],
      E = () => [
        "start",
        "end",
        "center",
        "between",
        "around",
        "evenly",
        "stretch",
      ],
      P = () => ["", "0", Z],
      D = () => [
        "auto",
        "avoid",
        "all",
        "avoid-page",
        "page",
        "left",
        "right",
        "column",
      ],
      W = () => [No, Z];
    return {
      cacheSize: 500,
      separator: ":",
      theme: {
        colors: [ys],
        spacing: [fn, Mn],
        blur: ["none", "", _n, Z],
        brightness: W(),
        borderColor: [e],
        borderRadius: ["none", "", "full", _n, Z],
        borderSpacing: _(),
        borderWidth: V(),
        contrast: W(),
        grayscale: P(),
        hueRotate: W(),
        invert: P(),
        gap: _(),
        gradientColorStops: [e],
        gradientColorStopPositions: [yj, Mn],
        inset: $(),
        margin: $(),
        opacity: W(),
        padding: _(),
        saturate: W(),
        scale: W(),
        sepia: P(),
        skew: W(),
        space: _(),
        translate: _(),
      },
      classGroups: {
        aspect: [{ aspect: ["auto", "square", "video", Z] }],
        container: ["container"],
        columns: [{ columns: [_n] }],
        "break-after": [{ "break-after": D() }],
        "break-before": [{ "break-before": D() }],
        "break-inside": [
          { "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] },
        ],
        "box-decoration": [{ "box-decoration": ["slice", "clone"] }],
        box: [{ box: ["border", "content"] }],
        display: [
          "block",
          "inline-block",
          "inline",
          "flex",
          "inline-flex",
          "table",
          "inline-table",
          "table-caption",
          "table-cell",
          "table-column",
          "table-column-group",
          "table-footer-group",
          "table-header-group",
          "table-row-group",
          "table-row",
          "flow-root",
          "grid",
          "inline-grid",
          "contents",
          "list-item",
          "hidden",
        ],
        float: [{ float: ["right", "left", "none", "start", "end"] }],
        clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }],
        isolation: ["isolate", "isolation-auto"],
        "object-fit": [
          { object: ["contain", "cover", "fill", "none", "scale-down"] },
        ],
        "object-position": [{ object: [...H(), Z] }],
        overflow: [{ overflow: O() }],
        "overflow-x": [{ "overflow-x": O() }],
        "overflow-y": [{ "overflow-y": O() }],
        overscroll: [{ overscroll: I() }],
        "overscroll-x": [{ "overscroll-x": I() }],
        "overscroll-y": [{ "overscroll-y": I() }],
        position: ["static", "fixed", "absolute", "relative", "sticky"],
        inset: [{ inset: [h] }],
        "inset-x": [{ "inset-x": [h] }],
        "inset-y": [{ "inset-y": [h] }],
        start: [{ start: [h] }],
        end: [{ end: [h] }],
        top: [{ top: [h] }],
        right: [{ right: [h] }],
        bottom: [{ bottom: [h] }],
        left: [{ left: [h] }],
        visibility: ["visible", "invisible", "collapse"],
        z: [{ z: ["auto", vs, Z] }],
        basis: [{ basis: $() }],
        "flex-direction": [
          { flex: ["row", "row-reverse", "col", "col-reverse"] },
        ],
        "flex-wrap": [{ flex: ["wrap", "wrap-reverse", "nowrap"] }],
        flex: [{ flex: ["1", "auto", "initial", "none", Z] }],
        grow: [{ grow: P() }],
        shrink: [{ shrink: P() }],
        order: [{ order: ["first", "last", "none", vs, Z] }],
        "grid-cols": [{ "grid-cols": [ys] }],
        "col-start-end": [{ col: ["auto", { span: ["full", vs, Z] }, Z] }],
        "col-start": [{ "col-start": M() }],
        "col-end": [{ "col-end": M() }],
        "grid-rows": [{ "grid-rows": [ys] }],
        "row-start-end": [{ row: ["auto", { span: [vs, Z] }, Z] }],
        "row-start": [{ "row-start": M() }],
        "row-end": [{ "row-end": M() }],
        "grid-flow": [
          { "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] },
        ],
        "auto-cols": [{ "auto-cols": ["auto", "min", "max", "fr", Z] }],
        "auto-rows": [{ "auto-rows": ["auto", "min", "max", "fr", Z] }],
        gap: [{ gap: [m] }],
        "gap-x": [{ "gap-x": [m] }],
        "gap-y": [{ "gap-y": [m] }],
        "justify-content": [{ justify: ["normal", ...E()] }],
        "justify-items": [
          { "justify-items": ["start", "end", "center", "stretch"] },
        ],
        "justify-self": [
          { "justify-self": ["auto", "start", "end", "center", "stretch"] },
        ],
        "align-content": [{ content: ["normal", ...E(), "baseline"] }],
        "align-items": [
          { items: ["start", "end", "center", "baseline", "stretch"] },
        ],
        "align-self": [
          { self: ["auto", "start", "end", "center", "stretch", "baseline"] },
        ],
        "place-content": [{ "place-content": [...E(), "baseline"] }],
        "place-items": [
          { "place-items": ["start", "end", "center", "baseline", "stretch"] },
        ],
        "place-self": [
          { "place-self": ["auto", "start", "end", "center", "stretch"] },
        ],
        p: [{ p: [v] }],
        px: [{ px: [v] }],
        py: [{ py: [v] }],
        ps: [{ ps: [v] }],
        pe: [{ pe: [v] }],
        pt: [{ pt: [v] }],
        pr: [{ pr: [v] }],
        pb: [{ pb: [v] }],
        pl: [{ pl: [v] }],
        m: [{ m: [w] }],
        mx: [{ mx: [w] }],
        my: [{ my: [w] }],
        ms: [{ ms: [w] }],
        me: [{ me: [w] }],
        mt: [{ mt: [w] }],
        mr: [{ mr: [w] }],
        mb: [{ mb: [w] }],
        ml: [{ ml: [w] }],
        "space-x": [{ "space-x": [C] }],
        "space-x-reverse": ["space-x-reverse"],
        "space-y": [{ "space-y": [C] }],
        "space-y-reverse": ["space-y-reverse"],
        w: [{ w: ["auto", "min", "max", "fit", "svw", "lvw", "dvw", Z, t] }],
        "min-w": [{ "min-w": [Z, t, "min", "max", "fit"] }],
        "max-w": [
          {
            "max-w": [
              Z,
              t,
              "none",
              "full",
              "min",
              "max",
              "fit",
              "prose",
              { screen: [_n] },
              _n,
            ],
          },
        ],
        h: [{ h: [Z, t, "auto", "min", "max", "fit", "svh", "lvh", "dvh"] }],
        "min-h": [
          { "min-h": [Z, t, "min", "max", "fit", "svh", "lvh", "dvh"] },
        ],
        "max-h": [
          { "max-h": [Z, t, "min", "max", "fit", "svh", "lvh", "dvh"] },
        ],
        size: [{ size: [Z, t, "auto", "min", "max", "fit"] }],
        "font-size": [{ text: ["base", _n, Mn] }],
        "font-smoothing": ["antialiased", "subpixel-antialiased"],
        "font-style": ["italic", "not-italic"],
        "font-weight": [
          {
            font: [
              "thin",
              "extralight",
              "light",
              "normal",
              "medium",
              "semibold",
              "bold",
              "extrabold",
              "black",
              oc,
            ],
          },
        ],
        "font-family": [{ font: [ys] }],
        "fvn-normal": ["normal-nums"],
        "fvn-ordinal": ["ordinal"],
        "fvn-slashed-zero": ["slashed-zero"],
        "fvn-figure": ["lining-nums", "oldstyle-nums"],
        "fvn-spacing": ["proportional-nums", "tabular-nums"],
        "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
        tracking: [
          {
            tracking: [
              "tighter",
              "tight",
              "normal",
              "wide",
              "wider",
              "widest",
              Z,
            ],
          },
        ],
        "line-clamp": [{ "line-clamp": ["none", No, oc] }],
        leading: [
          {
            leading: [
              "none",
              "tight",
              "snug",
              "normal",
              "relaxed",
              "loose",
              fn,
              Z,
            ],
          },
        ],
        "list-image": [{ "list-image": ["none", Z] }],
        "list-style-type": [{ list: ["none", "disc", "decimal", Z] }],
        "list-style-position": [{ list: ["inside", "outside"] }],
        "placeholder-color": [{ placeholder: [e] }],
        "placeholder-opacity": [{ "placeholder-opacity": [y] }],
        "text-alignment": [
          { text: ["left", "center", "right", "justify", "start", "end"] },
        ],
        "text-color": [{ text: [e] }],
        "text-opacity": [{ "text-opacity": [y] }],
        "text-decoration": [
          "underline",
          "overline",
          "line-through",
          "no-underline",
        ],
        "text-decoration-style": [{ decoration: [...z(), "wavy"] }],
        "text-decoration-thickness": [
          { decoration: ["auto", "from-font", fn, Mn] },
        ],
        "underline-offset": [{ "underline-offset": ["auto", fn, Z] }],
        "text-decoration-color": [{ decoration: [e] }],
        "text-transform": [
          "uppercase",
          "lowercase",
          "capitalize",
          "normal-case",
        ],
        "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
        "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }],
        indent: [{ indent: _() }],
        "vertical-align": [
          {
            align: [
              "baseline",
              "top",
              "middle",
              "bottom",
              "text-top",
              "text-bottom",
              "sub",
              "super",
              Z,
            ],
          },
        ],
        whitespace: [
          {
            whitespace: [
              "normal",
              "nowrap",
              "pre",
              "pre-line",
              "pre-wrap",
              "break-spaces",
            ],
          },
        ],
        break: [{ break: ["normal", "words", "all", "keep"] }],
        hyphens: [{ hyphens: ["none", "manual", "auto"] }],
        content: [{ content: ["none", Z] }],
        "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
        "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
        "bg-opacity": [{ "bg-opacity": [y] }],
        "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
        "bg-position": [{ bg: [...H(), Sj] }],
        "bg-repeat": [
          { bg: ["no-repeat", { repeat: ["", "x", "y", "round", "space"] }] },
        ],
        "bg-size": [{ bg: ["auto", "cover", "contain", wj] }],
        "bg-image": [
          {
            bg: [
              "none",
              { "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"] },
              bj,
            ],
          },
        ],
        "bg-color": [{ bg: [e] }],
        "gradient-from-pos": [{ from: [S] }],
        "gradient-via-pos": [{ via: [S] }],
        "gradient-to-pos": [{ to: [S] }],
        "gradient-from": [{ from: [g] }],
        "gradient-via": [{ via: [g] }],
        "gradient-to": [{ to: [g] }],
        rounded: [{ rounded: [s] }],
        "rounded-s": [{ "rounded-s": [s] }],
        "rounded-e": [{ "rounded-e": [s] }],
        "rounded-t": [{ "rounded-t": [s] }],
        "rounded-r": [{ "rounded-r": [s] }],
        "rounded-b": [{ "rounded-b": [s] }],
        "rounded-l": [{ "rounded-l": [s] }],
        "rounded-ss": [{ "rounded-ss": [s] }],
        "rounded-se": [{ "rounded-se": [s] }],
        "rounded-ee": [{ "rounded-ee": [s] }],
        "rounded-es": [{ "rounded-es": [s] }],
        "rounded-tl": [{ "rounded-tl": [s] }],
        "rounded-tr": [{ "rounded-tr": [s] }],
        "rounded-br": [{ "rounded-br": [s] }],
        "rounded-bl": [{ "rounded-bl": [s] }],
        "border-w": [{ border: [l] }],
        "border-w-x": [{ "border-x": [l] }],
        "border-w-y": [{ "border-y": [l] }],
        "border-w-s": [{ "border-s": [l] }],
        "border-w-e": [{ "border-e": [l] }],
        "border-w-t": [{ "border-t": [l] }],
        "border-w-r": [{ "border-r": [l] }],
        "border-w-b": [{ "border-b": [l] }],
        "border-w-l": [{ "border-l": [l] }],
        "border-opacity": [{ "border-opacity": [y] }],
        "border-style": [{ border: [...z(), "hidden"] }],
        "divide-x": [{ "divide-x": [l] }],
        "divide-x-reverse": ["divide-x-reverse"],
        "divide-y": [{ "divide-y": [l] }],
        "divide-y-reverse": ["divide-y-reverse"],
        "divide-opacity": [{ "divide-opacity": [y] }],
        "divide-style": [{ divide: z() }],
        "border-color": [{ border: [o] }],
        "border-color-x": [{ "border-x": [o] }],
        "border-color-y": [{ "border-y": [o] }],
        "border-color-s": [{ "border-s": [o] }],
        "border-color-e": [{ "border-e": [o] }],
        "border-color-t": [{ "border-t": [o] }],
        "border-color-r": [{ "border-r": [o] }],
        "border-color-b": [{ "border-b": [o] }],
        "border-color-l": [{ "border-l": [o] }],
        "divide-color": [{ divide: [o] }],
        "outline-style": [{ outline: ["", ...z()] }],
        "outline-offset": [{ "outline-offset": [fn, Z] }],
        "outline-w": [{ outline: [fn, Mn] }],
        "outline-color": [{ outline: [e] }],
        "ring-w": [{ ring: V() }],
        "ring-w-inset": ["ring-inset"],
        "ring-color": [{ ring: [e] }],
        "ring-opacity": [{ "ring-opacity": [y] }],
        "ring-offset-w": [{ "ring-offset": [fn, Mn] }],
        "ring-offset-color": [{ "ring-offset": [e] }],
        shadow: [{ shadow: ["", "inner", "none", _n, Nj] }],
        "shadow-color": [{ shadow: [ys] }],
        opacity: [{ opacity: [y] }],
        "mix-blend": [{ "mix-blend": [...B(), "plus-lighter", "plus-darker"] }],
        "bg-blend": [{ "bg-blend": B() }],
        filter: [{ filter: ["", "none"] }],
        blur: [{ blur: [n] }],
        brightness: [{ brightness: [r] }],
        contrast: [{ contrast: [c] }],
        "drop-shadow": [{ "drop-shadow": ["", "none", _n, Z] }],
        grayscale: [{ grayscale: [u] }],
        "hue-rotate": [{ "hue-rotate": [d] }],
        invert: [{ invert: [p] }],
        saturate: [{ saturate: [x] }],
        sepia: [{ sepia: [b] }],
        "backdrop-filter": [{ "backdrop-filter": ["", "none"] }],
        "backdrop-blur": [{ "backdrop-blur": [n] }],
        "backdrop-brightness": [{ "backdrop-brightness": [r] }],
        "backdrop-contrast": [{ "backdrop-contrast": [c] }],
        "backdrop-grayscale": [{ "backdrop-grayscale": [u] }],
        "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [d] }],
        "backdrop-invert": [{ "backdrop-invert": [p] }],
        "backdrop-opacity": [{ "backdrop-opacity": [y] }],
        "backdrop-saturate": [{ "backdrop-saturate": [x] }],
        "backdrop-sepia": [{ "backdrop-sepia": [b] }],
        "border-collapse": [{ border: ["collapse", "separate"] }],
        "border-spacing": [{ "border-spacing": [a] }],
        "border-spacing-x": [{ "border-spacing-x": [a] }],
        "border-spacing-y": [{ "border-spacing-y": [a] }],
        "table-layout": [{ table: ["auto", "fixed"] }],
        caption: [{ caption: ["top", "bottom"] }],
        transition: [
          {
            transition: [
              "none",
              "all",
              "",
              "colors",
              "opacity",
              "shadow",
              "transform",
              Z,
            ],
          },
        ],
        duration: [{ duration: W() }],
        ease: [{ ease: ["linear", "in", "out", "in-out", Z] }],
        delay: [{ delay: W() }],
        animate: [{ animate: ["none", "spin", "ping", "pulse", "bounce", Z] }],
        transform: [{ transform: ["", "gpu", "none"] }],
        scale: [{ scale: [j] }],
        "scale-x": [{ "scale-x": [j] }],
        "scale-y": [{ "scale-y": [j] }],
        rotate: [{ rotate: [vs, Z] }],
        "translate-x": [{ "translate-x": [T] }],
        "translate-y": [{ "translate-y": [T] }],
        "skew-x": [{ "skew-x": [N] }],
        "skew-y": [{ "skew-y": [N] }],
        "transform-origin": [
          {
            origin: [
              "center",
              "top",
              "top-right",
              "right",
              "bottom-right",
              "bottom",
              "bottom-left",
              "left",
              "top-left",
              Z,
            ],
          },
        ],
        accent: [{ accent: ["auto", e] }],
        appearance: [{ appearance: ["none", "auto"] }],
        cursor: [
          {
            cursor: [
              "auto",
              "default",
              "pointer",
              "wait",
              "text",
              "move",
              "help",
              "not-allowed",
              "none",
              "context-menu",
              "progress",
              "cell",
              "crosshair",
              "vertical-text",
              "alias",
              "copy",
              "no-drop",
              "grab",
              "grabbing",
              "all-scroll",
              "col-resize",
              "row-resize",
              "n-resize",
              "e-resize",
              "s-resize",
              "w-resize",
              "ne-resize",
              "nw-resize",
              "se-resize",
              "sw-resize",
              "ew-resize",
              "ns-resize",
              "nesw-resize",
              "nwse-resize",
              "zoom-in",
              "zoom-out",
              Z,
            ],
          },
        ],
        "caret-color": [{ caret: [e] }],
        "pointer-events": [{ "pointer-events": ["none", "auto"] }],
        resize: [{ resize: ["none", "y", "x", ""] }],
        "scroll-behavior": [{ scroll: ["auto", "smooth"] }],
        "scroll-m": [{ "scroll-m": _() }],
        "scroll-mx": [{ "scroll-mx": _() }],
        "scroll-my": [{ "scroll-my": _() }],
        "scroll-ms": [{ "scroll-ms": _() }],
        "scroll-me": [{ "scroll-me": _() }],
        "scroll-mt": [{ "scroll-mt": _() }],
        "scroll-mr": [{ "scroll-mr": _() }],
        "scroll-mb": [{ "scroll-mb": _() }],
        "scroll-ml": [{ "scroll-ml": _() }],
        "scroll-p": [{ "scroll-p": _() }],
        "scroll-px": [{ "scroll-px": _() }],
        "scroll-py": [{ "scroll-py": _() }],
        "scroll-ps": [{ "scroll-ps": _() }],
        "scroll-pe": [{ "scroll-pe": _() }],
        "scroll-pt": [{ "scroll-pt": _() }],
        "scroll-pr": [{ "scroll-pr": _() }],
        "scroll-pb": [{ "scroll-pb": _() }],
        "scroll-pl": [{ "scroll-pl": _() }],
        "snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
        "snap-stop": [{ snap: ["normal", "always"] }],
        "snap-type": [{ snap: ["none", "x", "y", "both"] }],
        "snap-strictness": [{ snap: ["mandatory", "proximity"] }],
        touch: [{ touch: ["auto", "none", "manipulation"] }],
        "touch-x": [{ "touch-pan": ["x", "left", "right"] }],
        "touch-y": [{ "touch-pan": ["y", "up", "down"] }],
        "touch-pz": ["touch-pinch-zoom"],
        select: [{ select: ["none", "text", "all", "auto"] }],
        "will-change": [
          { "will-change": ["auto", "scroll", "contents", "transform", Z] },
        ],
        fill: [{ fill: [e, "none"] }],
        "stroke-w": [{ stroke: [fn, Mn, oc] }],
        stroke: [{ stroke: [e, "none"] }],
        sr: ["sr-only", "not-sr-only"],
        "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }],
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: [
          "inset-x",
          "inset-y",
          "start",
          "end",
          "top",
          "right",
          "bottom",
          "left",
        ],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": [
          "fvn-ordinal",
          "fvn-slashed-zero",
          "fvn-figure",
          "fvn-spacing",
          "fvn-fraction",
        ],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: [
          "rounded-s",
          "rounded-e",
          "rounded-t",
          "rounded-r",
          "rounded-b",
          "rounded-l",
          "rounded-ss",
          "rounded-se",
          "rounded-ee",
          "rounded-es",
          "rounded-tl",
          "rounded-tr",
          "rounded-br",
          "rounded-bl",
        ],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": [
          "border-w-s",
          "border-w-e",
          "border-w-t",
          "border-w-r",
          "border-w-b",
          "border-w-l",
        ],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": [
          "border-color-s",
          "border-color-e",
          "border-color-t",
          "border-color-r",
          "border-color-b",
          "border-color-l",
        ],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        "scroll-m": [
          "scroll-mx",
          "scroll-my",
          "scroll-ms",
          "scroll-me",
          "scroll-mt",
          "scroll-mr",
          "scroll-mb",
          "scroll-ml",
        ],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": [
          "scroll-px",
          "scroll-py",
          "scroll-ps",
          "scroll-pe",
          "scroll-pt",
          "scroll-pr",
          "scroll-pb",
          "scroll-pl",
        ],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"],
      },
      conflictingClassGroupModifiers: { "font-size": ["leading"] },
    };
  },
  Tj = uj(Pj);
function X(...e) {
  return Tj(Sv(e));
}
const Rj = BS,
  Ov = f.forwardRef(({ className: e, ...t }, n) =>
    i.jsx(hv, {
      ref: n,
      className: X(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        e,
      ),
      ...t,
    }),
  );
Ov.displayName = hv.displayName;
const Aj = cl(
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
    {
      variants: {
        variant: {
          default: "border bg-background text-foreground",
          destructive:
            "destructive group border-destructive bg-destructive text-destructive-foreground",
        },
      },
      defaultVariants: { variant: "default" },
    },
  ),
  Mv = f.forwardRef(({ className: e, variant: t, ...n }, r) =>
    i.jsx(mv, { ref: r, className: X(Aj({ variant: t }), e), ...n }),
  );
Mv.displayName = mv.displayName;
const Ij = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx(yv, {
    ref: n,
    className: X(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
      e,
    ),
    ...t,
  }),
);
Ij.displayName = yv.displayName;
const _v = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx(xv, {
    ref: n,
    className: X(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      e,
    ),
    "toast-close": "",
    ...t,
    children: i.jsx(kv, { className: "h-4 w-4" }),
  }),
);
_v.displayName = xv.displayName;
const Dv = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx(gv, { ref: n, className: X("text-sm font-semibold", e), ...t }),
);
Dv.displayName = gv.displayName;
const Lv = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx(vv, { ref: n, className: X("text-sm opacity-90", e), ...t }),
);
Lv.displayName = vv.displayName;
function Oj() {
  const { toasts: e } = X1();
  return i.jsxs(Rj, {
    children: [
      e.map(function ({ id: t, title: n, description: r, action: o, ...s }) {
        return i.jsxs(
          Mv,
          {
            ...s,
            children: [
              i.jsxs("div", {
                className: "grid gap-1",
                children: [
                  n && i.jsx(Dv, { children: n }),
                  r && i.jsx(Lv, { children: r }),
                ],
              }),
              o,
              i.jsx(_v, {}),
            ],
          },
          t,
        );
      }),
      i.jsx(Ov, {}),
    ],
  });
}
var Lp = ["light", "dark"],
  Mj = "(prefers-color-scheme: dark)",
  _j = f.createContext(void 0),
  Dj = { setTheme: (e) => {}, themes: [] },
  Lj = () => {
    var e;
    return (e = f.useContext(_j)) != null ? e : Dj;
  };
f.memo(
  ({
    forcedTheme: e,
    storageKey: t,
    attribute: n,
    enableSystem: r,
    enableColorScheme: o,
    defaultTheme: s,
    value: a,
    attrs: l,
    nonce: c,
  }) => {
    let u = s === "system",
      d =
        n === "class"
          ? `var d=document.documentElement,c=d.classList;${`c.remove(${l.map((S) => `'${S}'`).join(",")})`};`
          : `var d=document.documentElement,n='${n}',s='setAttribute';`,
      p = o
        ? Lp.includes(s) && s
          ? `if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'${s}'`
          : "if(e==='light'||e==='dark')d.style.colorScheme=e"
        : "",
      m = (S, h = !1, w = !0) => {
        let y = a ? a[S] : S,
          v = h ? S + "|| ''" : `'${y}'`,
          x = "";
        return (
          o &&
            w &&
            !h &&
            Lp.includes(S) &&
            (x += `d.style.colorScheme = '${S}';`),
          n === "class"
            ? h || y
              ? (x += `c.add(${v})`)
              : (x += "null")
            : y && (x += `d[s](n,${v})`),
          x
        );
      },
      g = e
        ? `!function(){${d}${m(e)}}()`
        : r
          ? `!function(){try{${d}var e=localStorage.getItem('${t}');if('system'===e||(!e&&${u})){var t='${Mj}',m=window.matchMedia(t);if(m.media!==t||m.matches){${m("dark")}}else{${m("light")}}}else if(e){${a ? `var x=${JSON.stringify(a)};` : ""}${m(a ? "x[e]" : "e", !0)}}${u ? "" : "else{" + m(s, !1, !1) + "}"}${p}}catch(e){}}()`
          : `!function(){try{${d}var e=localStorage.getItem('${t}');if(e){${a ? `var x=${JSON.stringify(a)};` : ""}${m(a ? "x[e]" : "e", !0)}}else{${m(s, !1, !1)};}${p}}catch(t){}}();`;
    return f.createElement("script", {
      nonce: c,
      dangerouslySetInnerHTML: { __html: g },
    });
  },
);
var Fj = (e) => {
    switch (e) {
      case "success":
        return Uj;
      case "info":
        return Vj;
      case "warning":
        return Bj;
      case "error":
        return Wj;
      default:
        return null;
    }
  },
  zj = Array(12).fill(0),
  $j = ({ visible: e, className: t }) =>
    A.createElement(
      "div",
      {
        className: ["sonner-loading-wrapper", t].filter(Boolean).join(" "),
        "data-visible": e,
      },
      A.createElement(
        "div",
        { className: "sonner-spinner" },
        zj.map((n, r) =>
          A.createElement("div", {
            className: "sonner-loading-bar",
            key: `spinner-bar-${r}`,
          }),
        ),
      ),
    ),
  Uj = A.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    A.createElement("path", {
      fillRule: "evenodd",
      d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
      clipRule: "evenodd",
    }),
  ),
  Bj = A.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    A.createElement("path", {
      fillRule: "evenodd",
      d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
      clipRule: "evenodd",
    }),
  ),
  Vj = A.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    A.createElement("path", {
      fillRule: "evenodd",
      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
      clipRule: "evenodd",
    }),
  ),
  Wj = A.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    A.createElement("path", {
      fillRule: "evenodd",
      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
      clipRule: "evenodd",
    }),
  ),
  Hj = A.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    A.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
    A.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" }),
  ),
  Kj = () => {
    let [e, t] = A.useState(document.hidden);
    return (
      A.useEffect(() => {
        let n = () => {
          t(document.hidden);
        };
        return (
          document.addEventListener("visibilitychange", n),
          () => window.removeEventListener("visibilitychange", n)
        );
      }, []),
      e
    );
  },
  hu = 1,
  Qj = class {
    constructor() {
      ((this.subscribe = (e) => (
        this.subscribers.push(e),
        () => {
          let t = this.subscribers.indexOf(e);
          this.subscribers.splice(t, 1);
        }
      )),
        (this.publish = (e) => {
          this.subscribers.forEach((t) => t(e));
        }),
        (this.addToast = (e) => {
          (this.publish(e), (this.toasts = [...this.toasts, e]));
        }),
        (this.create = (e) => {
          var t;
          let { message: n, ...r } = e,
            o =
              typeof (e == null ? void 0 : e.id) == "number" ||
              ((t = e.id) == null ? void 0 : t.length) > 0
                ? e.id
                : hu++,
            s = this.toasts.find((l) => l.id === o),
            a = e.dismissible === void 0 ? !0 : e.dismissible;
          return (
            this.dismissedToasts.has(o) && this.dismissedToasts.delete(o),
            s
              ? (this.toasts = this.toasts.map((l) =>
                  l.id === o
                    ? (this.publish({ ...l, ...e, id: o, title: n }),
                      { ...l, ...e, id: o, dismissible: a, title: n })
                    : l,
                ))
              : this.addToast({ title: n, ...r, dismissible: a, id: o }),
            o
          );
        }),
        (this.dismiss = (e) => (
          this.dismissedToasts.add(e),
          e ||
            this.toasts.forEach((t) => {
              this.subscribers.forEach((n) => n({ id: t.id, dismiss: !0 }));
            }),
          this.subscribers.forEach((t) => t({ id: e, dismiss: !0 })),
          e
        )),
        (this.message = (e, t) => this.create({ ...t, message: e })),
        (this.error = (e, t) =>
          this.create({ ...t, message: e, type: "error" })),
        (this.success = (e, t) =>
          this.create({ ...t, type: "success", message: e })),
        (this.info = (e, t) => this.create({ ...t, type: "info", message: e })),
        (this.warning = (e, t) =>
          this.create({ ...t, type: "warning", message: e })),
        (this.loading = (e, t) =>
          this.create({ ...t, type: "loading", message: e })),
        (this.promise = (e, t) => {
          if (!t) return;
          let n;
          t.loading !== void 0 &&
            (n = this.create({
              ...t,
              promise: e,
              type: "loading",
              message: t.loading,
              description:
                typeof t.description != "function" ? t.description : void 0,
            }));
          let r = e instanceof Promise ? e : e(),
            o = n !== void 0,
            s,
            a = r
              .then(async (c) => {
                if (((s = ["resolve", c]), A.isValidElement(c)))
                  ((o = !1),
                    this.create({ id: n, type: "default", message: c }));
                else if (Gj(c) && !c.ok) {
                  o = !1;
                  let u =
                      typeof t.error == "function"
                        ? await t.error(`HTTP error! status: ${c.status}`)
                        : t.error,
                    d =
                      typeof t.description == "function"
                        ? await t.description(`HTTP error! status: ${c.status}`)
                        : t.description;
                  this.create({
                    id: n,
                    type: "error",
                    message: u,
                    description: d,
                  });
                } else if (t.success !== void 0) {
                  o = !1;
                  let u =
                      typeof t.success == "function"
                        ? await t.success(c)
                        : t.success,
                    d =
                      typeof t.description == "function"
                        ? await t.description(c)
                        : t.description;
                  this.create({
                    id: n,
                    type: "success",
                    message: u,
                    description: d,
                  });
                }
              })
              .catch(async (c) => {
                if (((s = ["reject", c]), t.error !== void 0)) {
                  o = !1;
                  let u =
                      typeof t.error == "function" ? await t.error(c) : t.error,
                    d =
                      typeof t.description == "function"
                        ? await t.description(c)
                        : t.description;
                  this.create({
                    id: n,
                    type: "error",
                    message: u,
                    description: d,
                  });
                }
              })
              .finally(() => {
                var c;
                (o && (this.dismiss(n), (n = void 0)),
                  (c = t.finally) == null || c.call(t));
              }),
            l = () =>
              new Promise((c, u) =>
                a.then(() => (s[0] === "reject" ? u(s[1]) : c(s[1]))).catch(u),
              );
          return typeof n != "string" && typeof n != "number"
            ? { unwrap: l }
            : Object.assign(n, { unwrap: l });
        }),
        (this.custom = (e, t) => {
          let n = (t == null ? void 0 : t.id) || hu++;
          return (this.create({ jsx: e(n), id: n, ...t }), n);
        }),
        (this.getActiveToasts = () =>
          this.toasts.filter((e) => !this.dismissedToasts.has(e.id))),
        (this.subscribers = []),
        (this.toasts = []),
        (this.dismissedToasts = new Set()));
    }
  },
  ct = new Qj(),
  qj = (e, t) => {
    let n = (t == null ? void 0 : t.id) || hu++;
    return (ct.addToast({ title: e, ...t, id: n }), n);
  },
  Gj = (e) =>
    e &&
    typeof e == "object" &&
    "ok" in e &&
    typeof e.ok == "boolean" &&
    "status" in e &&
    typeof e.status == "number",
  Yj = qj,
  Xj = () => ct.toasts,
  Jj = () => ct.getActiveToasts(),
  be = Object.assign(
    Yj,
    {
      success: ct.success,
      info: ct.info,
      warning: ct.warning,
      error: ct.error,
      custom: ct.custom,
      message: ct.message,
      promise: ct.promise,
      dismiss: ct.dismiss,
      loading: ct.loading,
    },
    { getHistory: Xj, getToasts: Jj },
  );
function Zj(e, { insertAt: t } = {}) {
  if (typeof document > "u") return;
  let n = document.head || document.getElementsByTagName("head")[0],
    r = document.createElement("style");
  ((r.type = "text/css"),
    t === "top" && n.firstChild
      ? n.insertBefore(r, n.firstChild)
      : n.appendChild(r),
    r.styleSheet
      ? (r.styleSheet.cssText = e)
      : r.appendChild(document.createTextNode(e)));
}
Zj(`:where(html[dir="ltr"]),:where([data-sonner-toaster][dir="ltr"]){--toast-icon-margin-start: -3px;--toast-icon-margin-end: 4px;--toast-svg-margin-start: -1px;--toast-svg-margin-end: 0px;--toast-button-margin-start: auto;--toast-button-margin-end: 0;--toast-close-button-start: 0;--toast-close-button-end: unset;--toast-close-button-transform: translate(-35%, -35%)}:where(html[dir="rtl"]),:where([data-sonner-toaster][dir="rtl"]){--toast-icon-margin-start: 4px;--toast-icon-margin-end: -3px;--toast-svg-margin-start: 0px;--toast-svg-margin-end: -1px;--toast-button-margin-start: 0;--toast-button-margin-end: auto;--toast-close-button-start: unset;--toast-close-button-end: 0;--toast-close-button-transform: translate(35%, -35%)}:where([data-sonner-toaster]){position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1: hsl(0, 0%, 99%);--gray2: hsl(0, 0%, 97.3%);--gray3: hsl(0, 0%, 95.1%);--gray4: hsl(0, 0%, 93%);--gray5: hsl(0, 0%, 90.9%);--gray6: hsl(0, 0%, 88.7%);--gray7: hsl(0, 0%, 85.8%);--gray8: hsl(0, 0%, 78%);--gray9: hsl(0, 0%, 56.1%);--gray10: hsl(0, 0%, 52.3%);--gray11: hsl(0, 0%, 43.5%);--gray12: hsl(0, 0%, 9%);--border-radius: 8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:none;z-index:999999999;transition:transform .4s ease}:where([data-sonner-toaster][data-lifted="true"]){transform:translateY(-10px)}@media (hover: none) and (pointer: coarse){:where([data-sonner-toaster][data-lifted="true"]){transform:none}}:where([data-sonner-toaster][data-x-position="right"]){right:var(--offset-right)}:where([data-sonner-toaster][data-x-position="left"]){left:var(--offset-left)}:where([data-sonner-toaster][data-x-position="center"]){left:50%;transform:translate(-50%)}:where([data-sonner-toaster][data-y-position="top"]){top:var(--offset-top)}:where([data-sonner-toaster][data-y-position="bottom"]){bottom:var(--offset-bottom)}:where([data-sonner-toast]){--y: translateY(100%);--lift-amount: calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);filter:blur(0);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:none;overflow-wrap:anywhere}:where([data-sonner-toast][data-styled="true"]){padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px #0000001a;width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}:where([data-sonner-toast]:focus-visible){box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast][data-y-position="top"]){top:0;--y: translateY(-100%);--lift: 1;--lift-amount: calc(1 * var(--gap))}:where([data-sonner-toast][data-y-position="bottom"]){bottom:0;--y: translateY(100%);--lift: -1;--lift-amount: calc(var(--lift) * var(--gap))}:where([data-sonner-toast]) :where([data-description]){font-weight:400;line-height:1.4;color:inherit}:where([data-sonner-toast]) :where([data-title]){font-weight:500;line-height:1.5;color:inherit}:where([data-sonner-toast]) :where([data-icon]){display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}:where([data-sonner-toast][data-promise="true"]) :where([data-icon])>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}:where([data-sonner-toast]) :where([data-icon])>*{flex-shrink:0}:where([data-sonner-toast]) :where([data-icon]) svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}:where([data-sonner-toast]) :where([data-content]){display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;cursor:pointer;outline:none;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}:where([data-sonner-toast]) :where([data-button]):focus-visible{box-shadow:0 0 0 2px #0006}:where([data-sonner-toast]) :where([data-button]):first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}:where([data-sonner-toast]) :where([data-cancel]){color:var(--normal-text);background:rgba(0,0,0,.08)}:where([data-sonner-toast][data-theme="dark"]) :where([data-cancel]){background:rgba(255,255,255,.3)}:where([data-sonner-toast]) :where([data-close-button]){position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast] [data-close-button]{background:var(--gray1)}:where([data-sonner-toast]) :where([data-close-button]):focus-visible{box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}:where([data-sonner-toast]) :where([data-disabled="true"]){cursor:not-allowed}:where([data-sonner-toast]):hover :where([data-close-button]):hover{background:var(--gray2);border-color:var(--gray5)}:where([data-sonner-toast][data-swiping="true"]):before{content:"";position:absolute;left:-50%;right:-50%;height:100%;z-index:-1}:where([data-sonner-toast][data-y-position="top"][data-swiping="true"]):before{bottom:50%;transform:scaleY(3) translateY(50%)}:where([data-sonner-toast][data-y-position="bottom"][data-swiping="true"]):before{top:50%;transform:scaleY(3) translateY(-50%)}:where([data-sonner-toast][data-swiping="false"][data-removed="true"]):before{content:"";position:absolute;inset:0;transform:scaleY(2)}:where([data-sonner-toast]):after{content:"";position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}:where([data-sonner-toast][data-mounted="true"]){--y: translateY(0);opacity:1}:where([data-sonner-toast][data-expanded="false"][data-front="false"]){--scale: var(--toasts-before) * .05 + 1;--y: translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}:where([data-sonner-toast])>*{transition:opacity .4s}:where([data-sonner-toast][data-expanded="false"][data-front="false"][data-styled="true"])>*{opacity:0}:where([data-sonner-toast][data-visible="false"]){opacity:0;pointer-events:none}:where([data-sonner-toast][data-mounted="true"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}:where([data-sonner-toast][data-removed="true"][data-front="true"][data-swipe-out="false"]){--y: translateY(calc(var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="true"]){--y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}:where([data-sonner-toast][data-removed="true"][data-front="false"][data-swipe-out="false"][data-expanded="false"]){--y: translateY(40%);opacity:0;transition:transform .5s,opacity .2s}:where([data-sonner-toast][data-removed="true"][data-front="false"]):before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y, 0px)) translate(var(--swipe-amount-x, 0px));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{0%{transform:var(--y) translate(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translate(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{0%{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width: 600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-theme=light]{--normal-bg: #fff;--normal-border: var(--gray4);--normal-text: var(--gray12);--success-bg: hsl(143, 85%, 96%);--success-border: hsl(145, 92%, 91%);--success-text: hsl(140, 100%, 27%);--info-bg: hsl(208, 100%, 97%);--info-border: hsl(221, 91%, 91%);--info-text: hsl(210, 92%, 45%);--warning-bg: hsl(49, 100%, 97%);--warning-border: hsl(49, 91%, 91%);--warning-text: hsl(31, 92%, 45%);--error-bg: hsl(359, 100%, 97%);--error-border: hsl(359, 100%, 94%);--error-text: hsl(360, 100%, 45%)}[data-sonner-toaster][data-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg: #000;--normal-border: hsl(0, 0%, 20%);--normal-text: var(--gray1)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg: #fff;--normal-border: var(--gray3);--normal-text: var(--gray12)}[data-sonner-toaster][data-theme=dark]{--normal-bg: #000;--normal-bg-hover: hsl(0, 0%, 12%);--normal-border: hsl(0, 0%, 20%);--normal-border-hover: hsl(0, 0%, 25%);--normal-text: var(--gray1);--success-bg: hsl(150, 100%, 6%);--success-border: hsl(147, 100%, 12%);--success-text: hsl(150, 86%, 65%);--info-bg: hsl(215, 100%, 6%);--info-border: hsl(223, 100%, 12%);--info-text: hsl(216, 87%, 65%);--warning-bg: hsl(64, 100%, 6%);--warning-border: hsl(60, 100%, 12%);--warning-text: hsl(46, 87%, 65%);--error-bg: hsl(358, 76%, 10%);--error-border: hsl(357, 89%, 16%);--error-text: hsl(358, 100%, 81%)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success],[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info],[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning],[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error],[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size: 16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:nth-child(1){animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}to{opacity:.15}}@media (prefers-reduced-motion){[data-sonner-toast],[data-sonner-toast]>*,.sonner-loading-bar{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}
`);
function Fi(e) {
  return e.label !== void 0;
}
var eb = 3,
  tb = "32px",
  nb = "16px",
  Fp = 4e3,
  rb = 356,
  ob = 14,
  sb = 20,
  ib = 200;
function Ft(...e) {
  return e.filter(Boolean).join(" ");
}
function ab(e) {
  let [t, n] = e.split("-"),
    r = [];
  return (t && r.push(t), n && r.push(n), r);
}
var lb = (e) => {
  var t, n, r, o, s, a, l, c, u, d, p;
  let {
      invert: m,
      toast: g,
      unstyled: S,
      interacting: h,
      setHeights: w,
      visibleToasts: y,
      heights: v,
      index: x,
      toasts: j,
      expanded: b,
      removeToast: N,
      defaultRichColors: C,
      closeButton: T,
      style: I,
      cancelButtonStyle: O,
      actionButtonStyle: $,
      className: _ = "",
      descriptionClassName: V = "",
      duration: M,
      position: H,
      gap: z,
      loadingIcon: B,
      expandByDefault: E,
      classNames: P,
      icons: D,
      closeButtonAriaLabel: W = "Close toast",
      pauseWhenPageIsHidden: U,
    } = e,
    [J, Q] = A.useState(null),
    [xe, Ae] = A.useState(null),
    [L, pe] = A.useState(!1),
    [Ie, de] = A.useState(!1),
    [oe, le] = A.useState(!1),
    [Ge, Nt] = A.useState(!1),
    [xr, Tn] = A.useState(!1),
    [wr, as] = A.useState(0),
    [Xr, uf] = A.useState(0),
    ls = A.useRef(g.duration || M || Fp),
    df = A.useRef(null),
    Sr = A.useRef(null),
    c0 = x === 0,
    u0 = x + 1 <= y,
    Ct = g.type,
    Jr = g.dismissible !== !1,
    d0 = g.className || "",
    f0 = g.descriptionClassName || "",
    vi = A.useMemo(
      () => v.findIndex((q) => q.toastId === g.id) || 0,
      [v, g.id],
    ),
    p0 = A.useMemo(() => {
      var q;
      return (q = g.closeButton) != null ? q : T;
    }, [g.closeButton, T]),
    ff = A.useMemo(() => g.duration || M || Fp, [g.duration, M]),
    El = A.useRef(0),
    Zr = A.useRef(0),
    pf = A.useRef(0),
    eo = A.useRef(null),
    [h0, m0] = H.split("-"),
    hf = A.useMemo(
      () => v.reduce((q, me, Ce) => (Ce >= vi ? q : q + me.height), 0),
      [v, vi],
    ),
    mf = Kj(),
    g0 = g.invert || m,
    kl = Ct === "loading";
  ((Zr.current = A.useMemo(() => vi * z + hf, [vi, hf])),
    A.useEffect(() => {
      ls.current = ff;
    }, [ff]),
    A.useEffect(() => {
      pe(!0);
    }, []),
    A.useEffect(() => {
      let q = Sr.current;
      if (q) {
        let me = q.getBoundingClientRect().height;
        return (
          uf(me),
          w((Ce) => [
            { toastId: g.id, height: me, position: g.position },
            ...Ce,
          ]),
          () => w((Ce) => Ce.filter((Mt) => Mt.toastId !== g.id))
        );
      }
    }, [w, g.id]),
    A.useLayoutEffect(() => {
      if (!L) return;
      let q = Sr.current,
        me = q.style.height;
      q.style.height = "auto";
      let Ce = q.getBoundingClientRect().height;
      ((q.style.height = me),
        uf(Ce),
        w((Mt) =>
          Mt.find((_t) => _t.toastId === g.id)
            ? Mt.map((_t) => (_t.toastId === g.id ? { ..._t, height: Ce } : _t))
            : [{ toastId: g.id, height: Ce, position: g.position }, ...Mt],
        ));
    }, [L, g.title, g.description, w, g.id]));
  let Rn = A.useCallback(() => {
    (de(!0),
      as(Zr.current),
      w((q) => q.filter((me) => me.toastId !== g.id)),
      setTimeout(() => {
        N(g);
      }, ib));
  }, [g, N, w, Zr]);
  (A.useEffect(() => {
    if (
      (g.promise && Ct === "loading") ||
      g.duration === 1 / 0 ||
      g.type === "loading"
    )
      return;
    let q;
    return (
      b || h || (U && mf)
        ? (() => {
            if (pf.current < El.current) {
              let me = new Date().getTime() - El.current;
              ls.current = ls.current - me;
            }
            pf.current = new Date().getTime();
          })()
        : ls.current !== 1 / 0 &&
          ((El.current = new Date().getTime()),
          (q = setTimeout(() => {
            var me;
            ((me = g.onAutoClose) == null || me.call(g, g), Rn());
          }, ls.current))),
      () => clearTimeout(q)
    );
  }, [b, h, g, Ct, U, mf, Rn]),
    A.useEffect(() => {
      g.delete && Rn();
    }, [Rn, g.delete]));
  function v0() {
    var q, me, Ce;
    return D != null && D.loading
      ? A.createElement(
          "div",
          {
            className: Ft(
              P == null ? void 0 : P.loader,
              (q = g == null ? void 0 : g.classNames) == null
                ? void 0
                : q.loader,
              "sonner-loader",
            ),
            "data-visible": Ct === "loading",
          },
          D.loading,
        )
      : B
        ? A.createElement(
            "div",
            {
              className: Ft(
                P == null ? void 0 : P.loader,
                (me = g == null ? void 0 : g.classNames) == null
                  ? void 0
                  : me.loader,
                "sonner-loader",
              ),
              "data-visible": Ct === "loading",
            },
            B,
          )
        : A.createElement($j, {
            className: Ft(
              P == null ? void 0 : P.loader,
              (Ce = g == null ? void 0 : g.classNames) == null
                ? void 0
                : Ce.loader,
            ),
            visible: Ct === "loading",
          });
  }
  return A.createElement(
    "li",
    {
      tabIndex: 0,
      ref: Sr,
      className: Ft(
        _,
        d0,
        P == null ? void 0 : P.toast,
        (t = g == null ? void 0 : g.classNames) == null ? void 0 : t.toast,
        P == null ? void 0 : P.default,
        P == null ? void 0 : P[Ct],
        (n = g == null ? void 0 : g.classNames) == null ? void 0 : n[Ct],
      ),
      "data-sonner-toast": "",
      "data-rich-colors": (r = g.richColors) != null ? r : C,
      "data-styled": !(g.jsx || g.unstyled || S),
      "data-mounted": L,
      "data-promise": !!g.promise,
      "data-swiped": xr,
      "data-removed": Ie,
      "data-visible": u0,
      "data-y-position": h0,
      "data-x-position": m0,
      "data-index": x,
      "data-front": c0,
      "data-swiping": oe,
      "data-dismissible": Jr,
      "data-type": Ct,
      "data-invert": g0,
      "data-swipe-out": Ge,
      "data-swipe-direction": xe,
      "data-expanded": !!(b || (E && L)),
      style: {
        "--index": x,
        "--toasts-before": x,
        "--z-index": j.length - x,
        "--offset": `${Ie ? wr : Zr.current}px`,
        "--initial-height": E ? "auto" : `${Xr}px`,
        ...I,
        ...g.style,
      },
      onDragEnd: () => {
        (le(!1), Q(null), (eo.current = null));
      },
      onPointerDown: (q) => {
        kl ||
          !Jr ||
          ((df.current = new Date()),
          as(Zr.current),
          q.target.setPointerCapture(q.pointerId),
          q.target.tagName !== "BUTTON" &&
            (le(!0), (eo.current = { x: q.clientX, y: q.clientY })));
      },
      onPointerUp: () => {
        var q, me, Ce, Mt;
        if (Ge || !Jr) return;
        eo.current = null;
        let _t = Number(
            ((q = Sr.current) == null
              ? void 0
              : q.style
                  .getPropertyValue("--swipe-amount-x")
                  .replace("px", "")) || 0,
          ),
          An = Number(
            ((me = Sr.current) == null
              ? void 0
              : me.style
                  .getPropertyValue("--swipe-amount-y")
                  .replace("px", "")) || 0,
          ),
          jr =
            new Date().getTime() -
            ((Ce = df.current) == null ? void 0 : Ce.getTime()),
          Dt = J === "x" ? _t : An,
          In = Math.abs(Dt) / jr;
        if (Math.abs(Dt) >= sb || In > 0.11) {
          (as(Zr.current),
            (Mt = g.onDismiss) == null || Mt.call(g, g),
            Ae(
              J === "x" ? (_t > 0 ? "right" : "left") : An > 0 ? "down" : "up",
            ),
            Rn(),
            Nt(!0),
            Tn(!1));
          return;
        }
        (le(!1), Q(null));
      },
      onPointerMove: (q) => {
        var me, Ce, Mt, _t;
        if (
          !eo.current ||
          !Jr ||
          ((me = window.getSelection()) == null
            ? void 0
            : me.toString().length) > 0
        )
          return;
        let An = q.clientY - eo.current.y,
          jr = q.clientX - eo.current.x,
          Dt = (Ce = e.swipeDirections) != null ? Ce : ab(H);
        !J &&
          (Math.abs(jr) > 1 || Math.abs(An) > 1) &&
          Q(Math.abs(jr) > Math.abs(An) ? "x" : "y");
        let In = { x: 0, y: 0 };
        (J === "y"
          ? (Dt.includes("top") || Dt.includes("bottom")) &&
            ((Dt.includes("top") && An < 0) ||
              (Dt.includes("bottom") && An > 0)) &&
            (In.y = An)
          : J === "x" &&
            (Dt.includes("left") || Dt.includes("right")) &&
            ((Dt.includes("left") && jr < 0) ||
              (Dt.includes("right") && jr > 0)) &&
            (In.x = jr),
          (Math.abs(In.x) > 0 || Math.abs(In.y) > 0) && Tn(!0),
          (Mt = Sr.current) == null ||
            Mt.style.setProperty("--swipe-amount-x", `${In.x}px`),
          (_t = Sr.current) == null ||
            _t.style.setProperty("--swipe-amount-y", `${In.y}px`));
      },
    },
    p0 && !g.jsx
      ? A.createElement(
          "button",
          {
            "aria-label": W,
            "data-disabled": kl,
            "data-close-button": !0,
            onClick:
              kl || !Jr
                ? () => {}
                : () => {
                    var q;
                    (Rn(), (q = g.onDismiss) == null || q.call(g, g));
                  },
            className: Ft(
              P == null ? void 0 : P.closeButton,
              (o = g == null ? void 0 : g.classNames) == null
                ? void 0
                : o.closeButton,
            ),
          },
          (s = D == null ? void 0 : D.close) != null ? s : Hj,
        )
      : null,
    g.jsx || f.isValidElement(g.title)
      ? g.jsx
        ? g.jsx
        : typeof g.title == "function"
          ? g.title()
          : g.title
      : A.createElement(
          A.Fragment,
          null,
          Ct || g.icon || g.promise
            ? A.createElement(
                "div",
                {
                  "data-icon": "",
                  className: Ft(
                    P == null ? void 0 : P.icon,
                    (a = g == null ? void 0 : g.classNames) == null
                      ? void 0
                      : a.icon,
                  ),
                },
                g.promise || (g.type === "loading" && !g.icon)
                  ? g.icon || v0()
                  : null,
                g.type !== "loading"
                  ? g.icon || (D == null ? void 0 : D[Ct]) || Fj(Ct)
                  : null,
              )
            : null,
          A.createElement(
            "div",
            {
              "data-content": "",
              className: Ft(
                P == null ? void 0 : P.content,
                (l = g == null ? void 0 : g.classNames) == null
                  ? void 0
                  : l.content,
              ),
            },
            A.createElement(
              "div",
              {
                "data-title": "",
                className: Ft(
                  P == null ? void 0 : P.title,
                  (c = g == null ? void 0 : g.classNames) == null
                    ? void 0
                    : c.title,
                ),
              },
              typeof g.title == "function" ? g.title() : g.title,
            ),
            g.description
              ? A.createElement(
                  "div",
                  {
                    "data-description": "",
                    className: Ft(
                      V,
                      f0,
                      P == null ? void 0 : P.description,
                      (u = g == null ? void 0 : g.classNames) == null
                        ? void 0
                        : u.description,
                    ),
                  },
                  typeof g.description == "function"
                    ? g.description()
                    : g.description,
                )
              : null,
          ),
          f.isValidElement(g.cancel)
            ? g.cancel
            : g.cancel && Fi(g.cancel)
              ? A.createElement(
                  "button",
                  {
                    "data-button": !0,
                    "data-cancel": !0,
                    style: g.cancelButtonStyle || O,
                    onClick: (q) => {
                      var me, Ce;
                      Fi(g.cancel) &&
                        Jr &&
                        ((Ce = (me = g.cancel).onClick) == null ||
                          Ce.call(me, q),
                        Rn());
                    },
                    className: Ft(
                      P == null ? void 0 : P.cancelButton,
                      (d = g == null ? void 0 : g.classNames) == null
                        ? void 0
                        : d.cancelButton,
                    ),
                  },
                  g.cancel.label,
                )
              : null,
          f.isValidElement(g.action)
            ? g.action
            : g.action && Fi(g.action)
              ? A.createElement(
                  "button",
                  {
                    "data-button": !0,
                    "data-action": !0,
                    style: g.actionButtonStyle || $,
                    onClick: (q) => {
                      var me, Ce;
                      Fi(g.action) &&
                        ((Ce = (me = g.action).onClick) == null ||
                          Ce.call(me, q),
                        !q.defaultPrevented && Rn());
                    },
                    className: Ft(
                      P == null ? void 0 : P.actionButton,
                      (p = g == null ? void 0 : g.classNames) == null
                        ? void 0
                        : p.actionButton,
                    ),
                  },
                  g.action.label,
                )
              : null,
        ),
  );
};
function zp() {
  if (typeof window > "u" || typeof document > "u") return "ltr";
  let e = document.documentElement.getAttribute("dir");
  return e === "auto" || !e
    ? window.getComputedStyle(document.documentElement).direction
    : e;
}
function cb(e, t) {
  let n = {};
  return (
    [e, t].forEach((r, o) => {
      let s = o === 1,
        a = s ? "--mobile-offset" : "--offset",
        l = s ? nb : tb;
      function c(u) {
        ["top", "right", "bottom", "left"].forEach((d) => {
          n[`${a}-${d}`] = typeof u == "number" ? `${u}px` : u;
        });
      }
      typeof r == "number" || typeof r == "string"
        ? c(r)
        : typeof r == "object"
          ? ["top", "right", "bottom", "left"].forEach((u) => {
              r[u] === void 0
                ? (n[`${a}-${u}`] = l)
                : (n[`${a}-${u}`] =
                    typeof r[u] == "number" ? `${r[u]}px` : r[u]);
            })
          : c(l);
    }),
    n
  );
}
var ub = f.forwardRef(function (e, t) {
  let {
      invert: n,
      position: r = "bottom-right",
      hotkey: o = ["altKey", "KeyT"],
      expand: s,
      closeButton: a,
      className: l,
      offset: c,
      mobileOffset: u,
      theme: d = "light",
      richColors: p,
      duration: m,
      style: g,
      visibleToasts: S = eb,
      toastOptions: h,
      dir: w = zp(),
      gap: y = ob,
      loadingIcon: v,
      icons: x,
      containerAriaLabel: j = "Notifications",
      pauseWhenPageIsHidden: b,
    } = e,
    [N, C] = A.useState([]),
    T = A.useMemo(
      () =>
        Array.from(
          new Set(
            [r].concat(N.filter((U) => U.position).map((U) => U.position)),
          ),
        ),
      [N, r],
    ),
    [I, O] = A.useState([]),
    [$, _] = A.useState(!1),
    [V, M] = A.useState(!1),
    [H, z] = A.useState(
      d !== "system"
        ? d
        : typeof window < "u" &&
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
    ),
    B = A.useRef(null),
    E = o.join("+").replace(/Key/g, "").replace(/Digit/g, ""),
    P = A.useRef(null),
    D = A.useRef(!1),
    W = A.useCallback((U) => {
      C((J) => {
        var Q;
        return (
          ((Q = J.find((xe) => xe.id === U.id)) != null && Q.delete) ||
            ct.dismiss(U.id),
          J.filter(({ id: xe }) => xe !== U.id)
        );
      });
    }, []);
  return (
    A.useEffect(
      () =>
        ct.subscribe((U) => {
          if (U.dismiss) {
            C((J) => J.map((Q) => (Q.id === U.id ? { ...Q, delete: !0 } : Q)));
            return;
          }
          setTimeout(() => {
            Hg.flushSync(() => {
              C((J) => {
                let Q = J.findIndex((xe) => xe.id === U.id);
                return Q !== -1
                  ? [...J.slice(0, Q), { ...J[Q], ...U }, ...J.slice(Q + 1)]
                  : [U, ...J];
              });
            });
          });
        }),
      [],
    ),
    A.useEffect(() => {
      if (d !== "system") {
        z(d);
        return;
      }
      if (
        (d === "system" &&
          (window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? z("dark")
            : z("light")),
        typeof window > "u")
      )
        return;
      let U = window.matchMedia("(prefers-color-scheme: dark)");
      try {
        U.addEventListener("change", ({ matches: J }) => {
          z(J ? "dark" : "light");
        });
      } catch {
        U.addListener(({ matches: Q }) => {
          try {
            z(Q ? "dark" : "light");
          } catch (xe) {
            console.error(xe);
          }
        });
      }
    }, [d]),
    A.useEffect(() => {
      N.length <= 1 && _(!1);
    }, [N]),
    A.useEffect(() => {
      let U = (J) => {
        var Q, xe;
        (o.every((Ae) => J[Ae] || J.code === Ae) &&
          (_(!0), (Q = B.current) == null || Q.focus()),
          J.code === "Escape" &&
            (document.activeElement === B.current ||
              ((xe = B.current) != null &&
                xe.contains(document.activeElement))) &&
            _(!1));
      };
      return (
        document.addEventListener("keydown", U),
        () => document.removeEventListener("keydown", U)
      );
    }, [o]),
    A.useEffect(() => {
      if (B.current)
        return () => {
          P.current &&
            (P.current.focus({ preventScroll: !0 }),
            (P.current = null),
            (D.current = !1));
        };
    }, [B.current]),
    A.createElement(
      "section",
      {
        ref: t,
        "aria-label": `${j} ${E}`,
        tabIndex: -1,
        "aria-live": "polite",
        "aria-relevant": "additions text",
        "aria-atomic": "false",
        suppressHydrationWarning: !0,
      },
      T.map((U, J) => {
        var Q;
        let [xe, Ae] = U.split("-");
        return N.length
          ? A.createElement(
              "ol",
              {
                key: U,
                dir: w === "auto" ? zp() : w,
                tabIndex: -1,
                ref: B,
                className: l,
                "data-sonner-toaster": !0,
                "data-theme": H,
                "data-y-position": xe,
                "data-lifted": $ && N.length > 1 && !s,
                "data-x-position": Ae,
                style: {
                  "--front-toast-height": `${((Q = I[0]) == null ? void 0 : Q.height) || 0}px`,
                  "--width": `${rb}px`,
                  "--gap": `${y}px`,
                  ...g,
                  ...cb(c, u),
                },
                onBlur: (L) => {
                  D.current &&
                    !L.currentTarget.contains(L.relatedTarget) &&
                    ((D.current = !1),
                    P.current &&
                      (P.current.focus({ preventScroll: !0 }),
                      (P.current = null)));
                },
                onFocus: (L) => {
                  (L.target instanceof HTMLElement &&
                    L.target.dataset.dismissible === "false") ||
                    D.current ||
                    ((D.current = !0), (P.current = L.relatedTarget));
                },
                onMouseEnter: () => _(!0),
                onMouseMove: () => _(!0),
                onMouseLeave: () => {
                  V || _(!1);
                },
                onDragEnd: () => _(!1),
                onPointerDown: (L) => {
                  (L.target instanceof HTMLElement &&
                    L.target.dataset.dismissible === "false") ||
                    M(!0);
                },
                onPointerUp: () => M(!1),
              },
              N.filter((L) => (!L.position && J === 0) || L.position === U).map(
                (L, pe) => {
                  var Ie, de;
                  return A.createElement(lb, {
                    key: L.id,
                    icons: x,
                    index: pe,
                    toast: L,
                    defaultRichColors: p,
                    duration:
                      (Ie = h == null ? void 0 : h.duration) != null ? Ie : m,
                    className: h == null ? void 0 : h.className,
                    descriptionClassName:
                      h == null ? void 0 : h.descriptionClassName,
                    invert: n,
                    visibleToasts: S,
                    closeButton:
                      (de = h == null ? void 0 : h.closeButton) != null
                        ? de
                        : a,
                    interacting: V,
                    position: U,
                    style: h == null ? void 0 : h.style,
                    unstyled: h == null ? void 0 : h.unstyled,
                    classNames: h == null ? void 0 : h.classNames,
                    cancelButtonStyle: h == null ? void 0 : h.cancelButtonStyle,
                    actionButtonStyle: h == null ? void 0 : h.actionButtonStyle,
                    removeToast: W,
                    toasts: N.filter((oe) => oe.position == L.position),
                    heights: I.filter((oe) => oe.position == L.position),
                    setHeights: O,
                    expandByDefault: s,
                    gap: y,
                    loadingIcon: v,
                    expanded: $,
                    pauseWhenPageIsHidden: b,
                    swipeDirections: e.swipeDirections,
                  });
                },
              ),
            )
          : null;
      }),
    )
  );
});
const db = ({ ...e }) => {
  const { theme: t = "system" } = Lj();
  return i.jsx(ub, {
    theme: t,
    className: "toaster group",
    toastOptions: {
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        description: "group-[.toast]:text-muted-foreground",
        actionButton:
          "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        cancelButton:
          "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
      },
    },
    ...e,
  });
};
var fb = Lu[" useId ".trim().toString()] || (() => {}),
  pb = 0;
function Co(e) {
  const [t, n] = f.useState(fb());
  return (
    Ue(() => {
      n((r) => r ?? String(pb++));
    }, [e]),
    t ? `radix-${t}` : ""
  );
}
const hb = ["top", "right", "bottom", "left"],
  ar = Math.min,
  vt = Math.max,
  _a = Math.round,
  zi = Math.floor,
  lr = (e) => ({ x: e, y: e }),
  mb = { left: "right", right: "left", bottom: "top", top: "bottom" },
  gb = { start: "end", end: "start" };
function mu(e, t, n) {
  return vt(e, ar(t, n));
}
function Cn(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function En(e) {
  return e.split("-")[0];
}
function ns(e) {
  return e.split("-")[1];
}
function _d(e) {
  return e === "x" ? "y" : "x";
}
function Dd(e) {
  return e === "y" ? "height" : "width";
}
function cr(e) {
  return ["top", "bottom"].includes(En(e)) ? "y" : "x";
}
function Ld(e) {
  return _d(cr(e));
}
function vb(e, t, n) {
  n === void 0 && (n = !1);
  const r = ns(e),
    o = Ld(e),
    s = Dd(o);
  let a =
    o === "x"
      ? r === (n ? "end" : "start")
        ? "right"
        : "left"
      : r === "start"
        ? "bottom"
        : "top";
  return (t.reference[s] > t.floating[s] && (a = Da(a)), [a, Da(a)]);
}
function yb(e) {
  const t = Da(e);
  return [gu(e), t, gu(t)];
}
function gu(e) {
  return e.replace(/start|end/g, (t) => gb[t]);
}
function xb(e, t, n) {
  const r = ["left", "right"],
    o = ["right", "left"],
    s = ["top", "bottom"],
    a = ["bottom", "top"];
  switch (e) {
    case "top":
    case "bottom":
      return n ? (t ? o : r) : t ? r : o;
    case "left":
    case "right":
      return t ? s : a;
    default:
      return [];
  }
}
function wb(e, t, n, r) {
  const o = ns(e);
  let s = xb(En(e), n === "start", r);
  return (
    o && ((s = s.map((a) => a + "-" + o)), t && (s = s.concat(s.map(gu)))),
    s
  );
}
function Da(e) {
  return e.replace(/left|right|bottom|top/g, (t) => mb[t]);
}
function Sb(e) {
  return { top: 0, right: 0, bottom: 0, left: 0, ...e };
}
function Fv(e) {
  return typeof e != "number"
    ? Sb(e)
    : { top: e, right: e, bottom: e, left: e };
}
function La(e) {
  const { x: t, y: n, width: r, height: o } = e;
  return {
    width: r,
    height: o,
    top: n,
    left: t,
    right: t + r,
    bottom: n + o,
    x: t,
    y: n,
  };
}
function $p(e, t, n) {
  let { reference: r, floating: o } = e;
  const s = cr(t),
    a = Ld(t),
    l = Dd(a),
    c = En(t),
    u = s === "y",
    d = r.x + r.width / 2 - o.width / 2,
    p = r.y + r.height / 2 - o.height / 2,
    m = r[l] / 2 - o[l] / 2;
  let g;
  switch (c) {
    case "top":
      g = { x: d, y: r.y - o.height };
      break;
    case "bottom":
      g = { x: d, y: r.y + r.height };
      break;
    case "right":
      g = { x: r.x + r.width, y: p };
      break;
    case "left":
      g = { x: r.x - o.width, y: p };
      break;
    default:
      g = { x: r.x, y: r.y };
  }
  switch (ns(t)) {
    case "start":
      g[a] -= m * (n && u ? -1 : 1);
      break;
    case "end":
      g[a] += m * (n && u ? -1 : 1);
      break;
  }
  return g;
}
const jb = async (e, t, n) => {
  const {
      placement: r = "bottom",
      strategy: o = "absolute",
      middleware: s = [],
      platform: a,
    } = n,
    l = s.filter(Boolean),
    c = await (a.isRTL == null ? void 0 : a.isRTL(t));
  let u = await a.getElementRects({ reference: e, floating: t, strategy: o }),
    { x: d, y: p } = $p(u, r, c),
    m = r,
    g = {},
    S = 0;
  for (let h = 0; h < l.length; h++) {
    const { name: w, fn: y } = l[h],
      {
        x: v,
        y: x,
        data: j,
        reset: b,
      } = await y({
        x: d,
        y: p,
        initialPlacement: r,
        placement: m,
        strategy: o,
        middlewareData: g,
        rects: u,
        platform: a,
        elements: { reference: e, floating: t },
      });
    ((d = v ?? d),
      (p = x ?? p),
      (g = { ...g, [w]: { ...g[w], ...j } }),
      b &&
        S <= 50 &&
        (S++,
        typeof b == "object" &&
          (b.placement && (m = b.placement),
          b.rects &&
            (u =
              b.rects === !0
                ? await a.getElementRects({
                    reference: e,
                    floating: t,
                    strategy: o,
                  })
                : b.rects),
          ({ x: d, y: p } = $p(u, m, c))),
        (h = -1)));
  }
  return { x: d, y: p, placement: m, strategy: o, middlewareData: g };
};
async function Zs(e, t) {
  var n;
  t === void 0 && (t = {});
  const { x: r, y: o, platform: s, rects: a, elements: l, strategy: c } = e,
    {
      boundary: u = "clippingAncestors",
      rootBoundary: d = "viewport",
      elementContext: p = "floating",
      altBoundary: m = !1,
      padding: g = 0,
    } = Cn(t, e),
    S = Fv(g),
    w = l[m ? (p === "floating" ? "reference" : "floating") : p],
    y = La(
      await s.getClippingRect({
        element:
          (n = await (s.isElement == null ? void 0 : s.isElement(w))) == null ||
          n
            ? w
            : w.contextElement ||
              (await (s.getDocumentElement == null
                ? void 0
                : s.getDocumentElement(l.floating))),
        boundary: u,
        rootBoundary: d,
        strategy: c,
      }),
    ),
    v =
      p === "floating"
        ? { x: r, y: o, width: a.floating.width, height: a.floating.height }
        : a.reference,
    x = await (s.getOffsetParent == null
      ? void 0
      : s.getOffsetParent(l.floating)),
    j = (await (s.isElement == null ? void 0 : s.isElement(x)))
      ? (await (s.getScale == null ? void 0 : s.getScale(x))) || { x: 1, y: 1 }
      : { x: 1, y: 1 },
    b = La(
      s.convertOffsetParentRelativeRectToViewportRelativeRect
        ? await s.convertOffsetParentRelativeRectToViewportRelativeRect({
            elements: l,
            rect: v,
            offsetParent: x,
            strategy: c,
          })
        : v,
    );
  return {
    top: (y.top - b.top + S.top) / j.y,
    bottom: (b.bottom - y.bottom + S.bottom) / j.y,
    left: (y.left - b.left + S.left) / j.x,
    right: (b.right - y.right + S.right) / j.x,
  };
}
const bb = (e) => ({
    name: "arrow",
    options: e,
    async fn(t) {
      const {
          x: n,
          y: r,
          placement: o,
          rects: s,
          platform: a,
          elements: l,
          middlewareData: c,
        } = t,
        { element: u, padding: d = 0 } = Cn(e, t) || {};
      if (u == null) return {};
      const p = Fv(d),
        m = { x: n, y: r },
        g = Ld(o),
        S = Dd(g),
        h = await a.getDimensions(u),
        w = g === "y",
        y = w ? "top" : "left",
        v = w ? "bottom" : "right",
        x = w ? "clientHeight" : "clientWidth",
        j = s.reference[S] + s.reference[g] - m[g] - s.floating[S],
        b = m[g] - s.reference[g],
        N = await (a.getOffsetParent == null ? void 0 : a.getOffsetParent(u));
      let C = N ? N[x] : 0;
      (!C || !(await (a.isElement == null ? void 0 : a.isElement(N)))) &&
        (C = l.floating[x] || s.floating[S]);
      const T = j / 2 - b / 2,
        I = C / 2 - h[S] / 2 - 1,
        O = ar(p[y], I),
        $ = ar(p[v], I),
        _ = O,
        V = C - h[S] - $,
        M = C / 2 - h[S] / 2 + T,
        H = mu(_, M, V),
        z =
          !c.arrow &&
          ns(o) != null &&
          M !== H &&
          s.reference[S] / 2 - (M < _ ? O : $) - h[S] / 2 < 0,
        B = z ? (M < _ ? M - _ : M - V) : 0;
      return {
        [g]: m[g] + B,
        data: {
          [g]: H,
          centerOffset: M - H - B,
          ...(z && { alignmentOffset: B }),
        },
        reset: z,
      };
    },
  }),
  Nb = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: "flip",
        options: e,
        async fn(t) {
          var n, r;
          const {
              placement: o,
              middlewareData: s,
              rects: a,
              initialPlacement: l,
              platform: c,
              elements: u,
            } = t,
            {
              mainAxis: d = !0,
              crossAxis: p = !0,
              fallbackPlacements: m,
              fallbackStrategy: g = "bestFit",
              fallbackAxisSideDirection: S = "none",
              flipAlignment: h = !0,
              ...w
            } = Cn(e, t);
          if ((n = s.arrow) != null && n.alignmentOffset) return {};
          const y = En(o),
            v = cr(l),
            x = En(l) === l,
            j = await (c.isRTL == null ? void 0 : c.isRTL(u.floating)),
            b = m || (x || !h ? [Da(l)] : yb(l)),
            N = S !== "none";
          !m && N && b.push(...wb(l, h, S, j));
          const C = [l, ...b],
            T = await Zs(t, w),
            I = [];
          let O = ((r = s.flip) == null ? void 0 : r.overflows) || [];
          if ((d && I.push(T[y]), p)) {
            const M = vb(o, a, j);
            I.push(T[M[0]], T[M[1]]);
          }
          if (
            ((O = [...O, { placement: o, overflows: I }]),
            !I.every((M) => M <= 0))
          ) {
            var $, _;
            const M = ((($ = s.flip) == null ? void 0 : $.index) || 0) + 1,
              H = C[M];
            if (H)
              return {
                data: { index: M, overflows: O },
                reset: { placement: H },
              };
            let z =
              (_ = O.filter((B) => B.overflows[0] <= 0).sort(
                (B, E) => B.overflows[1] - E.overflows[1],
              )[0]) == null
                ? void 0
                : _.placement;
            if (!z)
              switch (g) {
                case "bestFit": {
                  var V;
                  const B =
                    (V = O.filter((E) => {
                      if (N) {
                        const P = cr(E.placement);
                        return P === v || P === "y";
                      }
                      return !0;
                    })
                      .map((E) => [
                        E.placement,
                        E.overflows
                          .filter((P) => P > 0)
                          .reduce((P, D) => P + D, 0),
                      ])
                      .sort((E, P) => E[1] - P[1])[0]) == null
                      ? void 0
                      : V[0];
                  B && (z = B);
                  break;
                }
                case "initialPlacement":
                  z = l;
                  break;
              }
            if (o !== z) return { reset: { placement: z } };
          }
          return {};
        },
      }
    );
  };
function Up(e, t) {
  return {
    top: e.top - t.height,
    right: e.right - t.width,
    bottom: e.bottom - t.height,
    left: e.left - t.width,
  };
}
function Bp(e) {
  return hb.some((t) => e[t] >= 0);
}
const Cb = function (e) {
  return (
    e === void 0 && (e = {}),
    {
      name: "hide",
      options: e,
      async fn(t) {
        const { rects: n } = t,
          { strategy: r = "referenceHidden", ...o } = Cn(e, t);
        switch (r) {
          case "referenceHidden": {
            const s = await Zs(t, { ...o, elementContext: "reference" }),
              a = Up(s, n.reference);
            return {
              data: { referenceHiddenOffsets: a, referenceHidden: Bp(a) },
            };
          }
          case "escaped": {
            const s = await Zs(t, { ...o, altBoundary: !0 }),
              a = Up(s, n.floating);
            return { data: { escapedOffsets: a, escaped: Bp(a) } };
          }
          default:
            return {};
        }
      },
    }
  );
};
async function Eb(e, t) {
  const { placement: n, platform: r, elements: o } = e,
    s = await (r.isRTL == null ? void 0 : r.isRTL(o.floating)),
    a = En(n),
    l = ns(n),
    c = cr(n) === "y",
    u = ["left", "top"].includes(a) ? -1 : 1,
    d = s && c ? -1 : 1,
    p = Cn(t, e);
  let {
    mainAxis: m,
    crossAxis: g,
    alignmentAxis: S,
  } = typeof p == "number"
    ? { mainAxis: p, crossAxis: 0, alignmentAxis: null }
    : {
        mainAxis: p.mainAxis || 0,
        crossAxis: p.crossAxis || 0,
        alignmentAxis: p.alignmentAxis,
      };
  return (
    l && typeof S == "number" && (g = l === "end" ? S * -1 : S),
    c ? { x: g * d, y: m * u } : { x: m * u, y: g * d }
  );
}
const kb = function (e) {
    return (
      e === void 0 && (e = 0),
      {
        name: "offset",
        options: e,
        async fn(t) {
          var n, r;
          const { x: o, y: s, placement: a, middlewareData: l } = t,
            c = await Eb(t, e);
          return a === ((n = l.offset) == null ? void 0 : n.placement) &&
            (r = l.arrow) != null &&
            r.alignmentOffset
            ? {}
            : { x: o + c.x, y: s + c.y, data: { ...c, placement: a } };
        },
      }
    );
  },
  Pb = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: "shift",
        options: e,
        async fn(t) {
          const { x: n, y: r, placement: o } = t,
            {
              mainAxis: s = !0,
              crossAxis: a = !1,
              limiter: l = {
                fn: (w) => {
                  let { x: y, y: v } = w;
                  return { x: y, y: v };
                },
              },
              ...c
            } = Cn(e, t),
            u = { x: n, y: r },
            d = await Zs(t, c),
            p = cr(En(o)),
            m = _d(p);
          let g = u[m],
            S = u[p];
          if (s) {
            const w = m === "y" ? "top" : "left",
              y = m === "y" ? "bottom" : "right",
              v = g + d[w],
              x = g - d[y];
            g = mu(v, g, x);
          }
          if (a) {
            const w = p === "y" ? "top" : "left",
              y = p === "y" ? "bottom" : "right",
              v = S + d[w],
              x = S - d[y];
            S = mu(v, S, x);
          }
          const h = l.fn({ ...t, [m]: g, [p]: S });
          return {
            ...h,
            data: { x: h.x - n, y: h.y - r, enabled: { [m]: s, [p]: a } },
          };
        },
      }
    );
  },
  Tb = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        options: e,
        fn(t) {
          const { x: n, y: r, placement: o, rects: s, middlewareData: a } = t,
            { offset: l = 0, mainAxis: c = !0, crossAxis: u = !0 } = Cn(e, t),
            d = { x: n, y: r },
            p = cr(o),
            m = _d(p);
          let g = d[m],
            S = d[p];
          const h = Cn(l, t),
            w =
              typeof h == "number"
                ? { mainAxis: h, crossAxis: 0 }
                : { mainAxis: 0, crossAxis: 0, ...h };
          if (c) {
            const x = m === "y" ? "height" : "width",
              j = s.reference[m] - s.floating[x] + w.mainAxis,
              b = s.reference[m] + s.reference[x] - w.mainAxis;
            g < j ? (g = j) : g > b && (g = b);
          }
          if (u) {
            var y, v;
            const x = m === "y" ? "width" : "height",
              j = ["top", "left"].includes(En(o)),
              b =
                s.reference[p] -
                s.floating[x] +
                ((j && ((y = a.offset) == null ? void 0 : y[p])) || 0) +
                (j ? 0 : w.crossAxis),
              N =
                s.reference[p] +
                s.reference[x] +
                (j ? 0 : ((v = a.offset) == null ? void 0 : v[p]) || 0) -
                (j ? w.crossAxis : 0);
            S < b ? (S = b) : S > N && (S = N);
          }
          return { [m]: g, [p]: S };
        },
      }
    );
  },
  Rb = function (e) {
    return (
      e === void 0 && (e = {}),
      {
        name: "size",
        options: e,
        async fn(t) {
          var n, r;
          const { placement: o, rects: s, platform: a, elements: l } = t,
            { apply: c = () => {}, ...u } = Cn(e, t),
            d = await Zs(t, u),
            p = En(o),
            m = ns(o),
            g = cr(o) === "y",
            { width: S, height: h } = s.floating;
          let w, y;
          p === "top" || p === "bottom"
            ? ((w = p),
              (y =
                m ===
                ((await (a.isRTL == null ? void 0 : a.isRTL(l.floating)))
                  ? "start"
                  : "end")
                  ? "left"
                  : "right"))
            : ((y = p), (w = m === "end" ? "top" : "bottom"));
          const v = h - d.top - d.bottom,
            x = S - d.left - d.right,
            j = ar(h - d[w], v),
            b = ar(S - d[y], x),
            N = !t.middlewareData.shift;
          let C = j,
            T = b;
          if (
            ((n = t.middlewareData.shift) != null && n.enabled.x && (T = x),
            (r = t.middlewareData.shift) != null && r.enabled.y && (C = v),
            N && !m)
          ) {
            const O = vt(d.left, 0),
              $ = vt(d.right, 0),
              _ = vt(d.top, 0),
              V = vt(d.bottom, 0);
            g
              ? (T = S - 2 * (O !== 0 || $ !== 0 ? O + $ : vt(d.left, d.right)))
              : (C =
                  h - 2 * (_ !== 0 || V !== 0 ? _ + V : vt(d.top, d.bottom)));
          }
          await c({ ...t, availableWidth: T, availableHeight: C });
          const I = await a.getDimensions(l.floating);
          return S !== I.width || h !== I.height
            ? { reset: { rects: !0 } }
            : {};
        },
      }
    );
  };
function dl() {
  return typeof window < "u";
}
function rs(e) {
  return zv(e) ? (e.nodeName || "").toLowerCase() : "#document";
}
function wt(e) {
  var t;
  return (
    (e == null || (t = e.ownerDocument) == null ? void 0 : t.defaultView) ||
    window
  );
}
function dn(e) {
  var t;
  return (t = (zv(e) ? e.ownerDocument : e.document) || window.document) == null
    ? void 0
    : t.documentElement;
}
function zv(e) {
  return dl() ? e instanceof Node || e instanceof wt(e).Node : !1;
}
function Yt(e) {
  return dl() ? e instanceof Element || e instanceof wt(e).Element : !1;
}
function un(e) {
  return dl() ? e instanceof HTMLElement || e instanceof wt(e).HTMLElement : !1;
}
function Vp(e) {
  return !dl() || typeof ShadowRoot > "u"
    ? !1
    : e instanceof ShadowRoot || e instanceof wt(e).ShadowRoot;
}
function gi(e) {
  const { overflow: t, overflowX: n, overflowY: r, display: o } = Xt(e);
  return (
    /auto|scroll|overlay|hidden|clip/.test(t + r + n) &&
    !["inline", "contents"].includes(o)
  );
}
function Ab(e) {
  return ["table", "td", "th"].includes(rs(e));
}
function fl(e) {
  return [":popover-open", ":modal"].some((t) => {
    try {
      return e.matches(t);
    } catch {
      return !1;
    }
  });
}
function Fd(e) {
  const t = zd(),
    n = Yt(e) ? Xt(e) : e;
  return (
    n.transform !== "none" ||
    n.perspective !== "none" ||
    (n.containerType ? n.containerType !== "normal" : !1) ||
    (!t && (n.backdropFilter ? n.backdropFilter !== "none" : !1)) ||
    (!t && (n.filter ? n.filter !== "none" : !1)) ||
    ["transform", "perspective", "filter"].some((r) =>
      (n.willChange || "").includes(r),
    ) ||
    ["paint", "layout", "strict", "content"].some((r) =>
      (n.contain || "").includes(r),
    )
  );
}
function Ib(e) {
  let t = ur(e);
  for (; un(t) && !Ho(t);) {
    if (Fd(t)) return t;
    if (fl(t)) return null;
    t = ur(t);
  }
  return null;
}
function zd() {
  return typeof CSS > "u" || !CSS.supports
    ? !1
    : CSS.supports("-webkit-backdrop-filter", "none");
}
function Ho(e) {
  return ["html", "body", "#document"].includes(rs(e));
}
function Xt(e) {
  return wt(e).getComputedStyle(e);
}
function pl(e) {
  return Yt(e)
    ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
    : { scrollLeft: e.scrollX, scrollTop: e.scrollY };
}
function ur(e) {
  if (rs(e) === "html") return e;
  const t = e.assignedSlot || e.parentNode || (Vp(e) && e.host) || dn(e);
  return Vp(t) ? t.host : t;
}
function $v(e) {
  const t = ur(e);
  return Ho(t)
    ? e.ownerDocument
      ? e.ownerDocument.body
      : e.body
    : un(t) && gi(t)
      ? t
      : $v(t);
}
function ei(e, t, n) {
  var r;
  (t === void 0 && (t = []), n === void 0 && (n = !0));
  const o = $v(e),
    s = o === ((r = e.ownerDocument) == null ? void 0 : r.body),
    a = wt(o);
  if (s) {
    const l = vu(a);
    return t.concat(
      a,
      a.visualViewport || [],
      gi(o) ? o : [],
      l && n ? ei(l) : [],
    );
  }
  return t.concat(o, ei(o, [], n));
}
function vu(e) {
  return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
}
function Uv(e) {
  const t = Xt(e);
  let n = parseFloat(t.width) || 0,
    r = parseFloat(t.height) || 0;
  const o = un(e),
    s = o ? e.offsetWidth : n,
    a = o ? e.offsetHeight : r,
    l = _a(n) !== s || _a(r) !== a;
  return (l && ((n = s), (r = a)), { width: n, height: r, $: l });
}
function $d(e) {
  return Yt(e) ? e : e.contextElement;
}
function Eo(e) {
  const t = $d(e);
  if (!un(t)) return lr(1);
  const n = t.getBoundingClientRect(),
    { width: r, height: o, $: s } = Uv(t);
  let a = (s ? _a(n.width) : n.width) / r,
    l = (s ? _a(n.height) : n.height) / o;
  return (
    (!a || !Number.isFinite(a)) && (a = 1),
    (!l || !Number.isFinite(l)) && (l = 1),
    { x: a, y: l }
  );
}
const Ob = lr(0);
function Bv(e) {
  const t = wt(e);
  return !zd() || !t.visualViewport
    ? Ob
    : { x: t.visualViewport.offsetLeft, y: t.visualViewport.offsetTop };
}
function Mb(e, t, n) {
  return (t === void 0 && (t = !1), !n || (t && n !== wt(e)) ? !1 : t);
}
function Br(e, t, n, r) {
  (t === void 0 && (t = !1), n === void 0 && (n = !1));
  const o = e.getBoundingClientRect(),
    s = $d(e);
  let a = lr(1);
  t && (r ? Yt(r) && (a = Eo(r)) : (a = Eo(e)));
  const l = Mb(s, n, r) ? Bv(s) : lr(0);
  let c = (o.left + l.x) / a.x,
    u = (o.top + l.y) / a.y,
    d = o.width / a.x,
    p = o.height / a.y;
  if (s) {
    const m = wt(s),
      g = r && Yt(r) ? wt(r) : r;
    let S = m,
      h = vu(S);
    for (; h && r && g !== S;) {
      const w = Eo(h),
        y = h.getBoundingClientRect(),
        v = Xt(h),
        x = y.left + (h.clientLeft + parseFloat(v.paddingLeft)) * w.x,
        j = y.top + (h.clientTop + parseFloat(v.paddingTop)) * w.y;
      ((c *= w.x),
        (u *= w.y),
        (d *= w.x),
        (p *= w.y),
        (c += x),
        (u += j),
        (S = wt(h)),
        (h = vu(S)));
    }
  }
  return La({ width: d, height: p, x: c, y: u });
}
function _b(e) {
  let { elements: t, rect: n, offsetParent: r, strategy: o } = e;
  const s = o === "fixed",
    a = dn(r),
    l = t ? fl(t.floating) : !1;
  if (r === a || (l && s)) return n;
  let c = { scrollLeft: 0, scrollTop: 0 },
    u = lr(1);
  const d = lr(0),
    p = un(r);
  if (
    (p || (!p && !s)) &&
    ((rs(r) !== "body" || gi(a)) && (c = pl(r)), un(r))
  ) {
    const m = Br(r);
    ((u = Eo(r)), (d.x = m.x + r.clientLeft), (d.y = m.y + r.clientTop));
  }
  return {
    width: n.width * u.x,
    height: n.height * u.y,
    x: n.x * u.x - c.scrollLeft * u.x + d.x,
    y: n.y * u.y - c.scrollTop * u.y + d.y,
  };
}
function Db(e) {
  return Array.from(e.getClientRects());
}
function yu(e, t) {
  const n = pl(e).scrollLeft;
  return t ? t.left + n : Br(dn(e)).left + n;
}
function Lb(e) {
  const t = dn(e),
    n = pl(e),
    r = e.ownerDocument.body,
    o = vt(t.scrollWidth, t.clientWidth, r.scrollWidth, r.clientWidth),
    s = vt(t.scrollHeight, t.clientHeight, r.scrollHeight, r.clientHeight);
  let a = -n.scrollLeft + yu(e);
  const l = -n.scrollTop;
  return (
    Xt(r).direction === "rtl" && (a += vt(t.clientWidth, r.clientWidth) - o),
    { width: o, height: s, x: a, y: l }
  );
}
function Fb(e, t) {
  const n = wt(e),
    r = dn(e),
    o = n.visualViewport;
  let s = r.clientWidth,
    a = r.clientHeight,
    l = 0,
    c = 0;
  if (o) {
    ((s = o.width), (a = o.height));
    const u = zd();
    (!u || (u && t === "fixed")) && ((l = o.offsetLeft), (c = o.offsetTop));
  }
  return { width: s, height: a, x: l, y: c };
}
function zb(e, t) {
  const n = Br(e, !0, t === "fixed"),
    r = n.top + e.clientTop,
    o = n.left + e.clientLeft,
    s = un(e) ? Eo(e) : lr(1),
    a = e.clientWidth * s.x,
    l = e.clientHeight * s.y,
    c = o * s.x,
    u = r * s.y;
  return { width: a, height: l, x: c, y: u };
}
function Wp(e, t, n) {
  let r;
  if (t === "viewport") r = Fb(e, n);
  else if (t === "document") r = Lb(dn(e));
  else if (Yt(t)) r = zb(t, n);
  else {
    const o = Bv(e);
    r = { ...t, x: t.x - o.x, y: t.y - o.y };
  }
  return La(r);
}
function Vv(e, t) {
  const n = ur(e);
  return n === t || !Yt(n) || Ho(n)
    ? !1
    : Xt(n).position === "fixed" || Vv(n, t);
}
function $b(e, t) {
  const n = t.get(e);
  if (n) return n;
  let r = ei(e, [], !1).filter((l) => Yt(l) && rs(l) !== "body"),
    o = null;
  const s = Xt(e).position === "fixed";
  let a = s ? ur(e) : e;
  for (; Yt(a) && !Ho(a);) {
    const l = Xt(a),
      c = Fd(a);
    (!c && l.position === "fixed" && (o = null),
      (
        s
          ? !c && !o
          : (!c &&
              l.position === "static" &&
              !!o &&
              ["absolute", "fixed"].includes(o.position)) ||
            (gi(a) && !c && Vv(e, a))
      )
        ? (r = r.filter((d) => d !== a))
        : (o = l),
      (a = ur(a)));
  }
  return (t.set(e, r), r);
}
function Ub(e) {
  let { element: t, boundary: n, rootBoundary: r, strategy: o } = e;
  const a = [
      ...(n === "clippingAncestors"
        ? fl(t)
          ? []
          : $b(t, this._c)
        : [].concat(n)),
      r,
    ],
    l = a[0],
    c = a.reduce(
      (u, d) => {
        const p = Wp(t, d, o);
        return (
          (u.top = vt(p.top, u.top)),
          (u.right = ar(p.right, u.right)),
          (u.bottom = ar(p.bottom, u.bottom)),
          (u.left = vt(p.left, u.left)),
          u
        );
      },
      Wp(t, l, o),
    );
  return {
    width: c.right - c.left,
    height: c.bottom - c.top,
    x: c.left,
    y: c.top,
  };
}
function Bb(e) {
  const { width: t, height: n } = Uv(e);
  return { width: t, height: n };
}
function Vb(e, t, n) {
  const r = un(t),
    o = dn(t),
    s = n === "fixed",
    a = Br(e, !0, s, t);
  let l = { scrollLeft: 0, scrollTop: 0 };
  const c = lr(0);
  if (r || (!r && !s))
    if (((rs(t) !== "body" || gi(o)) && (l = pl(t)), r)) {
      const g = Br(t, !0, s, t);
      ((c.x = g.x + t.clientLeft), (c.y = g.y + t.clientTop));
    } else o && (c.x = yu(o));
  let u = 0,
    d = 0;
  if (o && !r && !s) {
    const g = o.getBoundingClientRect();
    ((d = g.top + l.scrollTop), (u = g.left + l.scrollLeft - yu(o, g)));
  }
  const p = a.left + l.scrollLeft - c.x - u,
    m = a.top + l.scrollTop - c.y - d;
  return { x: p, y: m, width: a.width, height: a.height };
}
function sc(e) {
  return Xt(e).position === "static";
}
function Hp(e, t) {
  if (!un(e) || Xt(e).position === "fixed") return null;
  if (t) return t(e);
  let n = e.offsetParent;
  return (dn(e) === n && (n = n.ownerDocument.body), n);
}
function Wv(e, t) {
  const n = wt(e);
  if (fl(e)) return n;
  if (!un(e)) {
    let o = ur(e);
    for (; o && !Ho(o);) {
      if (Yt(o) && !sc(o)) return o;
      o = ur(o);
    }
    return n;
  }
  let r = Hp(e, t);
  for (; r && Ab(r) && sc(r);) r = Hp(r, t);
  return r && Ho(r) && sc(r) && !Fd(r) ? n : r || Ib(e) || n;
}
const Wb = async function (e) {
  const t = this.getOffsetParent || Wv,
    n = this.getDimensions,
    r = await n(e.floating);
  return {
    reference: Vb(e.reference, await t(e.floating), e.strategy),
    floating: { x: 0, y: 0, width: r.width, height: r.height },
  };
};
function Hb(e) {
  return Xt(e).direction === "rtl";
}
const Kb = {
  convertOffsetParentRelativeRectToViewportRelativeRect: _b,
  getDocumentElement: dn,
  getClippingRect: Ub,
  getOffsetParent: Wv,
  getElementRects: Wb,
  getClientRects: Db,
  getDimensions: Bb,
  getScale: Eo,
  isElement: Yt,
  isRTL: Hb,
};
function Qb(e, t) {
  let n = null,
    r;
  const o = dn(e);
  function s() {
    var l;
    (clearTimeout(r), (l = n) == null || l.disconnect(), (n = null));
  }
  function a(l, c) {
    (l === void 0 && (l = !1), c === void 0 && (c = 1), s());
    const { left: u, top: d, width: p, height: m } = e.getBoundingClientRect();
    if ((l || t(), !p || !m)) return;
    const g = zi(d),
      S = zi(o.clientWidth - (u + p)),
      h = zi(o.clientHeight - (d + m)),
      w = zi(u),
      v = {
        rootMargin: -g + "px " + -S + "px " + -h + "px " + -w + "px",
        threshold: vt(0, ar(1, c)) || 1,
      };
    let x = !0;
    function j(b) {
      const N = b[0].intersectionRatio;
      if (N !== c) {
        if (!x) return a();
        N
          ? a(!1, N)
          : (r = setTimeout(() => {
              a(!1, 1e-7);
            }, 1e3));
      }
      x = !1;
    }
    try {
      n = new IntersectionObserver(j, { ...v, root: o.ownerDocument });
    } catch {
      n = new IntersectionObserver(j, v);
    }
    n.observe(e);
  }
  return (a(!0), s);
}
function qb(e, t, n, r) {
  r === void 0 && (r = {});
  const {
      ancestorScroll: o = !0,
      ancestorResize: s = !0,
      elementResize: a = typeof ResizeObserver == "function",
      layoutShift: l = typeof IntersectionObserver == "function",
      animationFrame: c = !1,
    } = r,
    u = $d(e),
    d = o || s ? [...(u ? ei(u) : []), ...ei(t)] : [];
  d.forEach((y) => {
    (o && y.addEventListener("scroll", n, { passive: !0 }),
      s && y.addEventListener("resize", n));
  });
  const p = u && l ? Qb(u, n) : null;
  let m = -1,
    g = null;
  a &&
    ((g = new ResizeObserver((y) => {
      let [v] = y;
      (v &&
        v.target === u &&
        g &&
        (g.unobserve(t),
        cancelAnimationFrame(m),
        (m = requestAnimationFrame(() => {
          var x;
          (x = g) == null || x.observe(t);
        }))),
        n());
    })),
    u && !c && g.observe(u),
    g.observe(t));
  let S,
    h = c ? Br(e) : null;
  c && w();
  function w() {
    const y = Br(e);
    (h &&
      (y.x !== h.x ||
        y.y !== h.y ||
        y.width !== h.width ||
        y.height !== h.height) &&
      n(),
      (h = y),
      (S = requestAnimationFrame(w)));
  }
  return (
    n(),
    () => {
      var y;
      (d.forEach((v) => {
        (o && v.removeEventListener("scroll", n),
          s && v.removeEventListener("resize", n));
      }),
        p == null || p(),
        (y = g) == null || y.disconnect(),
        (g = null),
        c && cancelAnimationFrame(S));
    }
  );
}
const Gb = kb,
  Yb = Pb,
  Xb = Nb,
  Jb = Rb,
  Zb = Cb,
  Kp = bb,
  eN = Tb,
  tN = (e, t, n) => {
    const r = new Map(),
      o = { platform: Kb, ...n },
      s = { ...o.platform, _c: r };
    return jb(e, t, { ...o, platform: s });
  };
var sa = typeof document < "u" ? f.useLayoutEffect : f.useEffect;
function Fa(e, t) {
  if (e === t) return !0;
  if (typeof e != typeof t) return !1;
  if (typeof e == "function" && e.toString() === t.toString()) return !0;
  let n, r, o;
  if (e && t && typeof e == "object") {
    if (Array.isArray(e)) {
      if (((n = e.length), n !== t.length)) return !1;
      for (r = n; r-- !== 0;) if (!Fa(e[r], t[r])) return !1;
      return !0;
    }
    if (((o = Object.keys(e)), (n = o.length), n !== Object.keys(t).length))
      return !1;
    for (r = n; r-- !== 0;) if (!{}.hasOwnProperty.call(t, o[r])) return !1;
    for (r = n; r-- !== 0;) {
      const s = o[r];
      if (!(s === "_owner" && e.$$typeof) && !Fa(e[s], t[s])) return !1;
    }
    return !0;
  }
  return e !== e && t !== t;
}
function Hv(e) {
  return typeof window > "u"
    ? 1
    : (e.ownerDocument.defaultView || window).devicePixelRatio || 1;
}
function Qp(e, t) {
  const n = Hv(e);
  return Math.round(t * n) / n;
}
function ic(e) {
  const t = f.useRef(e);
  return (
    sa(() => {
      t.current = e;
    }),
    t
  );
}
function nN(e) {
  e === void 0 && (e = {});
  const {
      placement: t = "bottom",
      strategy: n = "absolute",
      middleware: r = [],
      platform: o,
      elements: { reference: s, floating: a } = {},
      transform: l = !0,
      whileElementsMounted: c,
      open: u,
    } = e,
    [d, p] = f.useState({
      x: 0,
      y: 0,
      strategy: n,
      placement: t,
      middlewareData: {},
      isPositioned: !1,
    }),
    [m, g] = f.useState(r);
  Fa(m, r) || g(r);
  const [S, h] = f.useState(null),
    [w, y] = f.useState(null),
    v = f.useCallback((E) => {
      E !== N.current && ((N.current = E), h(E));
    }, []),
    x = f.useCallback((E) => {
      E !== C.current && ((C.current = E), y(E));
    }, []),
    j = s || S,
    b = a || w,
    N = f.useRef(null),
    C = f.useRef(null),
    T = f.useRef(d),
    I = c != null,
    O = ic(c),
    $ = ic(o),
    _ = ic(u),
    V = f.useCallback(() => {
      if (!N.current || !C.current) return;
      const E = { placement: t, strategy: n, middleware: m };
      ($.current && (E.platform = $.current),
        tN(N.current, C.current, E).then((P) => {
          const D = { ...P, isPositioned: _.current !== !1 };
          M.current &&
            !Fa(T.current, D) &&
            ((T.current = D),
            qr.flushSync(() => {
              p(D);
            }));
        }));
    }, [m, t, n, $, _]);
  sa(() => {
    u === !1 &&
      T.current.isPositioned &&
      ((T.current.isPositioned = !1), p((E) => ({ ...E, isPositioned: !1 })));
  }, [u]);
  const M = f.useRef(!1);
  (sa(
    () => (
      (M.current = !0),
      () => {
        M.current = !1;
      }
    ),
    [],
  ),
    sa(() => {
      if ((j && (N.current = j), b && (C.current = b), j && b)) {
        if (O.current) return O.current(j, b, V);
        V();
      }
    }, [j, b, V, O, I]));
  const H = f.useMemo(
      () => ({ reference: N, floating: C, setReference: v, setFloating: x }),
      [v, x],
    ),
    z = f.useMemo(() => ({ reference: j, floating: b }), [j, b]),
    B = f.useMemo(() => {
      const E = { position: n, left: 0, top: 0 };
      if (!z.floating) return E;
      const P = Qp(z.floating, d.x),
        D = Qp(z.floating, d.y);
      return l
        ? {
            ...E,
            transform: "translate(" + P + "px, " + D + "px)",
            ...(Hv(z.floating) >= 1.5 && { willChange: "transform" }),
          }
        : { position: n, left: P, top: D };
    }, [n, l, z.floating, d.x, d.y]);
  return f.useMemo(
    () => ({ ...d, update: V, refs: H, elements: z, floatingStyles: B }),
    [d, V, H, z, B],
  );
}
const rN = (e) => {
    function t(n) {
      return {}.hasOwnProperty.call(n, "current");
    }
    return {
      name: "arrow",
      options: e,
      fn(n) {
        const { element: r, padding: o } = typeof e == "function" ? e(n) : e;
        return r && t(r)
          ? r.current != null
            ? Kp({ element: r.current, padding: o }).fn(n)
            : {}
          : r
            ? Kp({ element: r, padding: o }).fn(n)
            : {};
      },
    };
  },
  oN = (e, t) => ({ ...Gb(e), options: [e, t] }),
  sN = (e, t) => ({ ...Yb(e), options: [e, t] }),
  iN = (e, t) => ({ ...eN(e), options: [e, t] }),
  aN = (e, t) => ({ ...Xb(e), options: [e, t] }),
  lN = (e, t) => ({ ...Jb(e), options: [e, t] }),
  cN = (e, t) => ({ ...Zb(e), options: [e, t] }),
  uN = (e, t) => ({ ...rN(e), options: [e, t] });
var dN = "Arrow",
  Kv = f.forwardRef((e, t) => {
    const { children: n, width: r = 10, height: o = 5, ...s } = e;
    return i.jsx(ne.svg, {
      ...s,
      ref: t,
      width: r,
      height: o,
      viewBox: "0 0 30 10",
      preserveAspectRatio: "none",
      children: e.asChild ? n : i.jsx("polygon", { points: "0,0 30,0 15,10" }),
    });
  });
Kv.displayName = dN;
var fN = Kv;
function pN(e) {
  const [t, n] = f.useState(void 0);
  return (
    Ue(() => {
      if (e) {
        n({ width: e.offsetWidth, height: e.offsetHeight });
        const r = new ResizeObserver((o) => {
          if (!Array.isArray(o) || !o.length) return;
          const s = o[0];
          let a, l;
          if ("borderBoxSize" in s) {
            const c = s.borderBoxSize,
              u = Array.isArray(c) ? c[0] : c;
            ((a = u.inlineSize), (l = u.blockSize));
          } else ((a = e.offsetWidth), (l = e.offsetHeight));
          n({ width: a, height: l });
        });
        return (r.observe(e, { box: "border-box" }), () => r.unobserve(e));
      } else n(void 0);
    }, [e]),
    t
  );
}
var Ud = "Popper",
  [Qv, hl] = Gr(Ud),
  [hN, qv] = Qv(Ud),
  Gv = (e) => {
    const { __scopePopper: t, children: n } = e,
      [r, o] = f.useState(null);
    return i.jsx(hN, { scope: t, anchor: r, onAnchorChange: o, children: n });
  };
Gv.displayName = Ud;
var Yv = "PopperAnchor",
  Xv = f.forwardRef((e, t) => {
    const { __scopePopper: n, virtualRef: r, ...o } = e,
      s = qv(Yv, n),
      a = f.useRef(null),
      l = Ne(t, a);
    return (
      f.useEffect(() => {
        s.onAnchorChange((r == null ? void 0 : r.current) || a.current);
      }),
      r ? null : i.jsx(ne.div, { ...o, ref: l })
    );
  });
Xv.displayName = Yv;
var Bd = "PopperContent",
  [mN, gN] = Qv(Bd),
  Jv = f.forwardRef((e, t) => {
    var L, pe, Ie, de, oe, le;
    const {
        __scopePopper: n,
        side: r = "bottom",
        sideOffset: o = 0,
        align: s = "center",
        alignOffset: a = 0,
        arrowPadding: l = 0,
        avoidCollisions: c = !0,
        collisionBoundary: u = [],
        collisionPadding: d = 0,
        sticky: p = "partial",
        hideWhenDetached: m = !1,
        updatePositionStrategy: g = "optimized",
        onPlaced: S,
        ...h
      } = e,
      w = qv(Bd, n),
      [y, v] = f.useState(null),
      x = Ne(t, (Ge) => v(Ge)),
      [j, b] = f.useState(null),
      N = pN(j),
      C = (N == null ? void 0 : N.width) ?? 0,
      T = (N == null ? void 0 : N.height) ?? 0,
      I = r + (s !== "center" ? "-" + s : ""),
      O =
        typeof d == "number"
          ? d
          : { top: 0, right: 0, bottom: 0, left: 0, ...d },
      $ = Array.isArray(u) ? u : [u],
      _ = $.length > 0,
      V = { padding: O, boundary: $.filter(yN), altBoundary: _ },
      {
        refs: M,
        floatingStyles: H,
        placement: z,
        isPositioned: B,
        middlewareData: E,
      } = nN({
        strategy: "fixed",
        placement: I,
        whileElementsMounted: (...Ge) =>
          qb(...Ge, { animationFrame: g === "always" }),
        elements: { reference: w.anchor },
        middleware: [
          oN({ mainAxis: o + T, alignmentAxis: a }),
          c &&
            sN({
              mainAxis: !0,
              crossAxis: !1,
              limiter: p === "partial" ? iN() : void 0,
              ...V,
            }),
          c && aN({ ...V }),
          lN({
            ...V,
            apply: ({
              elements: Ge,
              rects: Nt,
              availableWidth: xr,
              availableHeight: Tn,
            }) => {
              const { width: wr, height: as } = Nt.reference,
                Xr = Ge.floating.style;
              (Xr.setProperty("--radix-popper-available-width", `${xr}px`),
                Xr.setProperty("--radix-popper-available-height", `${Tn}px`),
                Xr.setProperty("--radix-popper-anchor-width", `${wr}px`),
                Xr.setProperty("--radix-popper-anchor-height", `${as}px`));
            },
          }),
          j && uN({ element: j, padding: l }),
          xN({ arrowWidth: C, arrowHeight: T }),
          m && cN({ strategy: "referenceHidden", ...V }),
        ],
      }),
      [P, D] = ty(z),
      W = Ot(S);
    Ue(() => {
      B && (W == null || W());
    }, [B, W]);
    const U = (L = E.arrow) == null ? void 0 : L.x,
      J = (pe = E.arrow) == null ? void 0 : pe.y,
      Q = ((Ie = E.arrow) == null ? void 0 : Ie.centerOffset) !== 0,
      [xe, Ae] = f.useState();
    return (
      Ue(() => {
        y && Ae(window.getComputedStyle(y).zIndex);
      }, [y]),
      i.jsx("div", {
        ref: M.setFloating,
        "data-radix-popper-content-wrapper": "",
        style: {
          ...H,
          transform: B ? H.transform : "translate(0, -200%)",
          minWidth: "max-content",
          zIndex: xe,
          "--radix-popper-transform-origin": [
            (de = E.transformOrigin) == null ? void 0 : de.x,
            (oe = E.transformOrigin) == null ? void 0 : oe.y,
          ].join(" "),
          ...(((le = E.hide) == null ? void 0 : le.referenceHidden) && {
            visibility: "hidden",
            pointerEvents: "none",
          }),
        },
        dir: e.dir,
        children: i.jsx(mN, {
          scope: n,
          placedSide: P,
          onArrowChange: b,
          arrowX: U,
          arrowY: J,
          shouldHideArrow: Q,
          children: i.jsx(ne.div, {
            "data-side": P,
            "data-align": D,
            ...h,
            ref: x,
            style: { ...h.style, animation: B ? void 0 : "none" },
          }),
        }),
      })
    );
  });
Jv.displayName = Bd;
var Zv = "PopperArrow",
  vN = { top: "bottom", right: "left", bottom: "top", left: "right" },
  ey = f.forwardRef(function (t, n) {
    const { __scopePopper: r, ...o } = t,
      s = gN(Zv, r),
      a = vN[s.placedSide];
    return i.jsx("span", {
      ref: s.onArrowChange,
      style: {
        position: "absolute",
        left: s.arrowX,
        top: s.arrowY,
        [a]: 0,
        transformOrigin: {
          top: "",
          right: "0 0",
          bottom: "center 0",
          left: "100% 0",
        }[s.placedSide],
        transform: {
          top: "translateY(100%)",
          right: "translateY(50%) rotate(90deg) translateX(-50%)",
          bottom: "rotate(180deg)",
          left: "translateY(50%) rotate(-90deg) translateX(50%)",
        }[s.placedSide],
        visibility: s.shouldHideArrow ? "hidden" : void 0,
      },
      children: i.jsx(fN, {
        ...o,
        ref: n,
        style: { ...o.style, display: "block" },
      }),
    });
  });
ey.displayName = Zv;
function yN(e) {
  return e !== null;
}
var xN = (e) => ({
  name: "transformOrigin",
  options: e,
  fn(t) {
    var w, y, v;
    const { placement: n, rects: r, middlewareData: o } = t,
      a = ((w = o.arrow) == null ? void 0 : w.centerOffset) !== 0,
      l = a ? 0 : e.arrowWidth,
      c = a ? 0 : e.arrowHeight,
      [u, d] = ty(n),
      p = { start: "0%", center: "50%", end: "100%" }[d],
      m = (((y = o.arrow) == null ? void 0 : y.x) ?? 0) + l / 2,
      g = (((v = o.arrow) == null ? void 0 : v.y) ?? 0) + c / 2;
    let S = "",
      h = "";
    return (
      u === "bottom"
        ? ((S = a ? p : `${m}px`), (h = `${-c}px`))
        : u === "top"
          ? ((S = a ? p : `${m}px`), (h = `${r.floating.height + c}px`))
          : u === "right"
            ? ((S = `${-c}px`), (h = a ? p : `${g}px`))
            : u === "left" &&
              ((S = `${r.floating.width + c}px`), (h = a ? p : `${g}px`)),
      { data: { x: S, y: h } }
    );
  },
});
function ty(e) {
  const [t, n = "center"] = e.split("-");
  return [t, n];
}
var wN = Gv,
  ny = Xv,
  ry = Jv,
  oy = ey,
  [ml, Xk] = Gr("Tooltip", [hl]),
  Vd = hl(),
  sy = "TooltipProvider",
  SN = 700,
  qp = "tooltip.open",
  [jN, iy] = ml(sy),
  ay = (e) => {
    const {
        __scopeTooltip: t,
        delayDuration: n = SN,
        skipDelayDuration: r = 300,
        disableHoverableContent: o = !1,
        children: s,
      } = e,
      a = f.useRef(!0),
      l = f.useRef(!1),
      c = f.useRef(0);
    return (
      f.useEffect(() => {
        const u = c.current;
        return () => window.clearTimeout(u);
      }, []),
      i.jsx(jN, {
        scope: t,
        isOpenDelayedRef: a,
        delayDuration: n,
        onOpen: f.useCallback(() => {
          (window.clearTimeout(c.current), (a.current = !1));
        }, []),
        onClose: f.useCallback(() => {
          (window.clearTimeout(c.current),
            (c.current = window.setTimeout(() => (a.current = !0), r)));
        }, [r]),
        isPointerInTransitRef: l,
        onPointerInTransitChange: f.useCallback((u) => {
          l.current = u;
        }, []),
        disableHoverableContent: o,
        children: s,
      })
    );
  };
ay.displayName = sy;
var ly = "Tooltip",
  [Jk, gl] = ml(ly),
  xu = "TooltipTrigger",
  bN = f.forwardRef((e, t) => {
    const { __scopeTooltip: n, ...r } = e,
      o = gl(xu, n),
      s = iy(xu, n),
      a = Vd(n),
      l = f.useRef(null),
      c = Ne(t, l, o.onTriggerChange),
      u = f.useRef(!1),
      d = f.useRef(!1),
      p = f.useCallback(() => (u.current = !1), []);
    return (
      f.useEffect(
        () => () => document.removeEventListener("pointerup", p),
        [p],
      ),
      i.jsx(ny, {
        asChild: !0,
        ...a,
        children: i.jsx(ne.button, {
          "aria-describedby": o.open ? o.contentId : void 0,
          "data-state": o.stateAttribute,
          ...r,
          ref: c,
          onPointerMove: ee(e.onPointerMove, (m) => {
            m.pointerType !== "touch" &&
              !d.current &&
              !s.isPointerInTransitRef.current &&
              (o.onTriggerEnter(), (d.current = !0));
          }),
          onPointerLeave: ee(e.onPointerLeave, () => {
            (o.onTriggerLeave(), (d.current = !1));
          }),
          onPointerDown: ee(e.onPointerDown, () => {
            (o.open && o.onClose(),
              (u.current = !0),
              document.addEventListener("pointerup", p, { once: !0 }));
          }),
          onFocus: ee(e.onFocus, () => {
            u.current || o.onOpen();
          }),
          onBlur: ee(e.onBlur, o.onClose),
          onClick: ee(e.onClick, o.onClose),
        }),
      })
    );
  });
bN.displayName = xu;
var NN = "TooltipPortal",
  [Zk, CN] = ml(NN, { forceMount: void 0 }),
  Ko = "TooltipContent",
  cy = f.forwardRef((e, t) => {
    const n = CN(Ko, e.__scopeTooltip),
      { forceMount: r = n.forceMount, side: o = "top", ...s } = e,
      a = gl(Ko, e.__scopeTooltip);
    return i.jsx(Zo, {
      present: r || a.open,
      children: a.disableHoverableContent
        ? i.jsx(uy, { side: o, ...s, ref: t })
        : i.jsx(EN, { side: o, ...s, ref: t }),
    });
  }),
  EN = f.forwardRef((e, t) => {
    const n = gl(Ko, e.__scopeTooltip),
      r = iy(Ko, e.__scopeTooltip),
      o = f.useRef(null),
      s = Ne(t, o),
      [a, l] = f.useState(null),
      { trigger: c, onClose: u } = n,
      d = o.current,
      { onPointerInTransitChange: p } = r,
      m = f.useCallback(() => {
        (l(null), p(!1));
      }, [p]),
      g = f.useCallback(
        (S, h) => {
          const w = S.currentTarget,
            y = { x: S.clientX, y: S.clientY },
            v = AN(y, w.getBoundingClientRect()),
            x = IN(y, v),
            j = ON(h.getBoundingClientRect()),
            b = _N([...x, ...j]);
          (l(b), p(!0));
        },
        [p],
      );
    return (
      f.useEffect(() => () => m(), [m]),
      f.useEffect(() => {
        if (c && d) {
          const S = (w) => g(w, d),
            h = (w) => g(w, c);
          return (
            c.addEventListener("pointerleave", S),
            d.addEventListener("pointerleave", h),
            () => {
              (c.removeEventListener("pointerleave", S),
                d.removeEventListener("pointerleave", h));
            }
          );
        }
      }, [c, d, g, m]),
      f.useEffect(() => {
        if (a) {
          const S = (h) => {
            const w = h.target,
              y = { x: h.clientX, y: h.clientY },
              v =
                (c == null ? void 0 : c.contains(w)) ||
                (d == null ? void 0 : d.contains(w)),
              x = !MN(y, a);
            v ? m() : x && (m(), u());
          };
          return (
            document.addEventListener("pointermove", S),
            () => document.removeEventListener("pointermove", S)
          );
        }
      }, [c, d, a, u, m]),
      i.jsx(uy, { ...e, ref: s })
    );
  }),
  [kN, PN] = ml(ly, { isInside: !1 }),
  TN = nS("TooltipContent"),
  uy = f.forwardRef((e, t) => {
    const {
        __scopeTooltip: n,
        children: r,
        "aria-label": o,
        onEscapeKeyDown: s,
        onPointerDownOutside: a,
        ...l
      } = e,
      c = gl(Ko, n),
      u = Vd(n),
      { onClose: d } = c;
    return (
      f.useEffect(
        () => (
          document.addEventListener(qp, d),
          () => document.removeEventListener(qp, d)
        ),
        [d],
      ),
      f.useEffect(() => {
        if (c.trigger) {
          const p = (m) => {
            const g = m.target;
            g != null && g.contains(c.trigger) && d();
          };
          return (
            window.addEventListener("scroll", p, { capture: !0 }),
            () => window.removeEventListener("scroll", p, { capture: !0 })
          );
        }
      }, [c.trigger, d]),
      i.jsx(hi, {
        asChild: !0,
        disableOutsidePointerEvents: !1,
        onEscapeKeyDown: s,
        onPointerDownOutside: a,
        onFocusOutside: (p) => p.preventDefault(),
        onDismiss: d,
        children: i.jsxs(ry, {
          "data-state": c.stateAttribute,
          ...u,
          ...l,
          ref: t,
          style: {
            ...l.style,
            "--radix-tooltip-content-transform-origin":
              "var(--radix-popper-transform-origin)",
            "--radix-tooltip-content-available-width":
              "var(--radix-popper-available-width)",
            "--radix-tooltip-content-available-height":
              "var(--radix-popper-available-height)",
            "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-tooltip-trigger-height":
              "var(--radix-popper-anchor-height)",
          },
          children: [
            i.jsx(TN, { children: r }),
            i.jsx(kN, {
              scope: n,
              isInside: !0,
              children: i.jsx(NS, {
                id: c.contentId,
                role: "tooltip",
                children: o || r,
              }),
            }),
          ],
        }),
      })
    );
  });
cy.displayName = Ko;
var dy = "TooltipArrow",
  RN = f.forwardRef((e, t) => {
    const { __scopeTooltip: n, ...r } = e,
      o = Vd(n);
    return PN(dy, n).isInside ? null : i.jsx(oy, { ...o, ...r, ref: t });
  });
RN.displayName = dy;
function AN(e, t) {
  const n = Math.abs(t.top - e.y),
    r = Math.abs(t.bottom - e.y),
    o = Math.abs(t.right - e.x),
    s = Math.abs(t.left - e.x);
  switch (Math.min(n, r, o, s)) {
    case s:
      return "left";
    case o:
      return "right";
    case n:
      return "top";
    case r:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function IN(e, t, n = 5) {
  const r = [];
  switch (t) {
    case "top":
      r.push({ x: e.x - n, y: e.y + n }, { x: e.x + n, y: e.y + n });
      break;
    case "bottom":
      r.push({ x: e.x - n, y: e.y - n }, { x: e.x + n, y: e.y - n });
      break;
    case "left":
      r.push({ x: e.x + n, y: e.y - n }, { x: e.x + n, y: e.y + n });
      break;
    case "right":
      r.push({ x: e.x - n, y: e.y - n }, { x: e.x - n, y: e.y + n });
      break;
  }
  return r;
}
function ON(e) {
  const { top: t, right: n, bottom: r, left: o } = e;
  return [
    { x: o, y: t },
    { x: n, y: t },
    { x: n, y: r },
    { x: o, y: r },
  ];
}
function MN(e, t) {
  const { x: n, y: r } = e;
  let o = !1;
  for (let s = 0, a = t.length - 1; s < t.length; a = s++) {
    const l = t[s],
      c = t[a],
      u = l.x,
      d = l.y,
      p = c.x,
      m = c.y;
    d > r != m > r && n < ((p - u) * (r - d)) / (m - d) + u && (o = !o);
  }
  return o;
}
function _N(e) {
  const t = e.slice();
  return (
    t.sort((n, r) =>
      n.x < r.x ? -1 : n.x > r.x ? 1 : n.y < r.y ? -1 : n.y > r.y ? 1 : 0,
    ),
    DN(t)
  );
}
function DN(e) {
  if (e.length <= 1) return e.slice();
  const t = [];
  for (let r = 0; r < e.length; r++) {
    const o = e[r];
    for (; t.length >= 2;) {
      const s = t[t.length - 1],
        a = t[t.length - 2];
      if ((s.x - a.x) * (o.y - a.y) >= (s.y - a.y) * (o.x - a.x)) t.pop();
      else break;
    }
    t.push(o);
  }
  t.pop();
  const n = [];
  for (let r = e.length - 1; r >= 0; r--) {
    const o = e[r];
    for (; n.length >= 2;) {
      const s = n[n.length - 1],
        a = n[n.length - 2];
      if ((s.x - a.x) * (o.y - a.y) >= (s.y - a.y) * (o.x - a.x)) n.pop();
      else break;
    }
    n.push(o);
  }
  return (
    n.pop(),
    t.length === 1 && n.length === 1 && t[0].x === n[0].x && t[0].y === n[0].y
      ? t
      : t.concat(n)
  );
}
var LN = ay,
  fy = cy;
const FN = LN,
  zN = f.forwardRef(({ className: e, sideOffset: t = 4, ...n }, r) =>
    i.jsx(fy, {
      ref: r,
      sideOffset: t,
      className: X(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        e,
      ),
      ...n,
    }),
  );
zN.displayName = fy.displayName;
var vl = class {
    constructor() {
      ((this.listeners = new Set()),
        (this.subscribe = this.subscribe.bind(this)));
    }
    subscribe(e) {
      return (
        this.listeners.add(e),
        this.onSubscribe(),
        () => {
          (this.listeners.delete(e), this.onUnsubscribe());
        }
      );
    }
    hasListeners() {
      return this.listeners.size > 0;
    }
    onSubscribe() {}
    onUnsubscribe() {}
  },
  yl = typeof window > "u" || "Deno" in globalThis;
function Ut() {}
function $N(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function UN(e) {
  return typeof e == "number" && e >= 0 && e !== 1 / 0;
}
function BN(e, t) {
  return Math.max(e + (t || 0) - Date.now(), 0);
}
function wu(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function VN(e, t) {
  return typeof e == "function" ? e(t) : e;
}
function Gp(e, t) {
  const {
    type: n = "all",
    exact: r,
    fetchStatus: o,
    predicate: s,
    queryKey: a,
    stale: l,
  } = e;
  if (a) {
    if (r) {
      if (t.queryHash !== Wd(a, t.options)) return !1;
    } else if (!ni(t.queryKey, a)) return !1;
  }
  if (n !== "all") {
    const c = t.isActive();
    if ((n === "active" && !c) || (n === "inactive" && c)) return !1;
  }
  return !(
    (typeof l == "boolean" && t.isStale() !== l) ||
    (o && o !== t.state.fetchStatus) ||
    (s && !s(t))
  );
}
function Yp(e, t) {
  const { exact: n, status: r, predicate: o, mutationKey: s } = e;
  if (s) {
    if (!t.options.mutationKey) return !1;
    if (n) {
      if (ti(t.options.mutationKey) !== ti(s)) return !1;
    } else if (!ni(t.options.mutationKey, s)) return !1;
  }
  return !((r && t.state.status !== r) || (o && !o(t)));
}
function Wd(e, t) {
  return ((t == null ? void 0 : t.queryKeyHashFn) || ti)(e);
}
function ti(e) {
  return JSON.stringify(e, (t, n) =>
    Su(n)
      ? Object.keys(n)
          .sort()
          .reduce((r, o) => ((r[o] = n[o]), r), {})
      : n,
  );
}
function ni(e, t) {
  return e === t
    ? !0
    : typeof e != typeof t
      ? !1
      : e && t && typeof e == "object" && typeof t == "object"
        ? Object.keys(t).every((n) => ni(e[n], t[n]))
        : !1;
}
function py(e, t) {
  if (e === t) return e;
  const n = Xp(e) && Xp(t);
  if (n || (Su(e) && Su(t))) {
    const r = n ? e : Object.keys(e),
      o = r.length,
      s = n ? t : Object.keys(t),
      a = s.length,
      l = n ? [] : {},
      c = new Set(r);
    let u = 0;
    for (let d = 0; d < a; d++) {
      const p = n ? d : s[d];
      ((!n && c.has(p)) || n) && e[p] === void 0 && t[p] === void 0
        ? ((l[p] = void 0), u++)
        : ((l[p] = py(e[p], t[p])), l[p] === e[p] && e[p] !== void 0 && u++);
    }
    return o === a && u === o ? e : l;
  }
  return t;
}
function Xp(e) {
  return Array.isArray(e) && e.length === Object.keys(e).length;
}
function Su(e) {
  if (!Jp(e)) return !1;
  const t = e.constructor;
  if (t === void 0) return !0;
  const n = t.prototype;
  return !(
    !Jp(n) ||
    !n.hasOwnProperty("isPrototypeOf") ||
    Object.getPrototypeOf(e) !== Object.prototype
  );
}
function Jp(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function WN(e) {
  return new Promise((t) => {
    setTimeout(t, e);
  });
}
function HN(e, t, n) {
  return typeof n.structuralSharing == "function"
    ? n.structuralSharing(e, t)
    : n.structuralSharing !== !1
      ? py(e, t)
      : t;
}
function KN(e, t, n = 0) {
  const r = [...e, t];
  return n && r.length > n ? r.slice(1) : r;
}
function QN(e, t, n = 0) {
  const r = [t, ...e];
  return n && r.length > n ? r.slice(0, -1) : r;
}
var Hd = Symbol();
function hy(e, t) {
  return !e.queryFn && t != null && t.initialPromise
    ? () => t.initialPromise
    : !e.queryFn || e.queryFn === Hd
      ? () => Promise.reject(new Error(`Missing queryFn: '${e.queryHash}'`))
      : e.queryFn;
}
var Tr,
  Bn,
  Po,
  Nh,
  qN =
    ((Nh = class extends vl {
      constructor() {
        super();
        ce(this, Tr);
        ce(this, Bn);
        ce(this, Po);
        G(this, Po, (t) => {
          if (!yl && window.addEventListener) {
            const n = () => t();
            return (
              window.addEventListener("visibilitychange", n, !1),
              () => {
                window.removeEventListener("visibilitychange", n);
              }
            );
          }
        });
      }
      onSubscribe() {
        k(this, Bn) || this.setEventListener(k(this, Po));
      }
      onUnsubscribe() {
        var t;
        this.hasListeners() ||
          ((t = k(this, Bn)) == null || t.call(this), G(this, Bn, void 0));
      }
      setEventListener(t) {
        var n;
        (G(this, Po, t),
          (n = k(this, Bn)) == null || n.call(this),
          G(
            this,
            Bn,
            t((r) => {
              typeof r == "boolean" ? this.setFocused(r) : this.onFocus();
            }),
          ));
      }
      setFocused(t) {
        k(this, Tr) !== t && (G(this, Tr, t), this.onFocus());
      }
      onFocus() {
        const t = this.isFocused();
        this.listeners.forEach((n) => {
          n(t);
        });
      }
      isFocused() {
        var t;
        return typeof k(this, Tr) == "boolean"
          ? k(this, Tr)
          : ((t = globalThis.document) == null ? void 0 : t.visibilityState) !==
              "hidden";
      }
    }),
    (Tr = new WeakMap()),
    (Bn = new WeakMap()),
    (Po = new WeakMap()),
    Nh),
  my = new qN(),
  To,
  Vn,
  Ro,
  Ch,
  GN =
    ((Ch = class extends vl {
      constructor() {
        super();
        ce(this, To, !0);
        ce(this, Vn);
        ce(this, Ro);
        G(this, Ro, (t) => {
          if (!yl && window.addEventListener) {
            const n = () => t(!0),
              r = () => t(!1);
            return (
              window.addEventListener("online", n, !1),
              window.addEventListener("offline", r, !1),
              () => {
                (window.removeEventListener("online", n),
                  window.removeEventListener("offline", r));
              }
            );
          }
        });
      }
      onSubscribe() {
        k(this, Vn) || this.setEventListener(k(this, Ro));
      }
      onUnsubscribe() {
        var t;
        this.hasListeners() ||
          ((t = k(this, Vn)) == null || t.call(this), G(this, Vn, void 0));
      }
      setEventListener(t) {
        var n;
        (G(this, Ro, t),
          (n = k(this, Vn)) == null || n.call(this),
          G(this, Vn, t(this.setOnline.bind(this))));
      }
      setOnline(t) {
        k(this, To) !== t &&
          (G(this, To, t),
          this.listeners.forEach((r) => {
            r(t);
          }));
      }
      isOnline() {
        return k(this, To);
      }
    }),
    (To = new WeakMap()),
    (Vn = new WeakMap()),
    (Ro = new WeakMap()),
    Ch),
  za = new GN();
function YN() {
  let e, t;
  const n = new Promise((o, s) => {
    ((e = o), (t = s));
  });
  ((n.status = "pending"), n.catch(() => {}));
  function r(o) {
    (Object.assign(n, o), delete n.resolve, delete n.reject);
  }
  return (
    (n.resolve = (o) => {
      (r({ status: "fulfilled", value: o }), e(o));
    }),
    (n.reject = (o) => {
      (r({ status: "rejected", reason: o }), t(o));
    }),
    n
  );
}
function XN(e) {
  return Math.min(1e3 * 2 ** e, 3e4);
}
function gy(e) {
  return (e ?? "online") === "online" ? za.isOnline() : !0;
}
var vy = class extends Error {
  constructor(e) {
    (super("CancelledError"),
      (this.revert = e == null ? void 0 : e.revert),
      (this.silent = e == null ? void 0 : e.silent));
  }
};
function ac(e) {
  return e instanceof vy;
}
function yy(e) {
  let t = !1,
    n = 0,
    r = !1,
    o;
  const s = YN(),
    a = (h) => {
      var w;
      r || (m(new vy(h)), (w = e.abort) == null || w.call(e));
    },
    l = () => {
      t = !0;
    },
    c = () => {
      t = !1;
    },
    u = () =>
      my.isFocused() &&
      (e.networkMode === "always" || za.isOnline()) &&
      e.canRun(),
    d = () => gy(e.networkMode) && e.canRun(),
    p = (h) => {
      var w;
      r ||
        ((r = !0),
        (w = e.onSuccess) == null || w.call(e, h),
        o == null || o(),
        s.resolve(h));
    },
    m = (h) => {
      var w;
      r ||
        ((r = !0),
        (w = e.onError) == null || w.call(e, h),
        o == null || o(),
        s.reject(h));
    },
    g = () =>
      new Promise((h) => {
        var w;
        ((o = (y) => {
          (r || u()) && h(y);
        }),
          (w = e.onPause) == null || w.call(e));
      }).then(() => {
        var h;
        ((o = void 0), r || (h = e.onContinue) == null || h.call(e));
      }),
    S = () => {
      if (r) return;
      let h;
      const w = n === 0 ? e.initialPromise : void 0;
      try {
        h = w ?? e.fn();
      } catch (y) {
        h = Promise.reject(y);
      }
      Promise.resolve(h)
        .then(p)
        .catch((y) => {
          var N;
          if (r) return;
          const v = e.retry ?? (yl ? 0 : 3),
            x = e.retryDelay ?? XN,
            j = typeof x == "function" ? x(n, y) : x,
            b =
              v === !0 ||
              (typeof v == "number" && n < v) ||
              (typeof v == "function" && v(n, y));
          if (t || !b) {
            m(y);
            return;
          }
          (n++,
            (N = e.onFail) == null || N.call(e, n, y),
            WN(j)
              .then(() => (u() ? void 0 : g()))
              .then(() => {
                t ? m(y) : S();
              }));
        });
    };
  return {
    promise: s,
    cancel: a,
    continue: () => (o == null || o(), s),
    cancelRetry: l,
    continueRetry: c,
    canStart: d,
    start: () => (d() ? S() : g().then(S), s),
  };
}
var JN = (e) => setTimeout(e, 0);
function ZN() {
  let e = [],
    t = 0,
    n = (l) => {
      l();
    },
    r = (l) => {
      l();
    },
    o = JN;
  const s = (l) => {
      t
        ? e.push(l)
        : o(() => {
            n(l);
          });
    },
    a = () => {
      const l = e;
      ((e = []),
        l.length &&
          o(() => {
            r(() => {
              l.forEach((c) => {
                n(c);
              });
            });
          }));
    };
  return {
    batch: (l) => {
      let c;
      t++;
      try {
        c = l();
      } finally {
        (t--, t || a());
      }
      return c;
    },
    batchCalls:
      (l) =>
      (...c) => {
        s(() => {
          l(...c);
        });
      },
    schedule: s,
    setNotifyFunction: (l) => {
      n = l;
    },
    setBatchNotifyFunction: (l) => {
      r = l;
    },
    setScheduler: (l) => {
      o = l;
    },
  };
}
var st = ZN(),
  Rr,
  Eh,
  xy =
    ((Eh = class {
      constructor() {
        ce(this, Rr);
      }
      destroy() {
        this.clearGcTimeout();
      }
      scheduleGc() {
        (this.clearGcTimeout(),
          UN(this.gcTime) &&
            G(
              this,
              Rr,
              setTimeout(() => {
                this.optionalRemove();
              }, this.gcTime),
            ));
      }
      updateGcTime(e) {
        this.gcTime = Math.max(
          this.gcTime || 0,
          e ?? (yl ? 1 / 0 : 5 * 60 * 1e3),
        );
      }
      clearGcTimeout() {
        k(this, Rr) && (clearTimeout(k(this, Rr)), G(this, Rr, void 0));
      }
    }),
    (Rr = new WeakMap()),
    Eh),
  Ao,
  Ar,
  Et,
  Ir,
  et,
  ai,
  Or,
  Bt,
  pn,
  kh,
  eC =
    ((kh = class extends xy {
      constructor(t) {
        super();
        ce(this, Bt);
        ce(this, Ao);
        ce(this, Ar);
        ce(this, Et);
        ce(this, Ir);
        ce(this, et);
        ce(this, ai);
        ce(this, Or);
        (G(this, Or, !1),
          G(this, ai, t.defaultOptions),
          this.setOptions(t.options),
          (this.observers = []),
          G(this, Ir, t.client),
          G(this, Et, k(this, Ir).getQueryCache()),
          (this.queryKey = t.queryKey),
          (this.queryHash = t.queryHash),
          G(this, Ao, nC(this.options)),
          (this.state = t.state ?? k(this, Ao)),
          this.scheduleGc());
      }
      get meta() {
        return this.options.meta;
      }
      get promise() {
        var t;
        return (t = k(this, et)) == null ? void 0 : t.promise;
      }
      setOptions(t) {
        ((this.options = { ...k(this, ai), ...t }),
          this.updateGcTime(this.options.gcTime));
      }
      optionalRemove() {
        !this.observers.length &&
          this.state.fetchStatus === "idle" &&
          k(this, Et).remove(this);
      }
      setData(t, n) {
        const r = HN(this.state.data, t, this.options);
        return (
          Ye(this, Bt, pn).call(this, {
            data: r,
            type: "success",
            dataUpdatedAt: n == null ? void 0 : n.updatedAt,
            manual: n == null ? void 0 : n.manual,
          }),
          r
        );
      }
      setState(t, n) {
        Ye(this, Bt, pn).call(this, {
          type: "setState",
          state: t,
          setStateOptions: n,
        });
      }
      cancel(t) {
        var r, o;
        const n = (r = k(this, et)) == null ? void 0 : r.promise;
        return (
          (o = k(this, et)) == null || o.cancel(t),
          n ? n.then(Ut).catch(Ut) : Promise.resolve()
        );
      }
      destroy() {
        (super.destroy(), this.cancel({ silent: !0 }));
      }
      reset() {
        (this.destroy(), this.setState(k(this, Ao)));
      }
      isActive() {
        return this.observers.some((t) => VN(t.options.enabled, this) !== !1);
      }
      isDisabled() {
        return this.getObserversCount() > 0
          ? !this.isActive()
          : this.options.queryFn === Hd ||
              this.state.dataUpdateCount + this.state.errorUpdateCount === 0;
      }
      isStatic() {
        return this.getObserversCount() > 0
          ? this.observers.some(
              (t) => wu(t.options.staleTime, this) === "static",
            )
          : !1;
      }
      isStale() {
        return this.getObserversCount() > 0
          ? this.observers.some((t) => t.getCurrentResult().isStale)
          : this.state.data === void 0 || this.state.isInvalidated;
      }
      isStaleByTime(t = 0) {
        return this.state.data === void 0
          ? !0
          : t === "static"
            ? !1
            : this.state.isInvalidated
              ? !0
              : !BN(this.state.dataUpdatedAt, t);
      }
      onFocus() {
        var n;
        const t = this.observers.find((r) => r.shouldFetchOnWindowFocus());
        (t == null || t.refetch({ cancelRefetch: !1 }),
          (n = k(this, et)) == null || n.continue());
      }
      onOnline() {
        var n;
        const t = this.observers.find((r) => r.shouldFetchOnReconnect());
        (t == null || t.refetch({ cancelRefetch: !1 }),
          (n = k(this, et)) == null || n.continue());
      }
      addObserver(t) {
        this.observers.includes(t) ||
          (this.observers.push(t),
          this.clearGcTimeout(),
          k(this, Et).notify({
            type: "observerAdded",
            query: this,
            observer: t,
          }));
      }
      removeObserver(t) {
        this.observers.includes(t) &&
          ((this.observers = this.observers.filter((n) => n !== t)),
          this.observers.length ||
            (k(this, et) &&
              (k(this, Or)
                ? k(this, et).cancel({ revert: !0 })
                : k(this, et).cancelRetry()),
            this.scheduleGc()),
          k(this, Et).notify({
            type: "observerRemoved",
            query: this,
            observer: t,
          }));
      }
      getObserversCount() {
        return this.observers.length;
      }
      invalidate() {
        this.state.isInvalidated ||
          Ye(this, Bt, pn).call(this, { type: "invalidate" });
      }
      fetch(t, n) {
        var u, d, p;
        if (this.state.fetchStatus !== "idle") {
          if (this.state.data !== void 0 && n != null && n.cancelRefetch)
            this.cancel({ silent: !0 });
          else if (k(this, et))
            return (k(this, et).continueRetry(), k(this, et).promise);
        }
        if ((t && this.setOptions(t), !this.options.queryFn)) {
          const m = this.observers.find((g) => g.options.queryFn);
          m && this.setOptions(m.options);
        }
        const r = new AbortController(),
          o = (m) => {
            Object.defineProperty(m, "signal", {
              enumerable: !0,
              get: () => (G(this, Or, !0), r.signal),
            });
          },
          s = () => {
            const m = hy(this.options, n),
              S = (() => {
                const h = {
                  client: k(this, Ir),
                  queryKey: this.queryKey,
                  meta: this.meta,
                };
                return (o(h), h);
              })();
            return (
              G(this, Or, !1),
              this.options.persister ? this.options.persister(m, S, this) : m(S)
            );
          },
          l = (() => {
            const m = {
              fetchOptions: n,
              options: this.options,
              queryKey: this.queryKey,
              client: k(this, Ir),
              state: this.state,
              fetchFn: s,
            };
            return (o(m), m);
          })();
        ((u = this.options.behavior) == null || u.onFetch(l, this),
          G(this, Ar, this.state),
          (this.state.fetchStatus === "idle" ||
            this.state.fetchMeta !==
              ((d = l.fetchOptions) == null ? void 0 : d.meta)) &&
            Ye(this, Bt, pn).call(this, {
              type: "fetch",
              meta: (p = l.fetchOptions) == null ? void 0 : p.meta,
            }));
        const c = (m) => {
          var g, S, h, w;
          ((ac(m) && m.silent) ||
            Ye(this, Bt, pn).call(this, { type: "error", error: m }),
            ac(m) ||
              ((S = (g = k(this, Et).config).onError) == null ||
                S.call(g, m, this),
              (w = (h = k(this, Et).config).onSettled) == null ||
                w.call(h, this.state.data, m, this)),
            this.scheduleGc());
        };
        return (
          G(
            this,
            et,
            yy({
              initialPromise: n == null ? void 0 : n.initialPromise,
              fn: l.fetchFn,
              abort: r.abort.bind(r),
              onSuccess: (m) => {
                var g, S, h, w;
                if (m === void 0) {
                  c(new Error(`${this.queryHash} data is undefined`));
                  return;
                }
                try {
                  this.setData(m);
                } catch (y) {
                  c(y);
                  return;
                }
                ((S = (g = k(this, Et).config).onSuccess) == null ||
                  S.call(g, m, this),
                  (w = (h = k(this, Et).config).onSettled) == null ||
                    w.call(h, m, this.state.error, this),
                  this.scheduleGc());
              },
              onError: c,
              onFail: (m, g) => {
                Ye(this, Bt, pn).call(this, {
                  type: "failed",
                  failureCount: m,
                  error: g,
                });
              },
              onPause: () => {
                Ye(this, Bt, pn).call(this, { type: "pause" });
              },
              onContinue: () => {
                Ye(this, Bt, pn).call(this, { type: "continue" });
              },
              retry: l.options.retry,
              retryDelay: l.options.retryDelay,
              networkMode: l.options.networkMode,
              canRun: () => !0,
            }),
          ),
          k(this, et).start()
        );
      }
    }),
    (Ao = new WeakMap()),
    (Ar = new WeakMap()),
    (Et = new WeakMap()),
    (Ir = new WeakMap()),
    (et = new WeakMap()),
    (ai = new WeakMap()),
    (Or = new WeakMap()),
    (Bt = new WeakSet()),
    (pn = function (t) {
      const n = (r) => {
        switch (t.type) {
          case "failed":
            return {
              ...r,
              fetchFailureCount: t.failureCount,
              fetchFailureReason: t.error,
            };
          case "pause":
            return { ...r, fetchStatus: "paused" };
          case "continue":
            return { ...r, fetchStatus: "fetching" };
          case "fetch":
            return {
              ...r,
              ...tC(r.data, this.options),
              fetchMeta: t.meta ?? null,
            };
          case "success":
            return (
              G(this, Ar, void 0),
              {
                ...r,
                data: t.data,
                dataUpdateCount: r.dataUpdateCount + 1,
                dataUpdatedAt: t.dataUpdatedAt ?? Date.now(),
                error: null,
                isInvalidated: !1,
                status: "success",
                ...(!t.manual && {
                  fetchStatus: "idle",
                  fetchFailureCount: 0,
                  fetchFailureReason: null,
                }),
              }
            );
          case "error":
            const o = t.error;
            return ac(o) && o.revert && k(this, Ar)
              ? { ...k(this, Ar), fetchStatus: "idle" }
              : {
                  ...r,
                  error: o,
                  errorUpdateCount: r.errorUpdateCount + 1,
                  errorUpdatedAt: Date.now(),
                  fetchFailureCount: r.fetchFailureCount + 1,
                  fetchFailureReason: o,
                  fetchStatus: "idle",
                  status: "error",
                };
          case "invalidate":
            return { ...r, isInvalidated: !0 };
          case "setState":
            return { ...r, ...t.state };
        }
      };
      ((this.state = n(this.state)),
        st.batch(() => {
          (this.observers.forEach((r) => {
            r.onQueryUpdate();
          }),
            k(this, Et).notify({ query: this, type: "updated", action: t }));
        }));
    }),
    kh);
function tC(e, t) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: gy(t.networkMode) ? "fetching" : "paused",
    ...(e === void 0 && { error: null, status: "pending" }),
  };
}
function nC(e) {
  const t =
      typeof e.initialData == "function" ? e.initialData() : e.initialData,
    n = t !== void 0,
    r = n
      ? typeof e.initialDataUpdatedAt == "function"
        ? e.initialDataUpdatedAt()
        : e.initialDataUpdatedAt
      : 0;
  return {
    data: t,
    dataUpdateCount: 0,
    dataUpdatedAt: n ? (r ?? Date.now()) : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: !1,
    status: n ? "success" : "pending",
    fetchStatus: "idle",
  };
}
var nn,
  Ph,
  rC =
    ((Ph = class extends vl {
      constructor(t = {}) {
        super();
        ce(this, nn);
        ((this.config = t), G(this, nn, new Map()));
      }
      build(t, n, r) {
        const o = n.queryKey,
          s = n.queryHash ?? Wd(o, n);
        let a = this.get(s);
        return (
          a ||
            ((a = new eC({
              client: t,
              queryKey: o,
              queryHash: s,
              options: t.defaultQueryOptions(n),
              state: r,
              defaultOptions: t.getQueryDefaults(o),
            })),
            this.add(a)),
          a
        );
      }
      add(t) {
        k(this, nn).has(t.queryHash) ||
          (k(this, nn).set(t.queryHash, t),
          this.notify({ type: "added", query: t }));
      }
      remove(t) {
        const n = k(this, nn).get(t.queryHash);
        n &&
          (t.destroy(),
          n === t && k(this, nn).delete(t.queryHash),
          this.notify({ type: "removed", query: t }));
      }
      clear() {
        st.batch(() => {
          this.getAll().forEach((t) => {
            this.remove(t);
          });
        });
      }
      get(t) {
        return k(this, nn).get(t);
      }
      getAll() {
        return [...k(this, nn).values()];
      }
      find(t) {
        const n = { exact: !0, ...t };
        return this.getAll().find((r) => Gp(n, r));
      }
      findAll(t = {}) {
        const n = this.getAll();
        return Object.keys(t).length > 0 ? n.filter((r) => Gp(t, r)) : n;
      }
      notify(t) {
        st.batch(() => {
          this.listeners.forEach((n) => {
            n(t);
          });
        });
      }
      onFocus() {
        st.batch(() => {
          this.getAll().forEach((t) => {
            t.onFocus();
          });
        });
      }
      onOnline() {
        st.batch(() => {
          this.getAll().forEach((t) => {
            t.onOnline();
          });
        });
      }
    }),
    (nn = new WeakMap()),
    Ph),
  rn,
  rt,
  Mr,
  on,
  Dn,
  Th,
  oC =
    ((Th = class extends xy {
      constructor(t) {
        super();
        ce(this, on);
        ce(this, rn);
        ce(this, rt);
        ce(this, Mr);
        ((this.mutationId = t.mutationId),
          G(this, rt, t.mutationCache),
          G(this, rn, []),
          (this.state = t.state || sC()),
          this.setOptions(t.options),
          this.scheduleGc());
      }
      setOptions(t) {
        ((this.options = t), this.updateGcTime(this.options.gcTime));
      }
      get meta() {
        return this.options.meta;
      }
      addObserver(t) {
        k(this, rn).includes(t) ||
          (k(this, rn).push(t),
          this.clearGcTimeout(),
          k(this, rt).notify({
            type: "observerAdded",
            mutation: this,
            observer: t,
          }));
      }
      removeObserver(t) {
        (G(
          this,
          rn,
          k(this, rn).filter((n) => n !== t),
        ),
          this.scheduleGc(),
          k(this, rt).notify({
            type: "observerRemoved",
            mutation: this,
            observer: t,
          }));
      }
      optionalRemove() {
        k(this, rn).length ||
          (this.state.status === "pending"
            ? this.scheduleGc()
            : k(this, rt).remove(this));
      }
      continue() {
        var t;
        return (
          ((t = k(this, Mr)) == null ? void 0 : t.continue()) ??
          this.execute(this.state.variables)
        );
      }
      async execute(t) {
        var s, a, l, c, u, d, p, m, g, S, h, w, y, v, x, j, b, N, C, T;
        const n = () => {
          Ye(this, on, Dn).call(this, { type: "continue" });
        };
        G(
          this,
          Mr,
          yy({
            fn: () =>
              this.options.mutationFn
                ? this.options.mutationFn(t)
                : Promise.reject(new Error("No mutationFn found")),
            onFail: (I, O) => {
              Ye(this, on, Dn).call(this, {
                type: "failed",
                failureCount: I,
                error: O,
              });
            },
            onPause: () => {
              Ye(this, on, Dn).call(this, { type: "pause" });
            },
            onContinue: n,
            retry: this.options.retry ?? 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
            canRun: () => k(this, rt).canRun(this),
          }),
        );
        const r = this.state.status === "pending",
          o = !k(this, Mr).canStart();
        try {
          if (r) n();
          else {
            (Ye(this, on, Dn).call(this, {
              type: "pending",
              variables: t,
              isPaused: o,
            }),
              await ((a = (s = k(this, rt).config).onMutate) == null
                ? void 0
                : a.call(s, t, this)));
            const O = await ((c = (l = this.options).onMutate) == null
              ? void 0
              : c.call(l, t));
            O !== this.state.context &&
              Ye(this, on, Dn).call(this, {
                type: "pending",
                context: O,
                variables: t,
                isPaused: o,
              });
          }
          const I = await k(this, Mr).start();
          return (
            await ((d = (u = k(this, rt).config).onSuccess) == null
              ? void 0
              : d.call(u, I, t, this.state.context, this)),
            await ((m = (p = this.options).onSuccess) == null
              ? void 0
              : m.call(p, I, t, this.state.context)),
            await ((S = (g = k(this, rt).config).onSettled) == null
              ? void 0
              : S.call(
                  g,
                  I,
                  null,
                  this.state.variables,
                  this.state.context,
                  this,
                )),
            await ((w = (h = this.options).onSettled) == null
              ? void 0
              : w.call(h, I, null, t, this.state.context)),
            Ye(this, on, Dn).call(this, { type: "success", data: I }),
            I
          );
        } catch (I) {
          try {
            throw (
              await ((v = (y = k(this, rt).config).onError) == null
                ? void 0
                : v.call(y, I, t, this.state.context, this)),
              await ((j = (x = this.options).onError) == null
                ? void 0
                : j.call(x, I, t, this.state.context)),
              await ((N = (b = k(this, rt).config).onSettled) == null
                ? void 0
                : N.call(
                    b,
                    void 0,
                    I,
                    this.state.variables,
                    this.state.context,
                    this,
                  )),
              await ((T = (C = this.options).onSettled) == null
                ? void 0
                : T.call(C, void 0, I, t, this.state.context)),
              I
            );
          } finally {
            Ye(this, on, Dn).call(this, { type: "error", error: I });
          }
        } finally {
          k(this, rt).runNext(this);
        }
      }
    }),
    (rn = new WeakMap()),
    (rt = new WeakMap()),
    (Mr = new WeakMap()),
    (on = new WeakSet()),
    (Dn = function (t) {
      const n = (r) => {
        switch (t.type) {
          case "failed":
            return {
              ...r,
              failureCount: t.failureCount,
              failureReason: t.error,
            };
          case "pause":
            return { ...r, isPaused: !0 };
          case "continue":
            return { ...r, isPaused: !1 };
          case "pending":
            return {
              ...r,
              context: t.context,
              data: void 0,
              failureCount: 0,
              failureReason: null,
              error: null,
              isPaused: t.isPaused,
              status: "pending",
              variables: t.variables,
              submittedAt: Date.now(),
            };
          case "success":
            return {
              ...r,
              data: t.data,
              failureCount: 0,
              failureReason: null,
              error: null,
              status: "success",
              isPaused: !1,
            };
          case "error":
            return {
              ...r,
              data: void 0,
              error: t.error,
              failureCount: r.failureCount + 1,
              failureReason: t.error,
              isPaused: !1,
              status: "error",
            };
        }
      };
      ((this.state = n(this.state)),
        st.batch(() => {
          (k(this, rn).forEach((r) => {
            r.onMutationUpdate(t);
          }),
            k(this, rt).notify({ mutation: this, type: "updated", action: t }));
        }));
    }),
    Th);
function sC() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: !1,
    status: "idle",
    variables: void 0,
    submittedAt: 0,
  };
}
var gn,
  Vt,
  li,
  Rh,
  iC =
    ((Rh = class extends vl {
      constructor(t = {}) {
        super();
        ce(this, gn);
        ce(this, Vt);
        ce(this, li);
        ((this.config = t),
          G(this, gn, new Set()),
          G(this, Vt, new Map()),
          G(this, li, 0));
      }
      build(t, n, r) {
        const o = new oC({
          mutationCache: this,
          mutationId: ++yi(this, li)._,
          options: t.defaultMutationOptions(n),
          state: r,
        });
        return (this.add(o), o);
      }
      add(t) {
        k(this, gn).add(t);
        const n = $i(t);
        if (typeof n == "string") {
          const r = k(this, Vt).get(n);
          r ? r.push(t) : k(this, Vt).set(n, [t]);
        }
        this.notify({ type: "added", mutation: t });
      }
      remove(t) {
        if (k(this, gn).delete(t)) {
          const n = $i(t);
          if (typeof n == "string") {
            const r = k(this, Vt).get(n);
            if (r)
              if (r.length > 1) {
                const o = r.indexOf(t);
                o !== -1 && r.splice(o, 1);
              } else r[0] === t && k(this, Vt).delete(n);
          }
        }
        this.notify({ type: "removed", mutation: t });
      }
      canRun(t) {
        const n = $i(t);
        if (typeof n == "string") {
          const r = k(this, Vt).get(n),
            o =
              r == null ? void 0 : r.find((s) => s.state.status === "pending");
          return !o || o === t;
        } else return !0;
      }
      runNext(t) {
        var r;
        const n = $i(t);
        if (typeof n == "string") {
          const o =
            (r = k(this, Vt).get(n)) == null
              ? void 0
              : r.find((s) => s !== t && s.state.isPaused);
          return (o == null ? void 0 : o.continue()) ?? Promise.resolve();
        } else return Promise.resolve();
      }
      clear() {
        st.batch(() => {
          (k(this, gn).forEach((t) => {
            this.notify({ type: "removed", mutation: t });
          }),
            k(this, gn).clear(),
            k(this, Vt).clear());
        });
      }
      getAll() {
        return Array.from(k(this, gn));
      }
      find(t) {
        const n = { exact: !0, ...t };
        return this.getAll().find((r) => Yp(n, r));
      }
      findAll(t = {}) {
        return this.getAll().filter((n) => Yp(t, n));
      }
      notify(t) {
        st.batch(() => {
          this.listeners.forEach((n) => {
            n(t);
          });
        });
      }
      resumePausedMutations() {
        const t = this.getAll().filter((n) => n.state.isPaused);
        return st.batch(() =>
          Promise.all(t.map((n) => n.continue().catch(Ut))),
        );
      }
    }),
    (gn = new WeakMap()),
    (Vt = new WeakMap()),
    (li = new WeakMap()),
    Rh);
function $i(e) {
  var t;
  return (t = e.options.scope) == null ? void 0 : t.id;
}
function Zp(e) {
  return {
    onFetch: (t, n) => {
      var d, p, m, g, S;
      const r = t.options,
        o =
          (m =
            (p = (d = t.fetchOptions) == null ? void 0 : d.meta) == null
              ? void 0
              : p.fetchMore) == null
            ? void 0
            : m.direction,
        s = ((g = t.state.data) == null ? void 0 : g.pages) || [],
        a = ((S = t.state.data) == null ? void 0 : S.pageParams) || [];
      let l = { pages: [], pageParams: [] },
        c = 0;
      const u = async () => {
        let h = !1;
        const w = (x) => {
            Object.defineProperty(x, "signal", {
              enumerable: !0,
              get: () => (
                t.signal.aborted
                  ? (h = !0)
                  : t.signal.addEventListener("abort", () => {
                      h = !0;
                    }),
                t.signal
              ),
            });
          },
          y = hy(t.options, t.fetchOptions),
          v = async (x, j, b) => {
            if (h) return Promise.reject();
            if (j == null && x.pages.length) return Promise.resolve(x);
            const C = (() => {
                const $ = {
                  client: t.client,
                  queryKey: t.queryKey,
                  pageParam: j,
                  direction: b ? "backward" : "forward",
                  meta: t.options.meta,
                };
                return (w($), $);
              })(),
              T = await y(C),
              { maxPages: I } = t.options,
              O = b ? QN : KN;
            return {
              pages: O(x.pages, T, I),
              pageParams: O(x.pageParams, j, I),
            };
          };
        if (o && s.length) {
          const x = o === "backward",
            j = x ? aC : eh,
            b = { pages: s, pageParams: a },
            N = j(r, b);
          l = await v(b, N, x);
        } else {
          const x = e ?? s.length;
          do {
            const j = c === 0 ? (a[0] ?? r.initialPageParam) : eh(r, l);
            if (c > 0 && j == null) break;
            ((l = await v(l, j)), c++);
          } while (c < x);
        }
        return l;
      };
      t.options.persister
        ? (t.fetchFn = () => {
            var h, w;
            return (w = (h = t.options).persister) == null
              ? void 0
              : w.call(
                  h,
                  u,
                  {
                    client: t.client,
                    queryKey: t.queryKey,
                    meta: t.options.meta,
                    signal: t.signal,
                  },
                  n,
                );
          })
        : (t.fetchFn = u);
    },
  };
}
function eh(e, { pages: t, pageParams: n }) {
  const r = t.length - 1;
  return t.length > 0 ? e.getNextPageParam(t[r], t, n[r], n) : void 0;
}
function aC(e, { pages: t, pageParams: n }) {
  var r;
  return t.length > 0
    ? (r = e.getPreviousPageParam) == null
      ? void 0
      : r.call(e, t[0], t, n[0], n)
    : void 0;
}
var Oe,
  Wn,
  Hn,
  Io,
  Oo,
  Kn,
  Mo,
  _o,
  Ah,
  lC =
    ((Ah = class {
      constructor(e = {}) {
        ce(this, Oe);
        ce(this, Wn);
        ce(this, Hn);
        ce(this, Io);
        ce(this, Oo);
        ce(this, Kn);
        ce(this, Mo);
        ce(this, _o);
        (G(this, Oe, e.queryCache || new rC()),
          G(this, Wn, e.mutationCache || new iC()),
          G(this, Hn, e.defaultOptions || {}),
          G(this, Io, new Map()),
          G(this, Oo, new Map()),
          G(this, Kn, 0));
      }
      mount() {
        (yi(this, Kn)._++,
          k(this, Kn) === 1 &&
            (G(
              this,
              Mo,
              my.subscribe(async (e) => {
                e &&
                  (await this.resumePausedMutations(), k(this, Oe).onFocus());
              }),
            ),
            G(
              this,
              _o,
              za.subscribe(async (e) => {
                e &&
                  (await this.resumePausedMutations(), k(this, Oe).onOnline());
              }),
            )));
      }
      unmount() {
        var e, t;
        (yi(this, Kn)._--,
          k(this, Kn) === 0 &&
            ((e = k(this, Mo)) == null || e.call(this),
            G(this, Mo, void 0),
            (t = k(this, _o)) == null || t.call(this),
            G(this, _o, void 0)));
      }
      isFetching(e) {
        return k(this, Oe).findAll({ ...e, fetchStatus: "fetching" }).length;
      }
      isMutating(e) {
        return k(this, Wn).findAll({ ...e, status: "pending" }).length;
      }
      getQueryData(e) {
        var n;
        const t = this.defaultQueryOptions({ queryKey: e });
        return (n = k(this, Oe).get(t.queryHash)) == null
          ? void 0
          : n.state.data;
      }
      ensureQueryData(e) {
        const t = this.defaultQueryOptions(e),
          n = k(this, Oe).build(this, t),
          r = n.state.data;
        return r === void 0
          ? this.fetchQuery(e)
          : (e.revalidateIfStale &&
              n.isStaleByTime(wu(t.staleTime, n)) &&
              this.prefetchQuery(t),
            Promise.resolve(r));
      }
      getQueriesData(e) {
        return k(this, Oe)
          .findAll(e)
          .map(({ queryKey: t, state: n }) => {
            const r = n.data;
            return [t, r];
          });
      }
      setQueryData(e, t, n) {
        const r = this.defaultQueryOptions({ queryKey: e }),
          o = k(this, Oe).get(r.queryHash),
          s = o == null ? void 0 : o.state.data,
          a = $N(t, s);
        if (a !== void 0)
          return k(this, Oe)
            .build(this, r)
            .setData(a, { ...n, manual: !0 });
      }
      setQueriesData(e, t, n) {
        return st.batch(() =>
          k(this, Oe)
            .findAll(e)
            .map(({ queryKey: r }) => [r, this.setQueryData(r, t, n)]),
        );
      }
      getQueryState(e) {
        var n;
        const t = this.defaultQueryOptions({ queryKey: e });
        return (n = k(this, Oe).get(t.queryHash)) == null ? void 0 : n.state;
      }
      removeQueries(e) {
        const t = k(this, Oe);
        st.batch(() => {
          t.findAll(e).forEach((n) => {
            t.remove(n);
          });
        });
      }
      resetQueries(e, t) {
        const n = k(this, Oe);
        return st.batch(
          () => (
            n.findAll(e).forEach((r) => {
              r.reset();
            }),
            this.refetchQueries({ type: "active", ...e }, t)
          ),
        );
      }
      cancelQueries(e, t = {}) {
        const n = { revert: !0, ...t },
          r = st.batch(() =>
            k(this, Oe)
              .findAll(e)
              .map((o) => o.cancel(n)),
          );
        return Promise.all(r).then(Ut).catch(Ut);
      }
      invalidateQueries(e, t = {}) {
        return st.batch(
          () => (
            k(this, Oe)
              .findAll(e)
              .forEach((n) => {
                n.invalidate();
              }),
            (e == null ? void 0 : e.refetchType) === "none"
              ? Promise.resolve()
              : this.refetchQueries(
                  {
                    ...e,
                    type:
                      (e == null ? void 0 : e.refetchType) ??
                      (e == null ? void 0 : e.type) ??
                      "active",
                  },
                  t,
                )
          ),
        );
      }
      refetchQueries(e, t = {}) {
        const n = { ...t, cancelRefetch: t.cancelRefetch ?? !0 },
          r = st.batch(() =>
            k(this, Oe)
              .findAll(e)
              .filter((o) => !o.isDisabled() && !o.isStatic())
              .map((o) => {
                let s = o.fetch(void 0, n);
                return (
                  n.throwOnError || (s = s.catch(Ut)),
                  o.state.fetchStatus === "paused" ? Promise.resolve() : s
                );
              }),
          );
        return Promise.all(r).then(Ut);
      }
      fetchQuery(e) {
        const t = this.defaultQueryOptions(e);
        t.retry === void 0 && (t.retry = !1);
        const n = k(this, Oe).build(this, t);
        return n.isStaleByTime(wu(t.staleTime, n))
          ? n.fetch(t)
          : Promise.resolve(n.state.data);
      }
      prefetchQuery(e) {
        return this.fetchQuery(e).then(Ut).catch(Ut);
      }
      fetchInfiniteQuery(e) {
        return ((e.behavior = Zp(e.pages)), this.fetchQuery(e));
      }
      prefetchInfiniteQuery(e) {
        return this.fetchInfiniteQuery(e).then(Ut).catch(Ut);
      }
      ensureInfiniteQueryData(e) {
        return ((e.behavior = Zp(e.pages)), this.ensureQueryData(e));
      }
      resumePausedMutations() {
        return za.isOnline()
          ? k(this, Wn).resumePausedMutations()
          : Promise.resolve();
      }
      getQueryCache() {
        return k(this, Oe);
      }
      getMutationCache() {
        return k(this, Wn);
      }
      getDefaultOptions() {
        return k(this, Hn);
      }
      setDefaultOptions(e) {
        G(this, Hn, e);
      }
      setQueryDefaults(e, t) {
        k(this, Io).set(ti(e), { queryKey: e, defaultOptions: t });
      }
      getQueryDefaults(e) {
        const t = [...k(this, Io).values()],
          n = {};
        return (
          t.forEach((r) => {
            ni(e, r.queryKey) && Object.assign(n, r.defaultOptions);
          }),
          n
        );
      }
      setMutationDefaults(e, t) {
        k(this, Oo).set(ti(e), { mutationKey: e, defaultOptions: t });
      }
      getMutationDefaults(e) {
        const t = [...k(this, Oo).values()],
          n = {};
        return (
          t.forEach((r) => {
            ni(e, r.mutationKey) && Object.assign(n, r.defaultOptions);
          }),
          n
        );
      }
      defaultQueryOptions(e) {
        if (e._defaulted) return e;
        const t = {
          ...k(this, Hn).queries,
          ...this.getQueryDefaults(e.queryKey),
          ...e,
          _defaulted: !0,
        };
        return (
          t.queryHash || (t.queryHash = Wd(t.queryKey, t)),
          t.refetchOnReconnect === void 0 &&
            (t.refetchOnReconnect = t.networkMode !== "always"),
          t.throwOnError === void 0 && (t.throwOnError = !!t.suspense),
          !t.networkMode && t.persister && (t.networkMode = "offlineFirst"),
          t.queryFn === Hd && (t.enabled = !1),
          t
        );
      }
      defaultMutationOptions(e) {
        return e != null && e._defaulted
          ? e
          : {
              ...k(this, Hn).mutations,
              ...((e == null ? void 0 : e.mutationKey) &&
                this.getMutationDefaults(e.mutationKey)),
              ...e,
              _defaulted: !0,
            };
      }
      clear() {
        (k(this, Oe).clear(), k(this, Wn).clear());
      }
    }),
    (Oe = new WeakMap()),
    (Wn = new WeakMap()),
    (Hn = new WeakMap()),
    (Io = new WeakMap()),
    (Oo = new WeakMap()),
    (Kn = new WeakMap()),
    (Mo = new WeakMap()),
    (_o = new WeakMap()),
    Ah),
  cC = f.createContext(void 0),
  uC = ({ client: e, children: t }) => (
    f.useEffect(
      () => (
        e.mount(),
        () => {
          e.unmount();
        }
      ),
      [e],
    ),
    i.jsx(cC.Provider, { value: e, children: t })
  );
/**
 * @remix-run/router v1.23.0
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function ri() {
  return (
    (ri = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    ri.apply(this, arguments)
  );
}
var Gn;
(function (e) {
  ((e.Pop = "POP"), (e.Push = "PUSH"), (e.Replace = "REPLACE"));
})(Gn || (Gn = {}));
const th = "popstate";
function dC(e) {
  e === void 0 && (e = {});
  function t(r, o) {
    let { pathname: s, search: a, hash: l } = r.location;
    return ju(
      "",
      { pathname: s, search: a, hash: l },
      (o.state && o.state.usr) || null,
      (o.state && o.state.key) || "default",
    );
  }
  function n(r, o) {
    return typeof o == "string" ? o : $a(o);
  }
  return pC(t, n, null, e);
}
function Fe(e, t) {
  if (e === !1 || e === null || typeof e > "u") throw new Error(t);
}
function wy(e, t) {
  if (!e) {
    typeof console < "u" && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function fC() {
  return Math.random().toString(36).substr(2, 8);
}
function nh(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function ju(e, t, n, r) {
  return (
    n === void 0 && (n = null),
    ri(
      { pathname: typeof e == "string" ? e : e.pathname, search: "", hash: "" },
      typeof t == "string" ? os(t) : t,
      { state: n, key: (t && t.key) || r || fC() },
    )
  );
}
function $a(e) {
  let { pathname: t = "/", search: n = "", hash: r = "" } = e;
  return (
    n && n !== "?" && (t += n.charAt(0) === "?" ? n : "?" + n),
    r && r !== "#" && (t += r.charAt(0) === "#" ? r : "#" + r),
    t
  );
}
function os(e) {
  let t = {};
  if (e) {
    let n = e.indexOf("#");
    n >= 0 && ((t.hash = e.substr(n)), (e = e.substr(0, n)));
    let r = e.indexOf("?");
    (r >= 0 && ((t.search = e.substr(r)), (e = e.substr(0, r))),
      e && (t.pathname = e));
  }
  return t;
}
function pC(e, t, n, r) {
  r === void 0 && (r = {});
  let { window: o = document.defaultView, v5Compat: s = !1 } = r,
    a = o.history,
    l = Gn.Pop,
    c = null,
    u = d();
  u == null && ((u = 0), a.replaceState(ri({}, a.state, { idx: u }), ""));
  function d() {
    return (a.state || { idx: null }).idx;
  }
  function p() {
    l = Gn.Pop;
    let w = d(),
      y = w == null ? null : w - u;
    ((u = w), c && c({ action: l, location: h.location, delta: y }));
  }
  function m(w, y) {
    l = Gn.Push;
    let v = ju(h.location, w, y);
    u = d() + 1;
    let x = nh(v, u),
      j = h.createHref(v);
    try {
      a.pushState(x, "", j);
    } catch (b) {
      if (b instanceof DOMException && b.name === "DataCloneError") throw b;
      o.location.assign(j);
    }
    s && c && c({ action: l, location: h.location, delta: 1 });
  }
  function g(w, y) {
    l = Gn.Replace;
    let v = ju(h.location, w, y);
    u = d();
    let x = nh(v, u),
      j = h.createHref(v);
    (a.replaceState(x, "", j),
      s && c && c({ action: l, location: h.location, delta: 0 }));
  }
  function S(w) {
    let y = o.location.origin !== "null" ? o.location.origin : o.location.href,
      v = typeof w == "string" ? w : $a(w);
    return (
      (v = v.replace(/ $/, "%20")),
      Fe(
        y,
        "No window.location.(origin|href) available to create URL for href: " +
          v,
      ),
      new URL(v, y)
    );
  }
  let h = {
    get action() {
      return l;
    },
    get location() {
      return e(o, a);
    },
    listen(w) {
      if (c) throw new Error("A history only accepts one active listener");
      return (
        o.addEventListener(th, p),
        (c = w),
        () => {
          (o.removeEventListener(th, p), (c = null));
        }
      );
    },
    createHref(w) {
      return t(o, w);
    },
    createURL: S,
    encodeLocation(w) {
      let y = S(w);
      return { pathname: y.pathname, search: y.search, hash: y.hash };
    },
    push: m,
    replace: g,
    go(w) {
      return a.go(w);
    },
  };
  return h;
}
var rh;
(function (e) {
  ((e.data = "data"),
    (e.deferred = "deferred"),
    (e.redirect = "redirect"),
    (e.error = "error"));
})(rh || (rh = {}));
function hC(e, t, n) {
  return (n === void 0 && (n = "/"), mC(e, t, n, !1));
}
function mC(e, t, n, r) {
  let o = typeof t == "string" ? os(t) : t,
    s = Kd(o.pathname || "/", n);
  if (s == null) return null;
  let a = Sy(e);
  gC(a);
  let l = null;
  for (let c = 0; l == null && c < a.length; ++c) {
    let u = kC(s);
    l = CC(a[c], u, r);
  }
  return l;
}
function Sy(e, t, n, r) {
  (t === void 0 && (t = []),
    n === void 0 && (n = []),
    r === void 0 && (r = ""));
  let o = (s, a, l) => {
    let c = {
      relativePath: l === void 0 ? s.path || "" : l,
      caseSensitive: s.caseSensitive === !0,
      childrenIndex: a,
      route: s,
    };
    c.relativePath.startsWith("/") &&
      (Fe(
        c.relativePath.startsWith(r),
        'Absolute route path "' +
          c.relativePath +
          '" nested under path ' +
          ('"' + r + '" is not valid. An absolute child route path ') +
          "must start with the combined path of all its parent routes.",
      ),
      (c.relativePath = c.relativePath.slice(r.length)));
    let u = or([r, c.relativePath]),
      d = n.concat(c);
    (s.children &&
      s.children.length > 0 &&
      (Fe(
        s.index !== !0,
        "Index routes must not have child routes. Please remove " +
          ('all child routes from route path "' + u + '".'),
      ),
      Sy(s.children, t, d, u)),
      !(s.path == null && !s.index) &&
        t.push({ path: u, score: bC(u, s.index), routesMeta: d }));
  };
  return (
    e.forEach((s, a) => {
      var l;
      if (s.path === "" || !((l = s.path) != null && l.includes("?"))) o(s, a);
      else for (let c of jy(s.path)) o(s, a, c);
    }),
    t
  );
}
function jy(e) {
  let t = e.split("/");
  if (t.length === 0) return [];
  let [n, ...r] = t,
    o = n.endsWith("?"),
    s = n.replace(/\?$/, "");
  if (r.length === 0) return o ? [s, ""] : [s];
  let a = jy(r.join("/")),
    l = [];
  return (
    l.push(...a.map((c) => (c === "" ? s : [s, c].join("/")))),
    o && l.push(...a),
    l.map((c) => (e.startsWith("/") && c === "" ? "/" : c))
  );
}
function gC(e) {
  e.sort((t, n) =>
    t.score !== n.score
      ? n.score - t.score
      : NC(
          t.routesMeta.map((r) => r.childrenIndex),
          n.routesMeta.map((r) => r.childrenIndex),
        ),
  );
}
const vC = /^:[\w-]+$/,
  yC = 3,
  xC = 2,
  wC = 1,
  SC = 10,
  jC = -2,
  oh = (e) => e === "*";
function bC(e, t) {
  let n = e.split("/"),
    r = n.length;
  return (
    n.some(oh) && (r += jC),
    t && (r += xC),
    n
      .filter((o) => !oh(o))
      .reduce((o, s) => o + (vC.test(s) ? yC : s === "" ? wC : SC), r)
  );
}
function NC(e, t) {
  return e.length === t.length && e.slice(0, -1).every((r, o) => r === t[o])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function CC(e, t, n) {
  let { routesMeta: r } = e,
    o = {},
    s = "/",
    a = [];
  for (let l = 0; l < r.length; ++l) {
    let c = r[l],
      u = l === r.length - 1,
      d = s === "/" ? t : t.slice(s.length) || "/",
      p = sh(
        { path: c.relativePath, caseSensitive: c.caseSensitive, end: u },
        d,
      ),
      m = c.route;
    if (
      (!p &&
        u &&
        n &&
        !r[r.length - 1].route.index &&
        (p = sh(
          { path: c.relativePath, caseSensitive: c.caseSensitive, end: !1 },
          d,
        )),
      !p)
    )
      return null;
    (Object.assign(o, p.params),
      a.push({
        params: o,
        pathname: or([s, p.pathname]),
        pathnameBase: AC(or([s, p.pathnameBase])),
        route: m,
      }),
      p.pathnameBase !== "/" && (s = or([s, p.pathnameBase])));
  }
  return a;
}
function sh(e, t) {
  typeof e == "string" && (e = { path: e, caseSensitive: !1, end: !0 });
  let [n, r] = EC(e.path, e.caseSensitive, e.end),
    o = t.match(n);
  if (!o) return null;
  let s = o[0],
    a = s.replace(/(.)\/+$/, "$1"),
    l = o.slice(1);
  return {
    params: r.reduce((u, d, p) => {
      let { paramName: m, isOptional: g } = d;
      if (m === "*") {
        let h = l[p] || "";
        a = s.slice(0, s.length - h.length).replace(/(.)\/+$/, "$1");
      }
      const S = l[p];
      return (
        g && !S ? (u[m] = void 0) : (u[m] = (S || "").replace(/%2F/g, "/")),
        u
      );
    }, {}),
    pathname: s,
    pathnameBase: a,
    pattern: e,
  };
}
function EC(e, t, n) {
  (t === void 0 && (t = !1),
    n === void 0 && (n = !0),
    wy(
      e === "*" || !e.endsWith("*") || e.endsWith("/*"),
      'Route path "' +
        e +
        '" will be treated as if it were ' +
        ('"' + e.replace(/\*$/, "/*") + '" because the `*` character must ') +
        "always follow a `/` in the pattern. To get rid of this warning, " +
        ('please change the route path to "' + e.replace(/\*$/, "/*") + '".'),
    ));
  let r = [],
    o =
      "^" +
      e
        .replace(/\/*\*?$/, "")
        .replace(/^\/*/, "/")
        .replace(/[\\.*+^${}|()[\]]/g, "\\$&")
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (a, l, c) => (
            r.push({ paramName: l, isOptional: c != null }),
            c ? "/?([^\\/]+)?" : "/([^\\/]+)"
          ),
        );
  return (
    e.endsWith("*")
      ? (r.push({ paramName: "*" }),
        (o += e === "*" || e === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$"))
      : n
        ? (o += "\\/*$")
        : e !== "" && e !== "/" && (o += "(?:(?=\\/|$))"),
    [new RegExp(o, t ? void 0 : "i"), r]
  );
}
function kC(e) {
  try {
    return e
      .split("/")
      .map((t) => decodeURIComponent(t).replace(/\//g, "%2F"))
      .join("/");
  } catch (t) {
    return (
      wy(
        !1,
        'The URL path "' +
          e +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ("encoding (" + t + ")."),
      ),
      e
    );
  }
}
function Kd(e, t) {
  if (t === "/") return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let n = t.endsWith("/") ? t.length - 1 : t.length,
    r = e.charAt(n);
  return r && r !== "/" ? null : e.slice(n) || "/";
}
function PC(e, t) {
  t === void 0 && (t = "/");
  let {
    pathname: n,
    search: r = "",
    hash: o = "",
  } = typeof e == "string" ? os(e) : e;
  return {
    pathname: n ? (n.startsWith("/") ? n : TC(n, t)) : t,
    search: IC(r),
    hash: OC(o),
  };
}
function TC(e, t) {
  let n = t.replace(/\/+$/, "").split("/");
  return (
    e.split("/").forEach((o) => {
      o === ".." ? n.length > 1 && n.pop() : o !== "." && n.push(o);
    }),
    n.length > 1 ? n.join("/") : "/"
  );
}
function lc(e, t, n, r) {
  return (
    "Cannot include a '" +
    e +
    "' character in a manually specified " +
    ("`to." +
      t +
      "` field [" +
      JSON.stringify(r) +
      "].  Please separate it out to the ") +
    ("`to." + n + "` field. Alternatively you may provide the full path as ") +
    'a string in <Link to="..."> and the router will parse it for you.'
  );
}
function RC(e) {
  return e.filter(
    (t, n) => n === 0 || (t.route.path && t.route.path.length > 0),
  );
}
function Qd(e, t) {
  let n = RC(e);
  return t
    ? n.map((r, o) => (o === n.length - 1 ? r.pathname : r.pathnameBase))
    : n.map((r) => r.pathnameBase);
}
function qd(e, t, n, r) {
  r === void 0 && (r = !1);
  let o;
  typeof e == "string"
    ? (o = os(e))
    : ((o = ri({}, e)),
      Fe(
        !o.pathname || !o.pathname.includes("?"),
        lc("?", "pathname", "search", o),
      ),
      Fe(
        !o.pathname || !o.pathname.includes("#"),
        lc("#", "pathname", "hash", o),
      ),
      Fe(!o.search || !o.search.includes("#"), lc("#", "search", "hash", o)));
  let s = e === "" || o.pathname === "",
    a = s ? "/" : o.pathname,
    l;
  if (a == null) l = n;
  else {
    let p = t.length - 1;
    if (!r && a.startsWith("..")) {
      let m = a.split("/");
      for (; m[0] === "..";) (m.shift(), (p -= 1));
      o.pathname = m.join("/");
    }
    l = p >= 0 ? t[p] : "/";
  }
  let c = PC(o, l),
    u = a && a !== "/" && a.endsWith("/"),
    d = (s || a === ".") && n.endsWith("/");
  return (!c.pathname.endsWith("/") && (u || d) && (c.pathname += "/"), c);
}
const or = (e) => e.join("/").replace(/\/\/+/g, "/"),
  AC = (e) => e.replace(/\/+$/, "").replace(/^\/*/, "/"),
  IC = (e) => (!e || e === "?" ? "" : e.startsWith("?") ? e : "?" + e),
  OC = (e) => (!e || e === "#" ? "" : e.startsWith("#") ? e : "#" + e);
function MC(e) {
  return (
    e != null &&
    typeof e.status == "number" &&
    typeof e.statusText == "string" &&
    typeof e.internal == "boolean" &&
    "data" in e
  );
}
const by = ["post", "put", "patch", "delete"];
new Set(by);
const _C = ["get", ...by];
new Set(_C);
/**
 * React Router v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function oi() {
  return (
    (oi = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    oi.apply(this, arguments)
  );
}
const Gd = f.createContext(null),
  DC = f.createContext(null),
  hr = f.createContext(null),
  xl = f.createContext(null),
  Pn = f.createContext({ outlet: null, matches: [], isDataRoute: !1 }),
  Ny = f.createContext(null);
function LC(e, t) {
  let { relative: n } = t === void 0 ? {} : t;
  ss() || Fe(!1);
  let { basename: r, navigator: o } = f.useContext(hr),
    { hash: s, pathname: a, search: l } = Ey(e, { relative: n }),
    c = a;
  return (
    r !== "/" && (c = a === "/" ? r : or([r, a])),
    o.createHref({ pathname: c, search: l, hash: s })
  );
}
function ss() {
  return f.useContext(xl) != null;
}
function Yr() {
  return (ss() || Fe(!1), f.useContext(xl).location);
}
function Cy(e) {
  f.useContext(hr).static || f.useLayoutEffect(e);
}
function ze() {
  let { isDataRoute: e } = f.useContext(Pn);
  return e ? YC() : FC();
}
function FC() {
  ss() || Fe(!1);
  let e = f.useContext(Gd),
    { basename: t, future: n, navigator: r } = f.useContext(hr),
    { matches: o } = f.useContext(Pn),
    { pathname: s } = Yr(),
    a = JSON.stringify(Qd(o, n.v7_relativeSplatPath)),
    l = f.useRef(!1);
  return (
    Cy(() => {
      l.current = !0;
    }),
    f.useCallback(
      function (u, d) {
        if ((d === void 0 && (d = {}), !l.current)) return;
        if (typeof u == "number") {
          r.go(u);
          return;
        }
        let p = qd(u, JSON.parse(a), s, d.relative === "path");
        (e == null &&
          t !== "/" &&
          (p.pathname = p.pathname === "/" ? t : or([t, p.pathname])),
          (d.replace ? r.replace : r.push)(p, d.state, d));
      },
      [t, r, a, s, e],
    )
  );
}
function Yd() {
  let { matches: e } = f.useContext(Pn),
    t = e[e.length - 1];
  return t ? t.params : {};
}
function Ey(e, t) {
  let { relative: n } = t === void 0 ? {} : t,
    { future: r } = f.useContext(hr),
    { matches: o } = f.useContext(Pn),
    { pathname: s } = Yr(),
    a = JSON.stringify(Qd(o, r.v7_relativeSplatPath));
  return f.useMemo(() => qd(e, JSON.parse(a), s, n === "path"), [e, a, s, n]);
}
function zC(e, t) {
  return $C(e, t);
}
function $C(e, t, n, r) {
  ss() || Fe(!1);
  let { navigator: o } = f.useContext(hr),
    { matches: s } = f.useContext(Pn),
    a = s[s.length - 1],
    l = a ? a.params : {};
  a && a.pathname;
  let c = a ? a.pathnameBase : "/";
  a && a.route;
  let u = Yr(),
    d;
  if (t) {
    var p;
    let w = typeof t == "string" ? os(t) : t;
    (c === "/" || ((p = w.pathname) != null && p.startsWith(c)) || Fe(!1),
      (d = w));
  } else d = u;
  let m = d.pathname || "/",
    g = m;
  if (c !== "/") {
    let w = c.replace(/^\//, "").split("/");
    g = "/" + m.replace(/^\//, "").split("/").slice(w.length).join("/");
  }
  let S = hC(e, { pathname: g }),
    h = HC(
      S &&
        S.map((w) =>
          Object.assign({}, w, {
            params: Object.assign({}, l, w.params),
            pathname: or([
              c,
              o.encodeLocation
                ? o.encodeLocation(w.pathname).pathname
                : w.pathname,
            ]),
            pathnameBase:
              w.pathnameBase === "/"
                ? c
                : or([
                    c,
                    o.encodeLocation
                      ? o.encodeLocation(w.pathnameBase).pathname
                      : w.pathnameBase,
                  ]),
          }),
        ),
      s,
      n,
      r,
    );
  return t && h
    ? f.createElement(
        xl.Provider,
        {
          value: {
            location: oi(
              {
                pathname: "/",
                search: "",
                hash: "",
                state: null,
                key: "default",
              },
              d,
            ),
            navigationType: Gn.Pop,
          },
        },
        h,
      )
    : h;
}
function UC() {
  let e = GC(),
    t = MC(e)
      ? e.status + " " + e.statusText
      : e instanceof Error
        ? e.message
        : JSON.stringify(e),
    n = e instanceof Error ? e.stack : null,
    o = { padding: "0.5rem", backgroundColor: "rgba(200,200,200, 0.5)" };
  return f.createElement(
    f.Fragment,
    null,
    f.createElement("h2", null, "Unexpected Application Error!"),
    f.createElement("h3", { style: { fontStyle: "italic" } }, t),
    n ? f.createElement("pre", { style: o }, n) : null,
    null,
  );
}
const BC = f.createElement(UC, null);
class VC extends f.Component {
  constructor(t) {
    (super(t),
      (this.state = {
        location: t.location,
        revalidation: t.revalidation,
        error: t.error,
      }));
  }
  static getDerivedStateFromError(t) {
    return { error: t };
  }
  static getDerivedStateFromProps(t, n) {
    return n.location !== t.location ||
      (n.revalidation !== "idle" && t.revalidation === "idle")
      ? { error: t.error, location: t.location, revalidation: t.revalidation }
      : {
          error: t.error !== void 0 ? t.error : n.error,
          location: n.location,
          revalidation: t.revalidation || n.revalidation,
        };
  }
  componentDidCatch(t, n) {
    console.error(
      "React Router caught the following error during render",
      t,
      n,
    );
  }
  render() {
    return this.state.error !== void 0
      ? f.createElement(
          Pn.Provider,
          { value: this.props.routeContext },
          f.createElement(Ny.Provider, {
            value: this.state.error,
            children: this.props.component,
          }),
        )
      : this.props.children;
  }
}
function WC(e) {
  let { routeContext: t, match: n, children: r } = e,
    o = f.useContext(Gd);
  return (
    o &&
      o.static &&
      o.staticContext &&
      (n.route.errorElement || n.route.ErrorBoundary) &&
      (o.staticContext._deepestRenderedBoundaryId = n.route.id),
    f.createElement(Pn.Provider, { value: t }, r)
  );
}
function HC(e, t, n, r) {
  var o;
  if (
    (t === void 0 && (t = []),
    n === void 0 && (n = null),
    r === void 0 && (r = null),
    e == null)
  ) {
    var s;
    if (!n) return null;
    if (n.errors) e = n.matches;
    else if (
      (s = r) != null &&
      s.v7_partialHydration &&
      t.length === 0 &&
      !n.initialized &&
      n.matches.length > 0
    )
      e = n.matches;
    else return null;
  }
  let a = e,
    l = (o = n) == null ? void 0 : o.errors;
  if (l != null) {
    let d = a.findIndex(
      (p) => p.route.id && (l == null ? void 0 : l[p.route.id]) !== void 0,
    );
    (d >= 0 || Fe(!1), (a = a.slice(0, Math.min(a.length, d + 1))));
  }
  let c = !1,
    u = -1;
  if (n && r && r.v7_partialHydration)
    for (let d = 0; d < a.length; d++) {
      let p = a[d];
      if (
        ((p.route.HydrateFallback || p.route.hydrateFallbackElement) && (u = d),
        p.route.id)
      ) {
        let { loaderData: m, errors: g } = n,
          S =
            p.route.loader &&
            m[p.route.id] === void 0 &&
            (!g || g[p.route.id] === void 0);
        if (p.route.lazy || S) {
          ((c = !0), u >= 0 ? (a = a.slice(0, u + 1)) : (a = [a[0]]));
          break;
        }
      }
    }
  return a.reduceRight((d, p, m) => {
    let g,
      S = !1,
      h = null,
      w = null;
    n &&
      ((g = l && p.route.id ? l[p.route.id] : void 0),
      (h = p.route.errorElement || BC),
      c &&
        (u < 0 && m === 0
          ? ((S = !0), (w = null))
          : u === m &&
            ((S = !0), (w = p.route.hydrateFallbackElement || null))));
    let y = t.concat(a.slice(0, m + 1)),
      v = () => {
        let x;
        return (
          g
            ? (x = h)
            : S
              ? (x = w)
              : p.route.Component
                ? (x = f.createElement(p.route.Component, null))
                : p.route.element
                  ? (x = p.route.element)
                  : (x = d),
          f.createElement(WC, {
            match: p,
            routeContext: { outlet: d, matches: y, isDataRoute: n != null },
            children: x,
          })
        );
      };
    return n && (p.route.ErrorBoundary || p.route.errorElement || m === 0)
      ? f.createElement(VC, {
          location: n.location,
          revalidation: n.revalidation,
          component: h,
          error: g,
          children: v(),
          routeContext: { outlet: null, matches: y, isDataRoute: !0 },
        })
      : v();
  }, null);
}
var ky = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      e
    );
  })(ky || {}),
  Ua = (function (e) {
    return (
      (e.UseBlocker = "useBlocker"),
      (e.UseLoaderData = "useLoaderData"),
      (e.UseActionData = "useActionData"),
      (e.UseRouteError = "useRouteError"),
      (e.UseNavigation = "useNavigation"),
      (e.UseRouteLoaderData = "useRouteLoaderData"),
      (e.UseMatches = "useMatches"),
      (e.UseRevalidator = "useRevalidator"),
      (e.UseNavigateStable = "useNavigate"),
      (e.UseRouteId = "useRouteId"),
      e
    );
  })(Ua || {});
function KC(e) {
  let t = f.useContext(Gd);
  return (t || Fe(!1), t);
}
function QC(e) {
  let t = f.useContext(DC);
  return (t || Fe(!1), t);
}
function qC(e) {
  let t = f.useContext(Pn);
  return (t || Fe(!1), t);
}
function Py(e) {
  let t = qC(),
    n = t.matches[t.matches.length - 1];
  return (n.route.id || Fe(!1), n.route.id);
}
function GC() {
  var e;
  let t = f.useContext(Ny),
    n = QC(Ua.UseRouteError),
    r = Py(Ua.UseRouteError);
  return t !== void 0 ? t : (e = n.errors) == null ? void 0 : e[r];
}
function YC() {
  let { router: e } = KC(ky.UseNavigateStable),
    t = Py(Ua.UseNavigateStable),
    n = f.useRef(!1);
  return (
    Cy(() => {
      n.current = !0;
    }),
    f.useCallback(
      function (o, s) {
        (s === void 0 && (s = {}),
          n.current &&
            (typeof o == "number"
              ? e.navigate(o)
              : e.navigate(o, oi({ fromRouteId: t }, s))));
      },
      [e, t],
    )
  );
}
function XC(e, t) {
  (e == null || e.v7_startTransition, e == null || e.v7_relativeSplatPath);
}
function ih(e) {
  let { to: t, replace: n, state: r, relative: o } = e;
  ss() || Fe(!1);
  let { future: s, static: a } = f.useContext(hr),
    { matches: l } = f.useContext(Pn),
    { pathname: c } = Yr(),
    u = ze(),
    d = qd(t, Qd(l, s.v7_relativeSplatPath), c, o === "path"),
    p = JSON.stringify(d);
  return (
    f.useEffect(
      () => u(JSON.parse(p), { replace: n, state: r, relative: o }),
      [u, p, o, n, r],
    ),
    null
  );
}
function De(e) {
  Fe(!1);
}
function JC(e) {
  let {
    basename: t = "/",
    children: n = null,
    location: r,
    navigationType: o = Gn.Pop,
    navigator: s,
    static: a = !1,
    future: l,
  } = e;
  ss() && Fe(!1);
  let c = t.replace(/^\/*/, "/"),
    u = f.useMemo(
      () => ({
        basename: c,
        navigator: s,
        static: a,
        future: oi({ v7_relativeSplatPath: !1 }, l),
      }),
      [c, l, s, a],
    );
  typeof r == "string" && (r = os(r));
  let {
      pathname: d = "/",
      search: p = "",
      hash: m = "",
      state: g = null,
      key: S = "default",
    } = r,
    h = f.useMemo(() => {
      let w = Kd(d, c);
      return w == null
        ? null
        : {
            location: { pathname: w, search: p, hash: m, state: g, key: S },
            navigationType: o,
          };
    }, [c, d, p, m, g, S, o]);
  return h == null
    ? null
    : f.createElement(
        hr.Provider,
        { value: u },
        f.createElement(xl.Provider, { children: n, value: h }),
      );
}
function ZC(e) {
  let { children: t, location: n } = e;
  return zC(bu(t), n);
}
new Promise(() => {});
function bu(e, t) {
  t === void 0 && (t = []);
  let n = [];
  return (
    f.Children.forEach(e, (r, o) => {
      if (!f.isValidElement(r)) return;
      let s = [...t, o];
      if (r.type === f.Fragment) {
        n.push.apply(n, bu(r.props.children, s));
        return;
      }
      (r.type !== De && Fe(!1), !r.props.index || !r.props.children || Fe(!1));
      let a = {
        id: r.props.id || s.join("-"),
        caseSensitive: r.props.caseSensitive,
        element: r.props.element,
        Component: r.props.Component,
        index: r.props.index,
        path: r.props.path,
        loader: r.props.loader,
        action: r.props.action,
        errorElement: r.props.errorElement,
        ErrorBoundary: r.props.ErrorBoundary,
        hasErrorBoundary:
          r.props.ErrorBoundary != null || r.props.errorElement != null,
        shouldRevalidate: r.props.shouldRevalidate,
        handle: r.props.handle,
        lazy: r.props.lazy,
      };
      (r.props.children && (a.children = bu(r.props.children, s)), n.push(a));
    }),
    n
  );
}
/**
 * React Router DOM v6.30.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */ function Nu() {
  return (
    (Nu = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n)
              Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
          }
          return e;
        }),
    Nu.apply(this, arguments)
  );
}
function eE(e, t) {
  if (e == null) return {};
  var n = {},
    r = Object.keys(e),
    o,
    s;
  for (s = 0; s < r.length; s++)
    ((o = r[s]), !(t.indexOf(o) >= 0) && (n[o] = e[o]));
  return n;
}
function tE(e) {
  return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function nE(e, t) {
  return e.button === 0 && (!t || t === "_self") && !tE(e);
}
function Cu(e) {
  return (
    e === void 0 && (e = ""),
    new URLSearchParams(
      typeof e == "string" || Array.isArray(e) || e instanceof URLSearchParams
        ? e
        : Object.keys(e).reduce((t, n) => {
            let r = e[n];
            return t.concat(Array.isArray(r) ? r.map((o) => [n, o]) : [[n, r]]);
          }, []),
    )
  );
}
function rE(e, t) {
  let n = Cu(e);
  return (
    t &&
      t.forEach((r, o) => {
        n.has(o) ||
          t.getAll(o).forEach((s) => {
            n.append(o, s);
          });
      }),
    n
  );
}
const oE = [
    "onClick",
    "relative",
    "reloadDocument",
    "replace",
    "state",
    "target",
    "to",
    "preventScrollReset",
    "viewTransition",
  ],
  sE = "6";
try {
  window.__reactRouterVersion = sE;
} catch {}
const iE = "startTransition",
  ah = Lu[iE];
function aE(e) {
  let { basename: t, children: n, future: r, window: o } = e,
    s = f.useRef();
  s.current == null && (s.current = dC({ window: o, v5Compat: !0 }));
  let a = s.current,
    [l, c] = f.useState({ action: a.action, location: a.location }),
    { v7_startTransition: u } = r || {},
    d = f.useCallback(
      (p) => {
        u && ah ? ah(() => c(p)) : c(p);
      },
      [c, u],
    );
  return (
    f.useLayoutEffect(() => a.listen(d), [a, d]),
    f.useEffect(() => XC(r), [r]),
    f.createElement(JC, {
      basename: t,
      children: n,
      location: l.location,
      navigationType: l.action,
      navigator: a,
      future: r,
    })
  );
}
const lE =
    typeof window < "u" &&
    typeof window.document < "u" &&
    typeof window.document.createElement < "u",
  cE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i,
  Ty = f.forwardRef(function (t, n) {
    let {
        onClick: r,
        relative: o,
        reloadDocument: s,
        replace: a,
        state: l,
        target: c,
        to: u,
        preventScrollReset: d,
        viewTransition: p,
      } = t,
      m = eE(t, oE),
      { basename: g } = f.useContext(hr),
      S,
      h = !1;
    if (typeof u == "string" && cE.test(u) && ((S = u), lE))
      try {
        let x = new URL(window.location.href),
          j = u.startsWith("//") ? new URL(x.protocol + u) : new URL(u),
          b = Kd(j.pathname, g);
        j.origin === x.origin && b != null
          ? (u = b + j.search + j.hash)
          : (h = !0);
      } catch {}
    let w = LC(u, { relative: o }),
      y = uE(u, {
        replace: a,
        state: l,
        target: c,
        preventScrollReset: d,
        relative: o,
        viewTransition: p,
      });
    function v(x) {
      (r && r(x), x.defaultPrevented || y(x));
    }
    return f.createElement(
      "a",
      Nu({}, m, { href: S || w, onClick: h || s ? r : v, ref: n, target: c }),
    );
  });
var lh;
(function (e) {
  ((e.UseScrollRestoration = "useScrollRestoration"),
    (e.UseSubmit = "useSubmit"),
    (e.UseSubmitFetcher = "useSubmitFetcher"),
    (e.UseFetcher = "useFetcher"),
    (e.useViewTransitionState = "useViewTransitionState"));
})(lh || (lh = {}));
var ch;
(function (e) {
  ((e.UseFetcher = "useFetcher"),
    (e.UseFetchers = "useFetchers"),
    (e.UseScrollRestoration = "useScrollRestoration"));
})(ch || (ch = {}));
function uE(e, t) {
  let {
      target: n,
      replace: r,
      state: o,
      preventScrollReset: s,
      relative: a,
      viewTransition: l,
    } = t === void 0 ? {} : t,
    c = ze(),
    u = Yr(),
    d = Ey(e, { relative: a });
  return f.useCallback(
    (p) => {
      if (nE(p, n)) {
        p.preventDefault();
        let m = r !== void 0 ? r : $a(u) === $a(d);
        c(e, {
          replace: m,
          state: o,
          preventScrollReset: s,
          relative: a,
          viewTransition: l,
        });
      }
    },
    [u, c, d, r, o, n, e, s, a, l],
  );
}
function dE(e) {
  let t = f.useRef(Cu(e)),
    n = f.useRef(!1),
    r = Yr(),
    o = f.useMemo(() => rE(r.search, n.current ? null : t.current), [r.search]),
    s = ze(),
    a = f.useCallback(
      (l, c) => {
        const u = Cu(typeof l == "function" ? l(o) : l);
        ((n.current = !0), s("?" + u, c));
      },
      [s, o],
    );
  return [o, a];
}
const uh = (e) => {
    let t;
    const n = new Set(),
      r = (u, d) => {
        const p = typeof u == "function" ? u(t) : u;
        if (!Object.is(p, t)) {
          const m = t;
          ((t =
            (d ?? (typeof p != "object" || p === null))
              ? p
              : Object.assign({}, t, p)),
            n.forEach((g) => g(t, m)));
        }
      },
      o = () => t,
      l = {
        setState: r,
        getState: o,
        getInitialState: () => c,
        subscribe: (u) => (n.add(u), () => n.delete(u)),
      },
      c = (t = e(r, o, l));
    return l;
  },
  fE = (e) => (e ? uh(e) : uh),
  pE = (e) => e;
function hE(e, t = pE) {
  const n = A.useSyncExternalStore(
    e.subscribe,
    A.useCallback(() => t(e.getState()), [e, t]),
    A.useCallback(() => t(e.getInitialState()), [e, t]),
  );
  return (A.useDebugValue(n), n);
}
const dh = (e) => {
    const t = fE(e),
      n = (r) => hE(t, r);
    return (Object.assign(n, t), n);
  },
  mE = (e) => (e ? dh(e) : dh);
class gE {
  constructor() {
    Zt(this, "users", []);
    Zt(this, "offers", []);
    Zt(this, "proposals", []);
    Zt(this, "services", []);
    Zt(this, "chats", []);
    Zt(this, "messages", []);
    Zt(this, "payouts", []);
    Zt(this, "currentToken", null);
    Zt(this, "currentUser", null);
    (this.loadFromStorage(), this.users.length === 0 && this.seedData());
  }
  loadFromStorage() {
    try {
      const t = localStorage.getItem("ofix-data");
      if (t) {
        const r = JSON.parse(t);
        ((this.users = r.users || []),
          (this.offers = r.offers || []),
          (this.proposals = r.proposals || []),
          (this.services = r.services || []),
          (this.chats = r.chats || []),
          (this.messages = r.messages || []),
          (this.payouts = r.payouts || []));
      }
      const n = localStorage.getItem("ofix-token");
      if (n) {
        this.currentToken = n;
        const r = JSON.parse(atob(n.split(".")[1])).userId;
        this.currentUser = this.users.find((o) => o.id === r) || null;
      }
    } catch (t) {
      console.error("Error loading from storage:", t);
    }
  }
  saveToStorage() {
    try {
      localStorage.setItem(
        "ofix-data",
        JSON.stringify({
          users: this.users,
          offers: this.offers,
          proposals: this.proposals,
          services: this.services,
          chats: this.chats,
          messages: this.messages,
          payouts: this.payouts,
        }),
      );
    } catch (t) {
      console.error("Error saving to storage:", t);
    }
  }
  seedData() {
    const t = new Date().toISOString();
    ((this.users = [
      {
        id: "u1",
        name: "María García",
        email: "maria@example.com",
        password: "password123",
        phone: "+54 11 1234-5678",
        role: "user",
        createdAt: t,
        updatedAt: t,
      },
      {
        id: "u2",
        name: "Carlos López",
        email: "carlos@example.com",
        password: "password123",
        phone: "+54 11 2345-6789",
        role: "user",
        createdAt: t,
        updatedAt: t,
      },
      {
        id: "w1",
        name: "Juan Plomero",
        email: "juan@example.com",
        password: "password123",
        phone: "+54 11 3456-7890",
        role: "worker",
        trade: "Plomería",
        verified: !0,
        rating: 4.8,
        createdAt: t,
        updatedAt: t,
      },
      {
        id: "w2",
        name: "Ana Electricista",
        email: "ana@example.com",
        password: "password123",
        phone: "+54 11 4567-8901",
        role: "worker",
        trade: "Electricidad",
        verified: !0,
        rating: 4.9,
        createdAt: t,
        updatedAt: t,
      },
    ]),
      (this.offers = [
        {
          id: "o1",
          authorId: "u1",
          title: "Reparación de pérdida de agua",
          description:
            "Tengo una pérdida de agua en el baño que necesita atención urgente.",
          category: "Plomería",
          budget: 5e3,
          urgency: "alta",
          location: "Palermo, CABA",
          status: "abierta",
          createdAt: t,
          updatedAt: t,
        },
        {
          id: "o2",
          authorId: "u2",
          title: "Instalación de tomacorrientes",
          description:
            "Necesito instalar 3 tomacorrientes nuevos en la cocina.",
          category: "Electricidad",
          budget: 3e3,
          urgency: "media",
          location: "Belgrano, CABA",
          status: "abierta",
          createdAt: t,
          updatedAt: t,
        },
        {
          id: "o3",
          authorId: "u1",
          title: "Pintura de departamento",
          description: "Pintura completa de un departamento de 2 ambientes.",
          category: "Pintura",
          budget: 25e3,
          urgency: "baja",
          location: "Caballito, CABA",
          status: "abierta",
          createdAt: t,
          updatedAt: t,
        },
        {
          id: "o4",
          authorId: "u2",
          title: "Reparación de aire acondicionado",
          description: "El aire acondicionado no enfría correctamente.",
          category: "Refrigeración",
          budget: 4e3,
          urgency: "alta",
          location: "Recoleta, CABA",
          status: "abierta",
          createdAt: t,
          updatedAt: t,
        },
      ]),
      (this.services = [
        {
          id: "s1",
          workerId: "w1",
          title: "Reparación de cañerías",
          category: "Plomería",
          description:
            "Servicio profesional de reparación de cañerías con garantía de 6 meses.",
          price: 4e3,
          duration: "2-3 horas",
          active: !0,
          views: 45,
          createdAt: t,
          updatedAt: t,
        },
        {
          id: "s2",
          workerId: "w1",
          title: "Instalación de termotanque",
          category: "Plomería",
          description: "Instalación completa de termotanque eléctrico o a gas.",
          price: 8e3,
          duration: "4-5 horas",
          active: !0,
          views: 32,
          createdAt: t,
          updatedAt: t,
        },
        {
          id: "s3",
          workerId: "w2",
          title: "Instalación eléctrica residencial",
          category: "Electricidad",
          description:
            "Instalación eléctrica completa con materiales incluidos.",
          price: 15e3,
          duration: "1-2 días",
          active: !0,
          views: 28,
          createdAt: t,
          updatedAt: t,
        },
      ]),
      (this.proposals = [
        {
          id: "p1",
          offerId: "o1",
          workerId: "w1",
          message:
            "Hola! Tengo 10 años de experiencia en plomería. Puedo resolver tu problema hoy mismo.",
          price: 4500,
          status: "enviada",
          createdAt: t,
        },
        {
          id: "p2",
          offerId: "o2",
          workerId: "w2",
          message:
            "Soy electricista matriculado. Puedo hacer el trabajo mañana a primera hora.",
          price: 2800,
          status: "aceptada",
          createdAt: t,
        },
      ]),
      (this.chats = [
        {
          id: "c1",
          participantIds: ["u1", "w1"],
          lastMessageAt: t,
          lastMessage: "Perfecto, nos vemos mañana!",
        },
        {
          id: "c2",
          participantIds: ["u2", "w2"],
          lastMessageAt: t,
          lastMessage: "Gracias por aceptar mi propuesta",
        },
      ]),
      (this.messages = [
        {
          id: "m1",
          chatId: "c1",
          authorId: "u1",
          text: "Hola! Vi tu propuesta y me interesa",
          ts: t,
          status: "sent",
        },
        {
          id: "m2",
          chatId: "c1",
          authorId: "w1",
          text: "Excelente! Cuándo te viene bien que vaya?",
          ts: t,
          status: "sent",
        },
        {
          id: "m3",
          chatId: "c1",
          authorId: "u1",
          text: "Perfecto, nos vemos mañana!",
          ts: t,
          status: "sent",
        },
        {
          id: "m4",
          chatId: "c2",
          authorId: "w2",
          text: "Gracias por aceptar mi propuesta",
          ts: t,
          status: "sent",
        },
        {
          id: "m5",
          chatId: "c2",
          authorId: "u2",
          text: "De nada! Cuándo podés empezar?",
          ts: t,
          status: "sent",
        },
      ]),
      (this.payouts = [
        {
          id: "pay1",
          workerId: "w1",
          amount: 12500,
          status: "pendiente",
          createdAt: t,
        },
      ]),
      this.saveToStorage());
  }
  register(t) {
    if (this.users.find((s) => s.email === t.email))
      throw new Error("El email ya está registrado");
    const n = new Date().toISOString(),
      r = {
        id: `${t.role === "user" ? "u" : "w"}${Date.now()}`,
        name: t.name,
        email: t.email,
        password: t.password,
        role: t.role,
        trade: t.trade,
        createdAt: n,
        updatedAt: n,
      };
    (t.role === "worker" && ((r.verified = !1), (r.rating = 0)),
      this.users.push(r),
      this.saveToStorage());
    const o = this.generateToken(r.id);
    return (
      (this.currentToken = o),
      (this.currentUser = r),
      localStorage.setItem("ofix-token", o),
      { token: o, user: this.sanitizeUser(r) }
    );
  }
  login(t, n) {
    const r = this.users.find((s) => s.email === t && s.password === n);
    if (!r) throw new Error("Email o contraseña incorrectos");
    const o = this.generateToken(r.id);
    return (
      (this.currentToken = o),
      (this.currentUser = r),
      localStorage.setItem("ofix-token", o),
      { token: o, user: this.sanitizeUser(r) }
    );
  }
  logout() {
    ((this.currentToken = null),
      (this.currentUser = null),
      localStorage.removeItem("ofix-token"));
  }
  getCurrentUser() {
    return this.currentUser ? this.sanitizeUser(this.currentUser) : null;
  }
  generateToken(t) {
    const n = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })),
      r = btoa(JSON.stringify({ userId: t, exp: Date.now() + 864e5 })),
      o = btoa(Math.random().toString());
    return `${n}.${r}.${o}`;
  }
  sanitizeUser(t) {
    const { password: n, ...r } = t;
    return r;
  }
  requireAuth() {
    if (!this.currentUser) throw new Error("No autenticado");
    return this.currentUser;
  }
  getUser(t) {
    const n = this.users.find((r) => r.id === t);
    return n ? this.sanitizeUser(n) : null;
  }
  updateUser(t, n) {
    if (this.requireAuth().id !== t) throw new Error("No autorizado");
    const o = this.users.findIndex((s) => s.id === t);
    if (o === -1) throw new Error("Usuario no encontrado");
    return (
      (this.users[o] = {
        ...this.users[o],
        ...n,
        updatedAt: new Date().toISOString(),
      }),
      (this.currentUser = this.users[o]),
      this.saveToStorage(),
      this.sanitizeUser(this.users[o])
    );
  }
  getOffers(t = {}) {
    let n = [...this.offers];
    if (
      (t.status && (n = n.filter((r) => r.status === t.status)),
      t.category && (n = n.filter((r) => r.category === t.category)),
      t.q)
    ) {
      const r = t.q.toLowerCase();
      n = n.filter(
        (o) =>
          o.title.toLowerCase().includes(r) ||
          o.description.toLowerCase().includes(r),
      );
    }
    return n.sort(
      (r, o) =>
        new Date(o.createdAt).getTime() - new Date(r.createdAt).getTime(),
    );
  }
  getOffer(t) {
    return this.offers.find((n) => n.id === t);
  }
  createOffer(t) {
    if (this.requireAuth().role !== "user")
      throw new Error("Solo los usuarios pueden crear solicitudes");
    const r = {
      ...t,
      id: `o${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return (this.offers.push(r), this.saveToStorage(), r);
  }
  updateOffer(t, n) {
    const r = this.requireAuth(),
      o = this.offers.findIndex((s) => s.id === t);
    if (o === -1) throw new Error("Solicitud no encontrada");
    if (this.offers[o].authorId !== r.id) throw new Error("No autorizado");
    return (
      (this.offers[o] = {
        ...this.offers[o],
        ...n,
        updatedAt: new Date().toISOString(),
      }),
      this.saveToStorage(),
      this.offers[o]
    );
  }
  getProposals(t = {}) {
    let n = [...this.proposals];
    return (
      t.workerId && (n = n.filter((r) => r.workerId === t.workerId)),
      t.offerId && (n = n.filter((r) => r.offerId === t.offerId)),
      n.sort(
        (r, o) =>
          new Date(o.createdAt).getTime() - new Date(r.createdAt).getTime(),
      )
    );
  }
  createProposal(t) {
    if (this.requireAuth().role !== "worker")
      throw new Error("Solo los trabajadores pueden enviar propuestas");
    const r = {
      ...t,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    return (this.proposals.push(r), this.saveToStorage(), r);
  }
  updateProposal(t, n) {
    const r = this.requireAuth(),
      o = this.proposals.findIndex((l) => l.id === t);
    if (o === -1) throw new Error("Propuesta no encontrada");
    const s = this.proposals[o],
      a = this.offers.find((l) => l.id === s.offerId);
    if ((n === "aceptada" || n === "rechazada") && (!a || a.authorId !== r.id))
      throw new Error("No autorizado");
    return (
      (this.proposals[o] = { ...s, status: n }),
      this.saveToStorage(),
      this.proposals[o]
    );
  }
  getServices(t = {}) {
    let n = [...this.services];
    return (
      t.workerId && (n = n.filter((r) => r.workerId === t.workerId)),
      n.filter((r) => r.active)
    );
  }
  createService(t) {
    if (this.requireAuth().role !== "worker")
      throw new Error("Solo los trabajadores pueden crear servicios");
    const r = {
      ...t,
      id: `s${Date.now()}`,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return (this.services.push(r), this.saveToStorage(), r);
  }
  updateService(t, n) {
    const r = this.requireAuth(),
      o = this.services.findIndex((s) => s.id === t);
    if (o === -1) throw new Error("Servicio no encontrado");
    if (this.services[o].workerId !== r.id) throw new Error("No autorizado");
    return (
      (this.services[o] = {
        ...this.services[o],
        ...n,
        updatedAt: new Date().toISOString(),
      }),
      this.saveToStorage(),
      this.services[o]
    );
  }
  getChats(t) {
    return this.chats
      .filter((n) => n.participantIds.includes(t))
      .sort(
        (n, r) =>
          new Date(r.lastMessageAt).getTime() -
          new Date(n.lastMessageAt).getTime(),
      );
  }
  createChat(t, n) {
    const r = this.chats.find(
      (s) => s.participantIds.includes(t) && s.participantIds.includes(n),
    );
    if (r) return r;
    const o = {
      id: `c${Date.now()}`,
      participantIds: [t, n],
      lastMessageAt: new Date().toISOString(),
    };
    return (this.chats.push(o), this.saveToStorage(), o);
  }
  getMessages(t) {
    return this.messages
      .filter((n) => n.chatId === t)
      .sort((n, r) => new Date(n.ts).getTime() - new Date(r.ts).getTime());
  }
  createMessage(t, n) {
    const r = this.requireAuth(),
      o = {
        id: `m${Date.now()}`,
        chatId: t,
        authorId: r.id,
        text: n,
        ts: new Date().toISOString(),
        status: "sent",
      };
    this.messages.push(o);
    const s = this.chats.findIndex((a) => a.id === t);
    return (
      s !== -1 &&
        ((this.chats[s].lastMessageAt = o.ts), (this.chats[s].lastMessage = n)),
      this.saveToStorage(),
      setTimeout(() => {
        const a = this.chats.find((l) => l.id === t);
        if (a) {
          const l = a.participantIds.find((c) => c !== r.id);
          if (l) {
            const c = {
              id: `m${Date.now()}`,
              chatId: t,
              authorId: l,
              text: "Gracias por tu mensaje! Te respondo pronto.",
              ts: new Date().toISOString(),
              status: "sent",
            };
            (this.messages.push(c),
              (this.chats[s].lastMessageAt = c.ts),
              (this.chats[s].lastMessage = c.text),
              this.saveToStorage());
          }
        }
      }, 3e3),
      o
    );
  }
  getPayouts(t) {
    return this.payouts
      .filter((n) => n.workerId === t)
      .sort(
        (n, r) =>
          new Date(r.createdAt).getTime() - new Date(n.createdAt).getTime(),
      );
  }
  createPayout(t) {
    const n = this.requireAuth();
    if (n.role !== "worker")
      throw new Error("Solo los trabajadores pueden solicitar cobros");
    const r = {
      id: `pay${Date.now()}`,
      workerId: n.id,
      amount: t,
      status: "pendiente",
      createdAt: new Date().toISOString(),
    };
    return (this.payouts.push(r), this.saveToStorage(), r);
  }
}
const K = new gE(),
  Re = mE((e, t) => ({
    user: null,
    token: null,
    isAuthenticated: !1,
    initialize: () => {
      const n = K.getCurrentUser();
      n && e({ user: n, isAuthenticated: !0 });
    },
    login: async (n, r) => {
      try {
        const { user: o } = K.login(n, r);
        e({
          user: o,
          token: localStorage.getItem("ofix-token"),
          isAuthenticated: !0,
        });
      } catch (o) {
        throw o;
      }
    },
    register: async (n) => {
      try {
        const { user: r } = K.register(n);
        e({
          user: r,
          token: localStorage.getItem("ofix-token"),
          isAuthenticated: !0,
        });
      } catch (r) {
        throw r;
      }
    },
    logout: () => {
      (K.logout(), e({ user: null, token: null, isAuthenticated: !1 }));
    },
    updateUser: async (n) => {
      const r = t();
      if (!r.user) throw new Error("No autenticado");
      const o = K.updateUser(r.user.id, n);
      e({ user: o });
    },
  })),
  Ze = ({ children: e, requiredRole: t }) => {
    const { isAuthenticated: n, user: r } = Re(),
      o = ze();
    return (
      f.useEffect(() => {
        n
          ? t &&
            (r == null ? void 0 : r.role) !== t &&
            o((r == null ? void 0 : r.role) === "user" ? "/u/home" : "/w/home")
          : o("/auth/login");
      }, [n, r, t, o]),
      n
        ? t && (r == null ? void 0 : r.role) !== t
          ? i.jsx(ih, {
              to:
                (r == null ? void 0 : r.role) === "user"
                  ? "/u/home"
                  : "/w/home",
              replace: !0,
            })
          : i.jsx(i.Fragment, { children: e })
        : i.jsx(ih, { to: "/auth/login", replace: !0 })
    );
  },
  vE = cl(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
      variants: {
        variant: {
          default: "bg-primary text-primary-foreground hover:bg-primary/90",
          destructive:
            "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          outline:
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
          secondary:
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline",
        },
        size: {
          default: "h-10 px-4 py-2",
          sm: "h-9 rounded-md px-3",
          lg: "h-11 rounded-md px-8",
          icon: "h-10 w-10",
        },
      },
      defaultVariants: { variant: "default", size: "default" },
    },
  ),
  re = f.forwardRef(
    ({ className: e, variant: t, size: n, asChild: r = !1, ...o }, s) => {
      const a = r ? eS : "button";
      return i.jsx(a, {
        className: X(vE({ variant: t, size: n, className: e })),
        ref: s,
        ...o,
      });
    },
  );
re.displayName = "Button";
const Y = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx("div", {
    ref: n,
    className: X("rounded-lg border bg-card text-card-foreground shadow-sm", e),
    ...t,
  }),
);
Y.displayName = "Card";
const ie = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx("div", {
    ref: n,
    className: X("flex flex-col space-y-1.5 p-6", e),
    ...t,
  }),
);
ie.displayName = "CardHeader";
const ae = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx("h3", {
    ref: n,
    className: X("text-2xl font-semibold leading-none tracking-tight", e),
    ...t,
  }),
);
ae.displayName = "CardTitle";
const ge = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx("p", {
    ref: n,
    className: X("text-sm text-muted-foreground", e),
    ...t,
  }),
);
ge.displayName = "CardDescription";
const ue = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx("div", { ref: n, className: X("p-6 pt-0", e), ...t }),
);
ue.displayName = "CardContent";
const yE = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx("div", { ref: n, className: X("flex items-center p-6 pt-0", e), ...t }),
);
yE.displayName = "CardFooter";
const xE = () => {
    const e = ze();
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-primary-light via-background to-accent-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-16",
        children: [
          i.jsxs("div", {
            className: "text-center mb-16",
            children: [
              i.jsx("h1", {
                className:
                  "text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent",
                children: "OFIX",
              }),
              i.jsx("p", {
                className:
                  "text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto",
                children:
                  "Conectamos usuarios con trabajadores profesionales para resolver tus urgencias",
              }),
            ],
          }),
          i.jsxs("div", {
            className: "grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12",
            children: [
              i.jsxs(Y, {
                className:
                  "border-2 hover:border-primary transition-colors shadow-lg",
                children: [
                  i.jsxs(ie, {
                    children: [
                      i.jsx("div", {
                        className:
                          "w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-4",
                        children: i.jsx(ul, {
                          className: "h-6 w-6 text-primary",
                        }),
                      }),
                      i.jsx(ae, {
                        className: "text-2xl",
                        children: "Soy Usuario",
                      }),
                      i.jsx(ge, {
                        className: "text-base",
                        children:
                          "Necesito contratar un trabajador para resolver mi urgencia",
                      }),
                    ],
                  }),
                  i.jsxs(ue, {
                    className: "space-y-4",
                    children: [
                      i.jsxs("ul", {
                        className: "space-y-2",
                        children: [
                          i.jsxs("li", {
                            className: "flex items-start gap-2",
                            children: [
                              i.jsx(Cr, {
                                className: "h-5 w-5 text-success mt-0.5",
                              }),
                              i.jsx("span", {
                                className: "text-sm",
                                children: "Publica tu solicitud en minutos",
                              }),
                            ],
                          }),
                          i.jsxs("li", {
                            className: "flex items-start gap-2",
                            children: [
                              i.jsx(Cr, {
                                className: "h-5 w-5 text-success mt-0.5",
                              }),
                              i.jsx("span", {
                                className: "text-sm",
                                children: "Recibe propuestas de trabajadores",
                              }),
                            ],
                          }),
                          i.jsxs("li", {
                            className: "flex items-start gap-2",
                            children: [
                              i.jsx(Cr, {
                                className: "h-5 w-5 text-success mt-0.5",
                              }),
                              i.jsx("span", {
                                className: "text-sm",
                                children: "Chatea y coordina el trabajo",
                              }),
                            ],
                          }),
                        ],
                      }),
                      i.jsx(re, {
                        className: "w-full",
                        size: "lg",
                        onClick: () => e("/auth/register?role=user"),
                        children: "Comenzar como Usuario",
                      }),
                    ],
                  }),
                ],
              }),
              i.jsxs(Y, {
                className:
                  "border-2 hover:border-accent transition-colors shadow-lg",
                children: [
                  i.jsxs(ie, {
                    children: [
                      i.jsx("div", {
                        className:
                          "w-12 h-12 rounded-full bg-accent-light flex items-center justify-center mb-4",
                        children: i.jsx(Od, {
                          className: "h-6 w-6 text-accent",
                        }),
                      }),
                      i.jsx(ae, {
                        className: "text-2xl",
                        children: "Soy Trabajador",
                      }),
                      i.jsx(ge, {
                        className: "text-base",
                        children:
                          "Busco trabajos y quiero ofrecer mis servicios profesionales",
                      }),
                    ],
                  }),
                  i.jsxs(ue, {
                    className: "space-y-4",
                    children: [
                      i.jsxs("ul", {
                        className: "space-y-2",
                        children: [
                          i.jsxs("li", {
                            className: "flex items-start gap-2",
                            children: [
                              i.jsx(Cr, {
                                className: "h-5 w-5 text-success mt-0.5",
                              }),
                              i.jsx("span", {
                                className: "text-sm",
                                children: "Encuentra trabajos cerca tuyo",
                              }),
                            ],
                          }),
                          i.jsxs("li", {
                            className: "flex items-start gap-2",
                            children: [
                              i.jsx(Cr, {
                                className: "h-5 w-5 text-success mt-0.5",
                              }),
                              i.jsx("span", {
                                className: "text-sm",
                                children: "Publica tus servicios profesionales",
                              }),
                            ],
                          }),
                          i.jsxs("li", {
                            className: "flex items-start gap-2",
                            children: [
                              i.jsx(Cr, {
                                className: "h-5 w-5 text-success mt-0.5",
                              }),
                              i.jsx("span", {
                                className: "text-sm",
                                children: "Gestiona tus cobros fácilmente",
                              }),
                            ],
                          }),
                        ],
                      }),
                      i.jsx(re, {
                        className: "w-full bg-accent hover:bg-accent/90",
                        size: "lg",
                        onClick: () => e("/auth/register?role=worker"),
                        children: "Comenzar como Trabajador",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          i.jsxs("div", {
            className: "text-center",
            children: [
              i.jsx("p", {
                className: "text-muted-foreground mb-4",
                children: "¿Ya tenés cuenta?",
              }),
              i.jsx(re, {
                variant: "outline",
                size: "lg",
                onClick: () => e("/auth/login"),
                children: "Iniciar Sesión",
              }),
            ],
          }),
        ],
      }),
    });
  },
  wE = () => {
    const e = Yr();
    return (
      f.useEffect(() => {
        console.error(
          "404 Error: User attempted to access non-existent route:",
          e.pathname,
        );
      }, [e.pathname]),
      i.jsx("div", {
        className: "flex min-h-screen items-center justify-center bg-gray-100",
        children: i.jsxs("div", {
          className: "text-center",
          children: [
            i.jsx("h1", {
              className: "mb-4 text-4xl font-bold",
              children: "404",
            }),
            i.jsx("p", {
              className: "mb-4 text-xl text-gray-600",
              children: "Oops! Page not found",
            }),
            i.jsx("a", {
              href: "/",
              className: "text-blue-500 underline hover:text-blue-700",
              children: "Return to Home",
            }),
          ],
        }),
      })
    );
  },
  ye = f.forwardRef(({ className: e, type: t, ...n }, r) =>
    i.jsx("input", {
      type: t,
      className: X(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        e,
      ),
      ref: r,
      ...n,
    }),
  );
ye.displayName = "Input";
var SE = "Label",
  Ry = f.forwardRef((e, t) =>
    i.jsx(ne.label, {
      ...e,
      ref: t,
      onMouseDown: (n) => {
        var o;
        n.target.closest("button, input, select, textarea") ||
          ((o = e.onMouseDown) == null || o.call(e, n),
          !n.defaultPrevented && n.detail > 1 && n.preventDefault());
      },
    }),
  );
Ry.displayName = SE;
var Ay = Ry;
const jE = cl(
    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  ),
  fe = f.forwardRef(({ className: e, ...t }, n) =>
    i.jsx(Ay, { ref: n, className: X(jE(), e), ...t }),
  );
fe.displayName = Ay.displayName;
const bE = () => {
    const e = ze(),
      { login: t, user: n } = Re(),
      [r, o] = f.useState(""),
      [s, a] = f.useState(""),
      [l, c] = f.useState(!1);
    if (n) return (e(n.role === "user" ? "/u/home" : "/w/home"), null);
    const u = async (d) => {
      (d.preventDefault(), c(!0));
      try {
        (await t(r, s), be.success("¡Bienvenido de nuevo!"));
        const p = Re.getState().user;
        e((p == null ? void 0 : p.role) === "user" ? "/u/home" : "/w/home");
      } catch (p) {
        be.error(p.message || "Error al iniciar sesión");
      } finally {
        c(!1);
      }
    };
    return i.jsx("div", {
      className:
        "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-background to-accent-light p-4",
      children: i.jsxs(Y, {
        className: "w-full max-w-md shadow-xl",
        children: [
          i.jsxs(ie, {
            className: "text-center",
            children: [
              i.jsx(ae, {
                className:
                  "text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent",
                children: "OFIX",
              }),
              i.jsx(ge, { children: "Ingresa a tu cuenta" }),
            ],
          }),
          i.jsxs(ue, {
            children: [
              i.jsxs("form", {
                onSubmit: u,
                className: "space-y-4",
                children: [
                  i.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      i.jsx(fe, { htmlFor: "email", children: "Email" }),
                      i.jsx(ye, {
                        id: "email",
                        type: "email",
                        placeholder: "tu@email.com",
                        value: r,
                        onChange: (d) => o(d.target.value),
                        required: !0,
                      }),
                    ],
                  }),
                  i.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      i.jsx(fe, {
                        htmlFor: "password",
                        children: "Contraseña",
                      }),
                      i.jsx(ye, {
                        id: "password",
                        type: "password",
                        placeholder: "••••••••",
                        value: s,
                        onChange: (d) => a(d.target.value),
                        required: !0,
                      }),
                    ],
                  }),
                  i.jsx(re, {
                    type: "submit",
                    className: "w-full",
                    disabled: l,
                    children: l
                      ? i.jsxs(i.Fragment, {
                          children: [
                            i.jsx(es, {
                              className: "mr-2 h-4 w-4 animate-spin",
                            }),
                            "Ingresando...",
                          ],
                        })
                      : "Iniciar Sesión",
                  }),
                ],
              }),
              i.jsx("div", {
                className: "mt-6 text-center text-sm",
                children: i.jsxs("p", {
                  className: "text-muted-foreground",
                  children: [
                    "¿No tenés cuenta?",
                    " ",
                    i.jsx(Ty, {
                      to: "/auth/register",
                      className: "text-primary hover:underline",
                      children: "Registrate aquí",
                    }),
                  ],
                }),
              }),
              i.jsxs("div", {
                className: "mt-4 p-4 bg-muted rounded-lg text-sm",
                children: [
                  i.jsx("p", {
                    className: "font-semibold mb-2",
                    children: "Usuarios de prueba:",
                  }),
                  i.jsx("p", {
                    className: "text-muted-foreground",
                    children: "Usuario: maria@example.com",
                  }),
                  i.jsx("p", {
                    className: "text-muted-foreground",
                    children: "Trabajador: juan@example.com",
                  }),
                  i.jsx("p", {
                    className: "text-muted-foreground mt-1",
                    children: "Contraseña: password123",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    });
  },
  NE = () => {
    const e = ze(),
      [t] = dE(),
      { register: n, user: r } = Re(),
      [o, s] = f.useState(""),
      [a, l] = f.useState(""),
      [c, u] = f.useState(""),
      [d, p] = f.useState(t.get("role") || "user"),
      [m, g] = f.useState(""),
      [S, h] = f.useState(!1);
    if (r) return (e(r.role === "user" ? "/u/home" : "/w/home"), null);
    const w = async (y) => {
      (y.preventDefault(), h(!0));
      try {
        (await n({
          name: o,
          email: a,
          password: c,
          role: d,
          trade: d === "worker" ? m : void 0,
        }),
          be.success("¡Cuenta creada exitosamente!"));
        const v = Re.getState().user;
        e((v == null ? void 0 : v.role) === "user" ? "/u/home" : "/w/home");
      } catch (v) {
        be.error(v.message || "Error al crear la cuenta");
      } finally {
        h(!1);
      }
    };
    return i.jsx("div", {
      className:
        "min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light via-background to-accent-light p-4",
      children: i.jsxs(Y, {
        className: "w-full max-w-md shadow-xl",
        children: [
          i.jsxs(ie, {
            className: "text-center",
            children: [
              i.jsx(ae, {
                className:
                  "text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent",
                children: "OFIX",
              }),
              i.jsx(ge, { children: "Crea tu cuenta" }),
            ],
          }),
          i.jsxs(ue, {
            children: [
              i.jsxs("div", {
                className: "grid grid-cols-2 gap-4 mb-6",
                children: [
                  i.jsxs(re, {
                    type: "button",
                    variant: d === "user" ? "default" : "outline",
                    onClick: () => p("user"),
                    className: "gap-2",
                    children: [i.jsx(ul, { className: "h-4 w-4" }), "Usuario"],
                  }),
                  i.jsxs(re, {
                    type: "button",
                    variant: d === "worker" ? "default" : "outline",
                    onClick: () => p("worker"),
                    className: "gap-2 bg-accent hover:bg-accent/90",
                    children: [
                      i.jsx(Od, { className: "h-4 w-4" }),
                      "Trabajador",
                    ],
                  }),
                ],
              }),
              i.jsxs("form", {
                onSubmit: w,
                className: "space-y-4",
                children: [
                  i.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      i.jsx(fe, {
                        htmlFor: "name",
                        children: "Nombre completo",
                      }),
                      i.jsx(ye, {
                        id: "name",
                        type: "text",
                        placeholder: "Juan Pérez",
                        value: o,
                        onChange: (y) => s(y.target.value),
                        required: !0,
                      }),
                    ],
                  }),
                  i.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      i.jsx(fe, { htmlFor: "email", children: "Email" }),
                      i.jsx(ye, {
                        id: "email",
                        type: "email",
                        placeholder: "tu@email.com",
                        value: a,
                        onChange: (y) => l(y.target.value),
                        required: !0,
                      }),
                    ],
                  }),
                  i.jsxs("div", {
                    className: "space-y-2",
                    children: [
                      i.jsx(fe, {
                        htmlFor: "password",
                        children: "Contraseña",
                      }),
                      i.jsx(ye, {
                        id: "password",
                        type: "password",
                        placeholder: "••••••••",
                        value: c,
                        onChange: (y) => u(y.target.value),
                        required: !0,
                        minLength: 6,
                      }),
                    ],
                  }),
                  d === "worker" &&
                    i.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        i.jsx(fe, {
                          htmlFor: "trade",
                          children: "Oficio (opcional)",
                        }),
                        i.jsx(ye, {
                          id: "trade",
                          type: "text",
                          placeholder: "Ej: Plomería, Electricidad",
                          value: m,
                          onChange: (y) => g(y.target.value),
                        }),
                      ],
                    }),
                  i.jsx(re, {
                    type: "submit",
                    className: "w-full",
                    disabled: S,
                    children: S
                      ? i.jsxs(i.Fragment, {
                          children: [
                            i.jsx(es, {
                              className: "mr-2 h-4 w-4 animate-spin",
                            }),
                            "Creando cuenta...",
                          ],
                        })
                      : "Crear Cuenta",
                  }),
                ],
              }),
              i.jsx("div", {
                className: "mt-6 text-center text-sm",
                children: i.jsxs("p", {
                  className: "text-muted-foreground",
                  children: [
                    "¿Ya tenés cuenta?",
                    " ",
                    i.jsx(Ty, {
                      to: "/auth/login",
                      className: "text-primary hover:underline",
                      children: "Iniciá sesión aquí",
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      }),
    });
  },
  CE = () => {
    const e = ze(),
      { user: t, logout: n } = Re(),
      r = K.getOffers({ status: "" }).filter(
        (a) => a.authorId === (t == null ? void 0 : t.id),
      ),
      o = K.getChats((t == null ? void 0 : t.id) || ""),
      s = () => {
        (n(), e("/"));
      };
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-primary-light via-background to-accent-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsxs("div", {
            className: "flex justify-between items-center mb-8",
            children: [
              i.jsxs("div", {
                children: [
                  i.jsxs("h1", {
                    className: "text-3xl font-bold",
                    children: ["Bienvenido, ", t == null ? void 0 : t.name],
                  }),
                  i.jsx("p", {
                    className: "text-muted-foreground",
                    children: "¿Qué necesitás resolver hoy?",
                  }),
                ],
              }),
              i.jsxs(re, {
                variant: "ghost",
                onClick: s,
                className: "gap-2",
                children: [i.jsx(Cv, { className: "h-4 w-4" }), "Salir"],
              }),
            ],
          }),
          i.jsxs("div", {
            className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12",
            children: [
              i.jsx(Y, {
                className: "hover:shadow-lg transition-shadow cursor-pointer",
                onClick: () => e("/u/requests/new"),
                children: i.jsxs(ie, {
                  children: [
                    i.jsx("div", {
                      className:
                        "w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-2",
                      children: i.jsx(Wo, {
                        className: "h-6 w-6 text-primary",
                      }),
                    }),
                    i.jsx(ae, { children: "Nueva Solicitud" }),
                    i.jsx(ge, { children: "Publicá tu urgencia" }),
                  ],
                }),
              }),
              i.jsx(Y, {
                className: "hover:shadow-lg transition-shadow cursor-pointer",
                onClick: () => e("/u/requests"),
                children: i.jsxs(ie, {
                  children: [
                    i.jsx("div", {
                      className:
                        "w-12 h-12 rounded-full bg-accent-light flex items-center justify-center mb-2",
                      children: i.jsx(Nv, { className: "h-6 w-6 text-accent" }),
                    }),
                    i.jsx(ae, { children: "Mis Solicitudes" }),
                    i.jsxs(ge, { children: [r.length, " activas"] }),
                  ],
                }),
              }),
              i.jsx(Y, {
                className: "hover:shadow-lg transition-shadow cursor-pointer",
                onClick: () => e("/u/chat"),
                children: i.jsxs(ie, {
                  children: [
                    i.jsx("div", {
                      className:
                        "w-12 h-12 rounded-full bg-success-light flex items-center justify-center mb-2",
                      children: i.jsx(Oa, {
                        className: "h-6 w-6 text-success",
                      }),
                    }),
                    i.jsx(ae, { children: "Mensajes" }),
                    i.jsxs(ge, { children: [o.length, " conversaciones"] }),
                  ],
                }),
              }),
              i.jsx(Y, {
                className: "hover:shadow-lg transition-shadow cursor-pointer",
                onClick: () => e("/u/profile"),
                children: i.jsxs(ie, {
                  children: [
                    i.jsx("div", {
                      className:
                        "w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2",
                      children: i.jsx(ul, {
                        className: "h-6 w-6 text-muted-foreground",
                      }),
                    }),
                    i.jsx(ae, { children: "Mi Perfil" }),
                    i.jsx(ge, { children: "Ver y editar" }),
                  ],
                }),
              }),
            ],
          }),
          i.jsxs("div", {
            children: [
              i.jsx("h2", {
                className: "text-2xl font-bold mb-4",
                children: "Mis Solicitudes Recientes",
              }),
              r.length === 0
                ? i.jsx(Y, {
                    children: i.jsxs(ue, {
                      className: "py-8 text-center",
                      children: [
                        i.jsx("p", {
                          className: "text-muted-foreground mb-4",
                          children: "Aún no tenés solicitudes publicadas",
                        }),
                        i.jsxs(re, {
                          onClick: () => e("/u/requests/new"),
                          children: [
                            i.jsx(Wo, { className: "mr-2 h-4 w-4" }),
                            "Crear Primera Solicitud",
                          ],
                        }),
                      ],
                    }),
                  })
                : i.jsx("div", {
                    className: "grid md:grid-cols-2 lg:grid-cols-3 gap-4",
                    children: r
                      .slice(0, 6)
                      .map((a) =>
                        i.jsxs(
                          Y,
                          {
                            className:
                              "hover:shadow-lg transition-shadow cursor-pointer",
                            onClick: () => e(`/u/requests/${a.id}`),
                            children: [
                              i.jsxs(ie, {
                                children: [
                                  i.jsx(ae, {
                                    className: "text-lg",
                                    children: a.title,
                                  }),
                                  i.jsx(ge, {
                                    className: "line-clamp-2",
                                    children: a.description,
                                  }),
                                ],
                              }),
                              i.jsx(ue, {
                                children: i.jsxs("div", {
                                  className:
                                    "flex justify-between items-center text-sm",
                                  children: [
                                    i.jsx("span", {
                                      className: "text-muted-foreground",
                                      children: a.category,
                                    }),
                                    i.jsxs("span", {
                                      className: "font-semibold",
                                      children: [
                                        "$",
                                        a.budget.toLocaleString(),
                                      ],
                                    }),
                                  ],
                                }),
                              }),
                            ],
                          },
                          a.id,
                        ),
                      ),
                  }),
            ],
          }),
        ],
      }),
    });
  },
  mt = () => {
    const e = ze(),
      { user: t } = Re(),
      n = () => {
        e(t ? (t.role === "user" ? "/u/home" : "/w/home") : "/");
      };
    return i.jsxs(re, {
      variant: "ghost",
      size: "sm",
      onClick: n,
      className: "gap-2",
      children: [i.jsx(KS, { className: "h-4 w-4" }), "Volver al inicio"],
    });
  },
  EE = cl(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
      variants: {
        variant: {
          default:
            "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
          secondary:
            "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
          destructive:
            "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
          outline: "text-foreground",
        },
      },
      defaultVariants: { variant: "default" },
    },
  );
function wn({ className: e, variant: t, ...n }) {
  return i.jsx("div", { className: X(EE({ variant: t }), e), ...n });
}
const Xd = ({ urgency: e }) => {
    const t = {
        alta: {
          label: "Urgente",
          className: "bg-accent text-accent-foreground",
          Icon: GS,
        },
        media: {
          label: "Media",
          className: "bg-primary/20 text-primary",
          Icon: Mp,
        },
        baja: {
          label: "Baja",
          className: "bg-muted text-muted-foreground",
          Icon: Mp,
        },
      },
      { label: n, className: r, Icon: o } = t[e];
    return i.jsxs(wn, {
      className: r,
      children: [i.jsx(o, { className: "h-3 w-3 mr-1" }), n],
    });
  },
  kE = () => {
    const e = ze(),
      { user: t } = Re(),
      [n, r] = f.useState(""),
      s = K.getOffers().filter(
        (c) => c.authorId === (t == null ? void 0 : t.id),
      ),
      a = s.filter(
        (c) =>
          c.title.toLowerCase().includes(n.toLowerCase()) ||
          c.description.toLowerCase().includes(n.toLowerCase()),
      ),
      l = (c) => {
        const u = {
          abierta: {
            label: "Abierta",
            className: "bg-success text-success-foreground",
          },
          asignada: {
            label: "Asignada",
            className: "bg-primary text-primary-foreground",
          },
          cerrada: {
            label: "Cerrada",
            className: "bg-muted text-muted-foreground",
          },
        };
        return u[c] || u.abierta;
      };
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-primary-light via-background to-accent-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
          i.jsxs("div", {
            className: "flex justify-between items-center mb-6",
            children: [
              i.jsxs("div", {
                children: [
                  i.jsx("h1", {
                    className: "text-3xl font-bold",
                    children: "Mis Solicitudes",
                  }),
                  i.jsxs("p", {
                    className: "text-muted-foreground",
                    children: [s.length, " solicitudes totales"],
                  }),
                ],
              }),
              i.jsxs(re, {
                onClick: () => e("/u/requests/new"),
                className: "gap-2",
                children: [
                  i.jsx(Wo, { className: "h-4 w-4" }),
                  "Nueva Solicitud",
                ],
              }),
            ],
          }),
          i.jsx("div", {
            className: "mb-6",
            children: i.jsxs("div", {
              className: "relative",
              children: [
                i.jsx(Ma, {
                  className:
                    "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
                }),
                i.jsx(ye, {
                  placeholder: "Buscar solicitudes...",
                  value: n,
                  onChange: (c) => r(c.target.value),
                  className: "pl-10",
                }),
              ],
            }),
          }),
          a.length === 0
            ? i.jsx(Y, {
                children: i.jsxs(ue, {
                  className: "py-12 text-center",
                  children: [
                    i.jsx("p", {
                      className: "text-muted-foreground mb-4",
                      children: n
                        ? "No se encontraron solicitudes"
                        : "Aún no tenés solicitudes publicadas",
                    }),
                    i.jsxs(re, {
                      onClick: () => e("/u/requests/new"),
                      children: [
                        i.jsx(Wo, { className: "mr-2 h-4 w-4" }),
                        "Crear Primera Solicitud",
                      ],
                    }),
                  ],
                }),
              })
            : i.jsx("div", {
                className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: a.map((c) => {
                  const u = K.getProposals({ offerId: c.id }),
                    d = l(c.status);
                  return i.jsxs(
                    Y,
                    {
                      className:
                        "hover:shadow-lg transition-shadow cursor-pointer",
                      onClick: () => e(`/u/requests/${c.id}`),
                      children: [
                        i.jsxs(ie, {
                          children: [
                            i.jsxs("div", {
                              className:
                                "flex justify-between items-start gap-2 mb-2",
                              children: [
                                i.jsx(wn, {
                                  className: d.className,
                                  children: d.label,
                                }),
                                i.jsx(Xd, { urgency: c.urgency }),
                              ],
                            }),
                            i.jsx(ae, { children: c.title }),
                            i.jsx(ge, {
                              className: "line-clamp-2",
                              children: c.description,
                            }),
                          ],
                        }),
                        i.jsx(ue, {
                          children: i.jsxs("div", {
                            className: "space-y-2 text-sm",
                            children: [
                              i.jsxs("div", {
                                className: "flex justify-between",
                                children: [
                                  i.jsx("span", {
                                    className: "text-muted-foreground",
                                    children: "Categoría:",
                                  }),
                                  i.jsx("span", {
                                    className: "font-medium",
                                    children: c.category,
                                  }),
                                ],
                              }),
                              i.jsxs("div", {
                                className: "flex justify-between",
                                children: [
                                  i.jsx("span", {
                                    className: "text-muted-foreground",
                                    children: "Presupuesto:",
                                  }),
                                  i.jsxs("span", {
                                    className: "font-semibold text-primary",
                                    children: ["$", c.budget.toLocaleString()],
                                  }),
                                ],
                              }),
                              i.jsxs("div", {
                                className: "flex justify-between",
                                children: [
                                  i.jsx("span", {
                                    className: "text-muted-foreground",
                                    children: "Propuestas:",
                                  }),
                                  i.jsx("span", {
                                    className: "font-medium",
                                    children: u.length,
                                  }),
                                ],
                              }),
                              i.jsxs("div", {
                                className: "flex justify-between",
                                children: [
                                  i.jsx("span", {
                                    className: "text-muted-foreground",
                                    children: "Ubicación:",
                                  }),
                                  i.jsx("span", {
                                    className: "font-medium text-xs",
                                    children: c.location,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                      ],
                    },
                    c.id,
                  );
                }),
              }),
        ],
      }),
    });
  },
  wl = f.forwardRef(({ className: e, ...t }, n) =>
    i.jsx("textarea", {
      className: X(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        e,
      ),
      ref: n,
      ...t,
    }),
  );
wl.displayName = "Textarea";
function fh(e, [t, n]) {
  return Math.min(n, Math.max(t, e));
}
var PE = f.createContext(void 0);
function TE(e) {
  const t = f.useContext(PE);
  return e || t || "ltr";
}
var cc = 0;
function Iy() {
  f.useEffect(() => {
    const e = document.querySelectorAll("[data-radix-focus-guard]");
    return (
      document.body.insertAdjacentElement("afterbegin", e[0] ?? ph()),
      document.body.insertAdjacentElement("beforeend", e[1] ?? ph()),
      cc++,
      () => {
        (cc === 1 &&
          document
            .querySelectorAll("[data-radix-focus-guard]")
            .forEach((t) => t.remove()),
          cc--);
      }
    );
  }, []);
}
function ph() {
  const e = document.createElement("span");
  return (
    e.setAttribute("data-radix-focus-guard", ""),
    (e.tabIndex = 0),
    (e.style.outline = "none"),
    (e.style.opacity = "0"),
    (e.style.position = "fixed"),
    (e.style.pointerEvents = "none"),
    e
  );
}
var uc = "focusScope.autoFocusOnMount",
  dc = "focusScope.autoFocusOnUnmount",
  hh = { bubbles: !1, cancelable: !0 },
  RE = "FocusScope",
  Jd = f.forwardRef((e, t) => {
    const {
        loop: n = !1,
        trapped: r = !1,
        onMountAutoFocus: o,
        onUnmountAutoFocus: s,
        ...a
      } = e,
      [l, c] = f.useState(null),
      u = Ot(o),
      d = Ot(s),
      p = f.useRef(null),
      m = Ne(t, (h) => c(h)),
      g = f.useRef({
        paused: !1,
        pause() {
          this.paused = !0;
        },
        resume() {
          this.paused = !1;
        },
      }).current;
    (f.useEffect(() => {
      if (r) {
        let h = function (x) {
            if (g.paused || !l) return;
            const j = x.target;
            l.contains(j) ? (p.current = j) : Ln(p.current, { select: !0 });
          },
          w = function (x) {
            if (g.paused || !l) return;
            const j = x.relatedTarget;
            j !== null && (l.contains(j) || Ln(p.current, { select: !0 }));
          },
          y = function (x) {
            if (document.activeElement === document.body)
              for (const b of x) b.removedNodes.length > 0 && Ln(l);
          };
        (document.addEventListener("focusin", h),
          document.addEventListener("focusout", w));
        const v = new MutationObserver(y);
        return (
          l && v.observe(l, { childList: !0, subtree: !0 }),
          () => {
            (document.removeEventListener("focusin", h),
              document.removeEventListener("focusout", w),
              v.disconnect());
          }
        );
      }
    }, [r, l, g.paused]),
      f.useEffect(() => {
        if (l) {
          gh.add(g);
          const h = document.activeElement;
          if (!l.contains(h)) {
            const y = new CustomEvent(uc, hh);
            (l.addEventListener(uc, u),
              l.dispatchEvent(y),
              y.defaultPrevented ||
                (AE(DE(Oy(l)), { select: !0 }),
                document.activeElement === h && Ln(l)));
          }
          return () => {
            (l.removeEventListener(uc, u),
              setTimeout(() => {
                const y = new CustomEvent(dc, hh);
                (l.addEventListener(dc, d),
                  l.dispatchEvent(y),
                  y.defaultPrevented || Ln(h ?? document.body, { select: !0 }),
                  l.removeEventListener(dc, d),
                  gh.remove(g));
              }, 0));
          };
        }
      }, [l, u, d, g]));
    const S = f.useCallback(
      (h) => {
        if ((!n && !r) || g.paused) return;
        const w = h.key === "Tab" && !h.altKey && !h.ctrlKey && !h.metaKey,
          y = document.activeElement;
        if (w && y) {
          const v = h.currentTarget,
            [x, j] = IE(v);
          x && j
            ? !h.shiftKey && y === j
              ? (h.preventDefault(), n && Ln(x, { select: !0 }))
              : h.shiftKey &&
                y === x &&
                (h.preventDefault(), n && Ln(j, { select: !0 }))
            : y === v && h.preventDefault();
        }
      },
      [n, r, g.paused],
    );
    return i.jsx(ne.div, { tabIndex: -1, ...a, ref: m, onKeyDown: S });
  });
Jd.displayName = RE;
function AE(e, { select: t = !1 } = {}) {
  const n = document.activeElement;
  for (const r of e)
    if ((Ln(r, { select: t }), document.activeElement !== n)) return;
}
function IE(e) {
  const t = Oy(e),
    n = mh(t, e),
    r = mh(t.reverse(), e);
  return [n, r];
}
function Oy(e) {
  const t = [],
    n = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (r) => {
        const o = r.tagName === "INPUT" && r.type === "hidden";
        return r.disabled || r.hidden || o
          ? NodeFilter.FILTER_SKIP
          : r.tabIndex >= 0
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_SKIP;
      },
    });
  for (; n.nextNode();) t.push(n.currentNode);
  return t;
}
function mh(e, t) {
  for (const n of e) if (!OE(n, { upTo: t })) return n;
}
function OE(e, { upTo: t }) {
  if (getComputedStyle(e).visibility === "hidden") return !0;
  for (; e;) {
    if (t !== void 0 && e === t) return !1;
    if (getComputedStyle(e).display === "none") return !0;
    e = e.parentElement;
  }
  return !1;
}
function ME(e) {
  return e instanceof HTMLInputElement && "select" in e;
}
function Ln(e, { select: t = !1 } = {}) {
  if (e && e.focus) {
    const n = document.activeElement;
    (e.focus({ preventScroll: !0 }), e !== n && ME(e) && t && e.select());
  }
}
var gh = _E();
function _E() {
  let e = [];
  return {
    add(t) {
      const n = e[0];
      (t !== n && (n == null || n.pause()), (e = vh(e, t)), e.unshift(t));
    },
    remove(t) {
      var n;
      ((e = vh(e, t)), (n = e[0]) == null || n.resume());
    },
  };
}
function vh(e, t) {
  const n = [...e],
    r = n.indexOf(t);
  return (r !== -1 && n.splice(r, 1), n);
}
function DE(e) {
  return e.filter((t) => t.tagName !== "A");
}
function LE(e) {
  const t = f.useRef({ value: e, previous: e });
  return f.useMemo(
    () => (
      t.current.value !== e &&
        ((t.current.previous = t.current.value), (t.current.value = e)),
      t.current.previous
    ),
    [e],
  );
}
var FE = function (e) {
    if (typeof document > "u") return null;
    var t = Array.isArray(e) ? e[0] : e;
    return t.ownerDocument.body;
  },
  no = new WeakMap(),
  Ui = new WeakMap(),
  Bi = {},
  fc = 0,
  My = function (e) {
    return e && (e.host || My(e.parentNode));
  },
  zE = function (e, t) {
    return t
      .map(function (n) {
        if (e.contains(n)) return n;
        var r = My(n);
        return r && e.contains(r)
          ? r
          : (console.error(
              "aria-hidden",
              n,
              "in not contained inside",
              e,
              ". Doing nothing",
            ),
            null);
      })
      .filter(function (n) {
        return !!n;
      });
  },
  $E = function (e, t, n, r) {
    var o = zE(t, Array.isArray(e) ? e : [e]);
    Bi[n] || (Bi[n] = new WeakMap());
    var s = Bi[n],
      a = [],
      l = new Set(),
      c = new Set(o),
      u = function (p) {
        !p || l.has(p) || (l.add(p), u(p.parentNode));
      };
    o.forEach(u);
    var d = function (p) {
      !p ||
        c.has(p) ||
        Array.prototype.forEach.call(p.children, function (m) {
          if (l.has(m)) d(m);
          else
            try {
              var g = m.getAttribute(r),
                S = g !== null && g !== "false",
                h = (no.get(m) || 0) + 1,
                w = (s.get(m) || 0) + 1;
              (no.set(m, h),
                s.set(m, w),
                a.push(m),
                h === 1 && S && Ui.set(m, !0),
                w === 1 && m.setAttribute(n, "true"),
                S || m.setAttribute(r, "true"));
            } catch (y) {
              console.error("aria-hidden: cannot operate on ", m, y);
            }
        });
    };
    return (
      d(t),
      l.clear(),
      fc++,
      function () {
        (a.forEach(function (p) {
          var m = no.get(p) - 1,
            g = s.get(p) - 1;
          (no.set(p, m),
            s.set(p, g),
            m || (Ui.has(p) || p.removeAttribute(r), Ui.delete(p)),
            g || p.removeAttribute(n));
        }),
          fc--,
          fc ||
            ((no = new WeakMap()),
            (no = new WeakMap()),
            (Ui = new WeakMap()),
            (Bi = {})));
      }
    );
  },
  _y = function (e, t, n) {
    n === void 0 && (n = "data-aria-hidden");
    var r = Array.from(Array.isArray(e) ? e : [e]),
      o = FE(e);
    return o
      ? (r.push.apply(r, Array.from(o.querySelectorAll("[aria-live]"))),
        $E(r, o, n, "aria-hidden"))
      : function () {
          return null;
        };
  },
  an = function () {
    return (
      (an =
        Object.assign ||
        function (t) {
          for (var n, r = 1, o = arguments.length; r < o; r++) {
            n = arguments[r];
            for (var s in n)
              Object.prototype.hasOwnProperty.call(n, s) && (t[s] = n[s]);
          }
          return t;
        }),
      an.apply(this, arguments)
    );
  };
function Dy(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) &&
      t.indexOf(r) < 0 &&
      (n[r] = e[r]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
        (n[r[o]] = e[r[o]]);
  return n;
}
function UE(e, t, n) {
  if (n || arguments.length === 2)
    for (var r = 0, o = t.length, s; r < o; r++)
      (s || !(r in t)) &&
        (s || (s = Array.prototype.slice.call(t, 0, r)), (s[r] = t[r]));
  return e.concat(s || Array.prototype.slice.call(t));
}
var ia = "right-scroll-bar-position",
  aa = "width-before-scroll-bar",
  BE = "with-scroll-bars-hidden",
  VE = "--removed-body-scroll-bar-size";
function pc(e, t) {
  return (typeof e == "function" ? e(t) : e && (e.current = t), e);
}
function WE(e, t) {
  var n = f.useState(function () {
    return {
      value: e,
      callback: t,
      facade: {
        get current() {
          return n.value;
        },
        set current(r) {
          var o = n.value;
          o !== r && ((n.value = r), n.callback(r, o));
        },
      },
    };
  })[0];
  return ((n.callback = t), n.facade);
}
var HE = typeof window < "u" ? f.useLayoutEffect : f.useEffect,
  yh = new WeakMap();
function KE(e, t) {
  var n = WE(null, function (r) {
    return e.forEach(function (o) {
      return pc(o, r);
    });
  });
  return (
    HE(
      function () {
        var r = yh.get(n);
        if (r) {
          var o = new Set(r),
            s = new Set(e),
            a = n.current;
          (o.forEach(function (l) {
            s.has(l) || pc(l, null);
          }),
            s.forEach(function (l) {
              o.has(l) || pc(l, a);
            }));
        }
        yh.set(n, e);
      },
      [e],
    ),
    n
  );
}
function QE(e) {
  return e;
}
function qE(e, t) {
  t === void 0 && (t = QE);
  var n = [],
    r = !1,
    o = {
      read: function () {
        if (r)
          throw new Error(
            "Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.",
          );
        return n.length ? n[n.length - 1] : e;
      },
      useMedium: function (s) {
        var a = t(s, r);
        return (
          n.push(a),
          function () {
            n = n.filter(function (l) {
              return l !== a;
            });
          }
        );
      },
      assignSyncMedium: function (s) {
        for (r = !0; n.length;) {
          var a = n;
          ((n = []), a.forEach(s));
        }
        n = {
          push: function (l) {
            return s(l);
          },
          filter: function () {
            return n;
          },
        };
      },
      assignMedium: function (s) {
        r = !0;
        var a = [];
        if (n.length) {
          var l = n;
          ((n = []), l.forEach(s), (a = n));
        }
        var c = function () {
            var d = a;
            ((a = []), d.forEach(s));
          },
          u = function () {
            return Promise.resolve().then(c);
          };
        (u(),
          (n = {
            push: function (d) {
              (a.push(d), u());
            },
            filter: function (d) {
              return ((a = a.filter(d)), n);
            },
          }));
      },
    };
  return o;
}
function GE(e) {
  e === void 0 && (e = {});
  var t = qE(null);
  return ((t.options = an({ async: !0, ssr: !1 }, e)), t);
}
var Ly = function (e) {
  var t = e.sideCar,
    n = Dy(e, ["sideCar"]);
  if (!t)
    throw new Error(
      "Sidecar: please provide `sideCar` property to import the right car",
    );
  var r = t.read();
  if (!r) throw new Error("Sidecar medium not found");
  return f.createElement(r, an({}, n));
};
Ly.isSideCarExport = !0;
function YE(e, t) {
  return (e.useMedium(t), Ly);
}
var Fy = GE(),
  hc = function () {},
  Sl = f.forwardRef(function (e, t) {
    var n = f.useRef(null),
      r = f.useState({
        onScrollCapture: hc,
        onWheelCapture: hc,
        onTouchMoveCapture: hc,
      }),
      o = r[0],
      s = r[1],
      a = e.forwardProps,
      l = e.children,
      c = e.className,
      u = e.removeScrollBar,
      d = e.enabled,
      p = e.shards,
      m = e.sideCar,
      g = e.noRelative,
      S = e.noIsolation,
      h = e.inert,
      w = e.allowPinchZoom,
      y = e.as,
      v = y === void 0 ? "div" : y,
      x = e.gapMode,
      j = Dy(e, [
        "forwardProps",
        "children",
        "className",
        "removeScrollBar",
        "enabled",
        "shards",
        "sideCar",
        "noRelative",
        "noIsolation",
        "inert",
        "allowPinchZoom",
        "as",
        "gapMode",
      ]),
      b = m,
      N = KE([n, t]),
      C = an(an({}, j), o);
    return f.createElement(
      f.Fragment,
      null,
      d &&
        f.createElement(b, {
          sideCar: Fy,
          removeScrollBar: u,
          shards: p,
          noRelative: g,
          noIsolation: S,
          inert: h,
          setCallbacks: s,
          allowPinchZoom: !!w,
          lockRef: n,
          gapMode: x,
        }),
      a
        ? f.cloneElement(f.Children.only(l), an(an({}, C), { ref: N }))
        : f.createElement(v, an({}, C, { className: c, ref: N }), l),
    );
  });
Sl.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 };
Sl.classNames = { fullWidth: aa, zeroRight: ia };
var XE = function () {
  if (typeof __webpack_nonce__ < "u") return __webpack_nonce__;
};
function JE() {
  if (!document) return null;
  var e = document.createElement("style");
  e.type = "text/css";
  var t = XE();
  return (t && e.setAttribute("nonce", t), e);
}
function ZE(e, t) {
  e.styleSheet
    ? (e.styleSheet.cssText = t)
    : e.appendChild(document.createTextNode(t));
}
function e2(e) {
  var t = document.head || document.getElementsByTagName("head")[0];
  t.appendChild(e);
}
var t2 = function () {
    var e = 0,
      t = null;
    return {
      add: function (n) {
        (e == 0 && (t = JE()) && (ZE(t, n), e2(t)), e++);
      },
      remove: function () {
        (e--,
          !e && t && (t.parentNode && t.parentNode.removeChild(t), (t = null)));
      },
    };
  },
  n2 = function () {
    var e = t2();
    return function (t, n) {
      f.useEffect(
        function () {
          return (
            e.add(t),
            function () {
              e.remove();
            }
          );
        },
        [t && n],
      );
    };
  },
  zy = function () {
    var e = n2(),
      t = function (n) {
        var r = n.styles,
          o = n.dynamic;
        return (e(r, o), null);
      };
    return t;
  },
  r2 = { left: 0, top: 0, right: 0, gap: 0 },
  mc = function (e) {
    return parseInt(e || "", 10) || 0;
  },
  o2 = function (e) {
    var t = window.getComputedStyle(document.body),
      n = t[e === "padding" ? "paddingLeft" : "marginLeft"],
      r = t[e === "padding" ? "paddingTop" : "marginTop"],
      o = t[e === "padding" ? "paddingRight" : "marginRight"];
    return [mc(n), mc(r), mc(o)];
  },
  s2 = function (e) {
    if ((e === void 0 && (e = "margin"), typeof window > "u")) return r2;
    var t = o2(e),
      n = document.documentElement.clientWidth,
      r = window.innerWidth;
    return {
      left: t[0],
      top: t[1],
      right: t[2],
      gap: Math.max(0, r - n + t[2] - t[0]),
    };
  },
  i2 = zy(),
  ko = "data-scroll-locked",
  a2 = function (e, t, n, r) {
    var o = e.left,
      s = e.top,
      a = e.right,
      l = e.gap;
    return (
      n === void 0 && (n = "margin"),
      `
  .`
        .concat(
          BE,
          ` {
   overflow: hidden `,
        )
        .concat(
          r,
          `;
   padding-right: `,
        )
        .concat(l, "px ")
        .concat(
          r,
          `;
  }
  body[`,
        )
        .concat(
          ko,
          `] {
    overflow: hidden `,
        )
        .concat(
          r,
          `;
    overscroll-behavior: contain;
    `,
        )
        .concat(
          [
            t && "position: relative ".concat(r, ";"),
            n === "margin" &&
              `
    padding-left: `
                .concat(
                  o,
                  `px;
    padding-top: `,
                )
                .concat(
                  s,
                  `px;
    padding-right: `,
                )
                .concat(
                  a,
                  `px;
    margin-left:0;
    margin-top:0;
    margin-right: `,
                )
                .concat(l, "px ")
                .concat(
                  r,
                  `;
    `,
                ),
            n === "padding" &&
              "padding-right: ".concat(l, "px ").concat(r, ";"),
          ]
            .filter(Boolean)
            .join(""),
          `
  }
  
  .`,
        )
        .concat(
          ia,
          ` {
    right: `,
        )
        .concat(l, "px ")
        .concat(
          r,
          `;
  }
  
  .`,
        )
        .concat(
          aa,
          ` {
    margin-right: `,
        )
        .concat(l, "px ")
        .concat(
          r,
          `;
  }
  
  .`,
        )
        .concat(ia, " .")
        .concat(
          ia,
          ` {
    right: 0 `,
        )
        .concat(
          r,
          `;
  }
  
  .`,
        )
        .concat(aa, " .")
        .concat(
          aa,
          ` {
    margin-right: 0 `,
        )
        .concat(
          r,
          `;
  }
  
  body[`,
        )
        .concat(
          ko,
          `] {
    `,
        )
        .concat(VE, ": ")
        .concat(
          l,
          `px;
  }
`,
        )
    );
  },
  xh = function () {
    var e = parseInt(document.body.getAttribute(ko) || "0", 10);
    return isFinite(e) ? e : 0;
  },
  l2 = function () {
    f.useEffect(function () {
      return (
        document.body.setAttribute(ko, (xh() + 1).toString()),
        function () {
          var e = xh() - 1;
          e <= 0
            ? document.body.removeAttribute(ko)
            : document.body.setAttribute(ko, e.toString());
        }
      );
    }, []);
  },
  c2 = function (e) {
    var t = e.noRelative,
      n = e.noImportant,
      r = e.gapMode,
      o = r === void 0 ? "margin" : r;
    l2();
    var s = f.useMemo(
      function () {
        return s2(o);
      },
      [o],
    );
    return f.createElement(i2, { styles: a2(s, !t, o, n ? "" : "!important") });
  },
  Eu = !1;
if (typeof window < "u")
  try {
    var Vi = Object.defineProperty({}, "passive", {
      get: function () {
        return ((Eu = !0), !0);
      },
    });
    (window.addEventListener("test", Vi, Vi),
      window.removeEventListener("test", Vi, Vi));
  } catch {
    Eu = !1;
  }
var ro = Eu ? { passive: !1 } : !1,
  u2 = function (e) {
    return e.tagName === "TEXTAREA";
  },
  $y = function (e, t) {
    if (!(e instanceof Element)) return !1;
    var n = window.getComputedStyle(e);
    return (
      n[t] !== "hidden" &&
      !(n.overflowY === n.overflowX && !u2(e) && n[t] === "visible")
    );
  },
  d2 = function (e) {
    return $y(e, "overflowY");
  },
  f2 = function (e) {
    return $y(e, "overflowX");
  },
  wh = function (e, t) {
    var n = t.ownerDocument,
      r = t;
    do {
      typeof ShadowRoot < "u" && r instanceof ShadowRoot && (r = r.host);
      var o = Uy(e, r);
      if (o) {
        var s = By(e, r),
          a = s[1],
          l = s[2];
        if (a > l) return !0;
      }
      r = r.parentNode;
    } while (r && r !== n.body);
    return !1;
  },
  p2 = function (e) {
    var t = e.scrollTop,
      n = e.scrollHeight,
      r = e.clientHeight;
    return [t, n, r];
  },
  h2 = function (e) {
    var t = e.scrollLeft,
      n = e.scrollWidth,
      r = e.clientWidth;
    return [t, n, r];
  },
  Uy = function (e, t) {
    return e === "v" ? d2(t) : f2(t);
  },
  By = function (e, t) {
    return e === "v" ? p2(t) : h2(t);
  },
  m2 = function (e, t) {
    return e === "h" && t === "rtl" ? -1 : 1;
  },
  g2 = function (e, t, n, r, o) {
    var s = m2(e, window.getComputedStyle(t).direction),
      a = s * r,
      l = n.target,
      c = t.contains(l),
      u = !1,
      d = a > 0,
      p = 0,
      m = 0;
    do {
      if (!l) break;
      var g = By(e, l),
        S = g[0],
        h = g[1],
        w = g[2],
        y = h - w - s * S;
      (S || y) && Uy(e, l) && ((p += y), (m += S));
      var v = l.parentNode;
      l = v && v.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? v.host : v;
    } while ((!c && l !== document.body) || (c && (t.contains(l) || t === l)));
    return (
      ((d && (Math.abs(p) < 1 || !o)) || (!d && (Math.abs(m) < 1 || !o))) &&
        (u = !0),
      u
    );
  },
  Wi = function (e) {
    return "changedTouches" in e
      ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY]
      : [0, 0];
  },
  Sh = function (e) {
    return [e.deltaX, e.deltaY];
  },
  jh = function (e) {
    return e && "current" in e ? e.current : e;
  },
  v2 = function (e, t) {
    return e[0] === t[0] && e[1] === t[1];
  },
  y2 = function (e) {
    return `
  .block-interactivity-`
      .concat(
        e,
        ` {pointer-events: none;}
  .allow-interactivity-`,
      )
      .concat(
        e,
        ` {pointer-events: all;}
`,
      );
  },
  x2 = 0,
  oo = [];
function w2(e) {
  var t = f.useRef([]),
    n = f.useRef([0, 0]),
    r = f.useRef(),
    o = f.useState(x2++)[0],
    s = f.useState(zy)[0],
    a = f.useRef(e);
  (f.useEffect(
    function () {
      a.current = e;
    },
    [e],
  ),
    f.useEffect(
      function () {
        if (e.inert) {
          document.body.classList.add("block-interactivity-".concat(o));
          var h = UE([e.lockRef.current], (e.shards || []).map(jh), !0).filter(
            Boolean,
          );
          return (
            h.forEach(function (w) {
              return w.classList.add("allow-interactivity-".concat(o));
            }),
            function () {
              (document.body.classList.remove("block-interactivity-".concat(o)),
                h.forEach(function (w) {
                  return w.classList.remove("allow-interactivity-".concat(o));
                }));
            }
          );
        }
      },
      [e.inert, e.lockRef.current, e.shards],
    ));
  var l = f.useCallback(function (h, w) {
      if (
        ("touches" in h && h.touches.length === 2) ||
        (h.type === "wheel" && h.ctrlKey)
      )
        return !a.current.allowPinchZoom;
      var y = Wi(h),
        v = n.current,
        x = "deltaX" in h ? h.deltaX : v[0] - y[0],
        j = "deltaY" in h ? h.deltaY : v[1] - y[1],
        b,
        N = h.target,
        C = Math.abs(x) > Math.abs(j) ? "h" : "v";
      if ("touches" in h && C === "h" && N.type === "range") return !1;
      var T = wh(C, N);
      if (!T) return !0;
      if ((T ? (b = C) : ((b = C === "v" ? "h" : "v"), (T = wh(C, N))), !T))
        return !1;
      if (
        (!r.current && "changedTouches" in h && (x || j) && (r.current = b), !b)
      )
        return !0;
      var I = r.current || b;
      return g2(I, w, h, I === "h" ? x : j, !0);
    }, []),
    c = f.useCallback(function (h) {
      var w = h;
      if (!(!oo.length || oo[oo.length - 1] !== s)) {
        var y = "deltaY" in w ? Sh(w) : Wi(w),
          v = t.current.filter(function (b) {
            return (
              b.name === w.type &&
              (b.target === w.target || w.target === b.shadowParent) &&
              v2(b.delta, y)
            );
          })[0];
        if (v && v.should) {
          w.cancelable && w.preventDefault();
          return;
        }
        if (!v) {
          var x = (a.current.shards || [])
              .map(jh)
              .filter(Boolean)
              .filter(function (b) {
                return b.contains(w.target);
              }),
            j = x.length > 0 ? l(w, x[0]) : !a.current.noIsolation;
          j && w.cancelable && w.preventDefault();
        }
      }
    }, []),
    u = f.useCallback(function (h, w, y, v) {
      var x = { name: h, delta: w, target: y, should: v, shadowParent: S2(y) };
      (t.current.push(x),
        setTimeout(function () {
          t.current = t.current.filter(function (j) {
            return j !== x;
          });
        }, 1));
    }, []),
    d = f.useCallback(function (h) {
      ((n.current = Wi(h)), (r.current = void 0));
    }, []),
    p = f.useCallback(function (h) {
      u(h.type, Sh(h), h.target, l(h, e.lockRef.current));
    }, []),
    m = f.useCallback(function (h) {
      u(h.type, Wi(h), h.target, l(h, e.lockRef.current));
    }, []);
  f.useEffect(function () {
    return (
      oo.push(s),
      e.setCallbacks({
        onScrollCapture: p,
        onWheelCapture: p,
        onTouchMoveCapture: m,
      }),
      document.addEventListener("wheel", c, ro),
      document.addEventListener("touchmove", c, ro),
      document.addEventListener("touchstart", d, ro),
      function () {
        ((oo = oo.filter(function (h) {
          return h !== s;
        })),
          document.removeEventListener("wheel", c, ro),
          document.removeEventListener("touchmove", c, ro),
          document.removeEventListener("touchstart", d, ro));
      }
    );
  }, []);
  var g = e.removeScrollBar,
    S = e.inert;
  return f.createElement(
    f.Fragment,
    null,
    S ? f.createElement(s, { styles: y2(o) }) : null,
    g
      ? f.createElement(c2, { noRelative: e.noRelative, gapMode: e.gapMode })
      : null,
  );
}
function S2(e) {
  for (var t = null; e !== null;)
    (e instanceof ShadowRoot && ((t = e.host), (e = e.host)),
      (e = e.parentNode));
  return t;
}
const j2 = YE(Fy, w2);
var Zd = f.forwardRef(function (e, t) {
  return f.createElement(Sl, an({}, e, { ref: t, sideCar: j2 }));
});
Zd.classNames = Sl.classNames;
var b2 = [" ", "Enter", "ArrowUp", "ArrowDown"],
  N2 = [" ", "Enter"],
  Vr = "Select",
  [jl, bl, C2] = Gg(Vr),
  [is, eP] = Gr(Vr, [C2, hl]),
  Nl = hl(),
  [E2, mr] = is(Vr),
  [k2, P2] = is(Vr),
  Vy = (e) => {
    const {
        __scopeSelect: t,
        children: n,
        open: r,
        defaultOpen: o,
        onOpenChange: s,
        value: a,
        defaultValue: l,
        onValueChange: c,
        dir: u,
        name: d,
        autoComplete: p,
        disabled: m,
        required: g,
        form: S,
      } = e,
      h = Nl(t),
      [w, y] = f.useState(null),
      [v, x] = f.useState(null),
      [j, b] = f.useState(!1),
      N = TE(u),
      [C, T] = Ia({ prop: r, defaultProp: o ?? !1, onChange: s, caller: Vr }),
      [I, O] = Ia({ prop: a, defaultProp: l, onChange: c, caller: Vr }),
      $ = f.useRef(null),
      _ = w ? S || !!w.closest("form") : !0,
      [V, M] = f.useState(new Set()),
      H = Array.from(V)
        .map((z) => z.props.value)
        .join(";");
    return i.jsx(wN, {
      ...h,
      children: i.jsxs(E2, {
        required: g,
        scope: t,
        trigger: w,
        onTriggerChange: y,
        valueNode: v,
        onValueNodeChange: x,
        valueNodeHasChildren: j,
        onValueNodeHasChildrenChange: b,
        contentId: Co(),
        value: I,
        onValueChange: O,
        open: C,
        onOpenChange: T,
        dir: N,
        triggerPointerDownPosRef: $,
        disabled: m,
        children: [
          i.jsx(jl.Provider, {
            scope: t,
            children: i.jsx(k2, {
              scope: e.__scopeSelect,
              onNativeOptionAdd: f.useCallback((z) => {
                M((B) => new Set(B).add(z));
              }, []),
              onNativeOptionRemove: f.useCallback((z) => {
                M((B) => {
                  const E = new Set(B);
                  return (E.delete(z), E);
                });
              }, []),
              children: n,
            }),
          }),
          _
            ? i.jsxs(
                px,
                {
                  "aria-hidden": !0,
                  required: g,
                  tabIndex: -1,
                  name: d,
                  autoComplete: p,
                  value: I,
                  onChange: (z) => O(z.target.value),
                  disabled: m,
                  form: S,
                  children: [
                    I === void 0 ? i.jsx("option", { value: "" }) : null,
                    Array.from(V),
                  ],
                },
                H,
              )
            : null,
        ],
      }),
    });
  };
Vy.displayName = Vr;
var Wy = "SelectTrigger",
  Hy = f.forwardRef((e, t) => {
    const { __scopeSelect: n, disabled: r = !1, ...o } = e,
      s = Nl(n),
      a = mr(Wy, n),
      l = a.disabled || r,
      c = Ne(t, a.onTriggerChange),
      u = bl(n),
      d = f.useRef("touch"),
      [p, m, g] = mx((h) => {
        const w = u().filter((x) => !x.disabled),
          y = w.find((x) => x.value === a.value),
          v = gx(w, h, y);
        v !== void 0 && a.onValueChange(v.value);
      }),
      S = (h) => {
        (l || (a.onOpenChange(!0), g()),
          h &&
            (a.triggerPointerDownPosRef.current = {
              x: Math.round(h.pageX),
              y: Math.round(h.pageY),
            }));
      };
    return i.jsx(ny, {
      asChild: !0,
      ...s,
      children: i.jsx(ne.button, {
        type: "button",
        role: "combobox",
        "aria-controls": a.contentId,
        "aria-expanded": a.open,
        "aria-required": a.required,
        "aria-autocomplete": "none",
        dir: a.dir,
        "data-state": a.open ? "open" : "closed",
        disabled: l,
        "data-disabled": l ? "" : void 0,
        "data-placeholder": hx(a.value) ? "" : void 0,
        ...o,
        ref: c,
        onClick: ee(o.onClick, (h) => {
          (h.currentTarget.focus(), d.current !== "mouse" && S(h));
        }),
        onPointerDown: ee(o.onPointerDown, (h) => {
          d.current = h.pointerType;
          const w = h.target;
          (w.hasPointerCapture(h.pointerId) &&
            w.releasePointerCapture(h.pointerId),
            h.button === 0 &&
              h.ctrlKey === !1 &&
              h.pointerType === "mouse" &&
              (S(h), h.preventDefault()));
        }),
        onKeyDown: ee(o.onKeyDown, (h) => {
          const w = p.current !== "";
          (!(h.ctrlKey || h.altKey || h.metaKey) &&
            h.key.length === 1 &&
            m(h.key),
            !(w && h.key === " ") &&
              b2.includes(h.key) &&
              (S(), h.preventDefault()));
        }),
      }),
    });
  });
Hy.displayName = Wy;
var Ky = "SelectValue",
  Qy = f.forwardRef((e, t) => {
    const {
        __scopeSelect: n,
        className: r,
        style: o,
        children: s,
        placeholder: a = "",
        ...l
      } = e,
      c = mr(Ky, n),
      { onValueNodeHasChildrenChange: u } = c,
      d = s !== void 0,
      p = Ne(t, c.onValueNodeChange);
    return (
      Ue(() => {
        u(d);
      }, [u, d]),
      i.jsx(ne.span, {
        ...l,
        ref: p,
        style: { pointerEvents: "none" },
        children: hx(c.value) ? i.jsx(i.Fragment, { children: a }) : s,
      })
    );
  });
Qy.displayName = Ky;
var T2 = "SelectIcon",
  qy = f.forwardRef((e, t) => {
    const { __scopeSelect: n, children: r, ...o } = e;
    return i.jsx(ne.span, {
      "aria-hidden": !0,
      ...o,
      ref: t,
      children: r || "▼",
    });
  });
qy.displayName = T2;
var R2 = "SelectPortal",
  Gy = (e) => i.jsx(il, { asChild: !0, ...e });
Gy.displayName = R2;
var Wr = "SelectContent",
  Yy = f.forwardRef((e, t) => {
    const n = mr(Wr, e.__scopeSelect),
      [r, o] = f.useState();
    if (
      (Ue(() => {
        o(new DocumentFragment());
      }, []),
      !n.open)
    ) {
      const s = r;
      return s
        ? qr.createPortal(
            i.jsx(Xy, {
              scope: e.__scopeSelect,
              children: i.jsx(jl.Slot, {
                scope: e.__scopeSelect,
                children: i.jsx("div", { children: e.children }),
              }),
            }),
            s,
          )
        : null;
    }
    return i.jsx(Jy, { ...e, ref: t });
  });
Yy.displayName = Wr;
var zt = 10,
  [Xy, gr] = is(Wr),
  A2 = "SelectContentImpl",
  I2 = Vo("SelectContent.RemoveScroll"),
  Jy = f.forwardRef((e, t) => {
    const {
        __scopeSelect: n,
        position: r = "item-aligned",
        onCloseAutoFocus: o,
        onEscapeKeyDown: s,
        onPointerDownOutside: a,
        side: l,
        sideOffset: c,
        align: u,
        alignOffset: d,
        arrowPadding: p,
        collisionBoundary: m,
        collisionPadding: g,
        sticky: S,
        hideWhenDetached: h,
        avoidCollisions: w,
        ...y
      } = e,
      v = mr(Wr, n),
      [x, j] = f.useState(null),
      [b, N] = f.useState(null),
      C = Ne(t, (L) => j(L)),
      [T, I] = f.useState(null),
      [O, $] = f.useState(null),
      _ = bl(n),
      [V, M] = f.useState(!1),
      H = f.useRef(!1);
    (f.useEffect(() => {
      if (x) return _y(x);
    }, [x]),
      Iy());
    const z = f.useCallback(
        (L) => {
          const [pe, ...Ie] = _().map((le) => le.ref.current),
            [de] = Ie.slice(-1),
            oe = document.activeElement;
          for (const le of L)
            if (
              le === oe ||
              (le == null || le.scrollIntoView({ block: "nearest" }),
              le === pe && b && (b.scrollTop = 0),
              le === de && b && (b.scrollTop = b.scrollHeight),
              le == null || le.focus(),
              document.activeElement !== oe)
            )
              return;
        },
        [_, b],
      ),
      B = f.useCallback(() => z([T, x]), [z, T, x]);
    f.useEffect(() => {
      V && B();
    }, [V, B]);
    const { onOpenChange: E, triggerPointerDownPosRef: P } = v;
    (f.useEffect(() => {
      if (x) {
        let L = { x: 0, y: 0 };
        const pe = (de) => {
            var oe, le;
            L = {
              x: Math.abs(
                Math.round(de.pageX) -
                  (((oe = P.current) == null ? void 0 : oe.x) ?? 0),
              ),
              y: Math.abs(
                Math.round(de.pageY) -
                  (((le = P.current) == null ? void 0 : le.y) ?? 0),
              ),
            };
          },
          Ie = (de) => {
            (L.x <= 10 && L.y <= 10
              ? de.preventDefault()
              : x.contains(de.target) || E(!1),
              document.removeEventListener("pointermove", pe),
              (P.current = null));
          };
        return (
          P.current !== null &&
            (document.addEventListener("pointermove", pe),
            document.addEventListener("pointerup", Ie, {
              capture: !0,
              once: !0,
            })),
          () => {
            (document.removeEventListener("pointermove", pe),
              document.removeEventListener("pointerup", Ie, { capture: !0 }));
          }
        );
      }
    }, [x, E, P]),
      f.useEffect(() => {
        const L = () => E(!1);
        return (
          window.addEventListener("blur", L),
          window.addEventListener("resize", L),
          () => {
            (window.removeEventListener("blur", L),
              window.removeEventListener("resize", L));
          }
        );
      }, [E]));
    const [D, W] = mx((L) => {
        const pe = _().filter((oe) => !oe.disabled),
          Ie = pe.find((oe) => oe.ref.current === document.activeElement),
          de = gx(pe, L, Ie);
        de && setTimeout(() => de.ref.current.focus());
      }),
      U = f.useCallback(
        (L, pe, Ie) => {
          const de = !H.current && !Ie;
          ((v.value !== void 0 && v.value === pe) || de) &&
            (I(L), de && (H.current = !0));
        },
        [v.value],
      ),
      J = f.useCallback(() => (x == null ? void 0 : x.focus()), [x]),
      Q = f.useCallback(
        (L, pe, Ie) => {
          const de = !H.current && !Ie;
          ((v.value !== void 0 && v.value === pe) || de) && $(L);
        },
        [v.value],
      ),
      xe = r === "popper" ? ku : Zy,
      Ae =
        xe === ku
          ? {
              side: l,
              sideOffset: c,
              align: u,
              alignOffset: d,
              arrowPadding: p,
              collisionBoundary: m,
              collisionPadding: g,
              sticky: S,
              hideWhenDetached: h,
              avoidCollisions: w,
            }
          : {};
    return i.jsx(Xy, {
      scope: n,
      content: x,
      viewport: b,
      onViewportChange: N,
      itemRefCallback: U,
      selectedItem: T,
      onItemLeave: J,
      itemTextRefCallback: Q,
      focusSelectedItem: B,
      selectedItemText: O,
      position: r,
      isPositioned: V,
      searchRef: D,
      children: i.jsx(Zd, {
        as: I2,
        allowPinchZoom: !0,
        children: i.jsx(Jd, {
          asChild: !0,
          trapped: v.open,
          onMountAutoFocus: (L) => {
            L.preventDefault();
          },
          onUnmountAutoFocus: ee(o, (L) => {
            var pe;
            ((pe = v.trigger) == null || pe.focus({ preventScroll: !0 }),
              L.preventDefault());
          }),
          children: i.jsx(hi, {
            asChild: !0,
            disableOutsidePointerEvents: !0,
            onEscapeKeyDown: s,
            onPointerDownOutside: a,
            onFocusOutside: (L) => L.preventDefault(),
            onDismiss: () => v.onOpenChange(!1),
            children: i.jsx(xe, {
              role: "listbox",
              id: v.contentId,
              "data-state": v.open ? "open" : "closed",
              dir: v.dir,
              onContextMenu: (L) => L.preventDefault(),
              ...y,
              ...Ae,
              onPlaced: () => M(!0),
              ref: C,
              style: {
                display: "flex",
                flexDirection: "column",
                outline: "none",
                ...y.style,
              },
              onKeyDown: ee(y.onKeyDown, (L) => {
                const pe = L.ctrlKey || L.altKey || L.metaKey;
                if (
                  (L.key === "Tab" && L.preventDefault(),
                  !pe && L.key.length === 1 && W(L.key),
                  ["ArrowUp", "ArrowDown", "Home", "End"].includes(L.key))
                ) {
                  let de = _()
                    .filter((oe) => !oe.disabled)
                    .map((oe) => oe.ref.current);
                  if (
                    (["ArrowUp", "End"].includes(L.key) &&
                      (de = de.slice().reverse()),
                    ["ArrowUp", "ArrowDown"].includes(L.key))
                  ) {
                    const oe = L.target,
                      le = de.indexOf(oe);
                    de = de.slice(le + 1);
                  }
                  (setTimeout(() => z(de)), L.preventDefault());
                }
              }),
            }),
          }),
        }),
      }),
    });
  });
Jy.displayName = A2;
var O2 = "SelectItemAlignedPosition",
  Zy = f.forwardRef((e, t) => {
    const { __scopeSelect: n, onPlaced: r, ...o } = e,
      s = mr(Wr, n),
      a = gr(Wr, n),
      [l, c] = f.useState(null),
      [u, d] = f.useState(null),
      p = Ne(t, (C) => d(C)),
      m = bl(n),
      g = f.useRef(!1),
      S = f.useRef(!0),
      {
        viewport: h,
        selectedItem: w,
        selectedItemText: y,
        focusSelectedItem: v,
      } = a,
      x = f.useCallback(() => {
        if (s.trigger && s.valueNode && l && u && h && w && y) {
          const C = s.trigger.getBoundingClientRect(),
            T = u.getBoundingClientRect(),
            I = s.valueNode.getBoundingClientRect(),
            O = y.getBoundingClientRect();
          if (s.dir !== "rtl") {
            const oe = O.left - T.left,
              le = I.left - oe,
              Ge = C.left - le,
              Nt = C.width + Ge,
              xr = Math.max(Nt, T.width),
              Tn = window.innerWidth - zt,
              wr = fh(le, [zt, Math.max(zt, Tn - xr)]);
            ((l.style.minWidth = Nt + "px"), (l.style.left = wr + "px"));
          } else {
            const oe = T.right - O.right,
              le = window.innerWidth - I.right - oe,
              Ge = window.innerWidth - C.right - le,
              Nt = C.width + Ge,
              xr = Math.max(Nt, T.width),
              Tn = window.innerWidth - zt,
              wr = fh(le, [zt, Math.max(zt, Tn - xr)]);
            ((l.style.minWidth = Nt + "px"), (l.style.right = wr + "px"));
          }
          const $ = m(),
            _ = window.innerHeight - zt * 2,
            V = h.scrollHeight,
            M = window.getComputedStyle(u),
            H = parseInt(M.borderTopWidth, 10),
            z = parseInt(M.paddingTop, 10),
            B = parseInt(M.borderBottomWidth, 10),
            E = parseInt(M.paddingBottom, 10),
            P = H + z + V + E + B,
            D = Math.min(w.offsetHeight * 5, P),
            W = window.getComputedStyle(h),
            U = parseInt(W.paddingTop, 10),
            J = parseInt(W.paddingBottom, 10),
            Q = C.top + C.height / 2 - zt,
            xe = _ - Q,
            Ae = w.offsetHeight / 2,
            L = w.offsetTop + Ae,
            pe = H + z + L,
            Ie = P - pe;
          if (pe <= Q) {
            const oe = $.length > 0 && w === $[$.length - 1].ref.current;
            l.style.bottom = "0px";
            const le = u.clientHeight - h.offsetTop - h.offsetHeight,
              Ge = Math.max(xe, Ae + (oe ? J : 0) + le + B),
              Nt = pe + Ge;
            l.style.height = Nt + "px";
          } else {
            const oe = $.length > 0 && w === $[0].ref.current;
            l.style.top = "0px";
            const Ge = Math.max(Q, H + h.offsetTop + (oe ? U : 0) + Ae) + Ie;
            ((l.style.height = Ge + "px"),
              (h.scrollTop = pe - Q + h.offsetTop));
          }
          ((l.style.margin = `${zt}px 0`),
            (l.style.minHeight = D + "px"),
            (l.style.maxHeight = _ + "px"),
            r == null || r(),
            requestAnimationFrame(() => (g.current = !0)));
        }
      }, [m, s.trigger, s.valueNode, l, u, h, w, y, s.dir, r]);
    Ue(() => x(), [x]);
    const [j, b] = f.useState();
    Ue(() => {
      u && b(window.getComputedStyle(u).zIndex);
    }, [u]);
    const N = f.useCallback(
      (C) => {
        C && S.current === !0 && (x(), v == null || v(), (S.current = !1));
      },
      [x, v],
    );
    return i.jsx(_2, {
      scope: n,
      contentWrapper: l,
      shouldExpandOnScrollRef: g,
      onScrollButtonChange: N,
      children: i.jsx("div", {
        ref: c,
        style: {
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          zIndex: j,
        },
        children: i.jsx(ne.div, {
          ...o,
          ref: p,
          style: { boxSizing: "border-box", maxHeight: "100%", ...o.style },
        }),
      }),
    });
  });
Zy.displayName = O2;
var M2 = "SelectPopperPosition",
  ku = f.forwardRef((e, t) => {
    const {
        __scopeSelect: n,
        align: r = "start",
        collisionPadding: o = zt,
        ...s
      } = e,
      a = Nl(n);
    return i.jsx(ry, {
      ...a,
      ...s,
      ref: t,
      align: r,
      collisionPadding: o,
      style: {
        boxSizing: "border-box",
        ...s.style,
        "--radix-select-content-transform-origin":
          "var(--radix-popper-transform-origin)",
        "--radix-select-content-available-width":
          "var(--radix-popper-available-width)",
        "--radix-select-content-available-height":
          "var(--radix-popper-available-height)",
        "--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
        "--radix-select-trigger-height": "var(--radix-popper-anchor-height)",
      },
    });
  });
ku.displayName = M2;
var [_2, ef] = is(Wr, {}),
  Pu = "SelectViewport",
  ex = f.forwardRef((e, t) => {
    const { __scopeSelect: n, nonce: r, ...o } = e,
      s = gr(Pu, n),
      a = ef(Pu, n),
      l = Ne(t, s.onViewportChange),
      c = f.useRef(0);
    return i.jsxs(i.Fragment, {
      children: [
        i.jsx("style", {
          dangerouslySetInnerHTML: {
            __html:
              "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}",
          },
          nonce: r,
        }),
        i.jsx(jl.Slot, {
          scope: n,
          children: i.jsx(ne.div, {
            "data-radix-select-viewport": "",
            role: "presentation",
            ...o,
            ref: l,
            style: {
              position: "relative",
              flex: 1,
              overflow: "hidden auto",
              ...o.style,
            },
            onScroll: ee(o.onScroll, (u) => {
              const d = u.currentTarget,
                { contentWrapper: p, shouldExpandOnScrollRef: m } = a;
              if (m != null && m.current && p) {
                const g = Math.abs(c.current - d.scrollTop);
                if (g > 0) {
                  const S = window.innerHeight - zt * 2,
                    h = parseFloat(p.style.minHeight),
                    w = parseFloat(p.style.height),
                    y = Math.max(h, w);
                  if (y < S) {
                    const v = y + g,
                      x = Math.min(S, v),
                      j = v - x;
                    ((p.style.height = x + "px"),
                      p.style.bottom === "0px" &&
                        ((d.scrollTop = j > 0 ? j : 0),
                        (p.style.justifyContent = "flex-end")));
                  }
                }
              }
              c.current = d.scrollTop;
            }),
          }),
        }),
      ],
    });
  });
ex.displayName = Pu;
var tx = "SelectGroup",
  [D2, L2] = is(tx),
  F2 = f.forwardRef((e, t) => {
    const { __scopeSelect: n, ...r } = e,
      o = Co();
    return i.jsx(D2, {
      scope: n,
      id: o,
      children: i.jsx(ne.div, {
        role: "group",
        "aria-labelledby": o,
        ...r,
        ref: t,
      }),
    });
  });
F2.displayName = tx;
var nx = "SelectLabel",
  rx = f.forwardRef((e, t) => {
    const { __scopeSelect: n, ...r } = e,
      o = L2(nx, n);
    return i.jsx(ne.div, { id: o.id, ...r, ref: t });
  });
rx.displayName = nx;
var Ba = "SelectItem",
  [z2, ox] = is(Ba),
  sx = f.forwardRef((e, t) => {
    const {
        __scopeSelect: n,
        value: r,
        disabled: o = !1,
        textValue: s,
        ...a
      } = e,
      l = mr(Ba, n),
      c = gr(Ba, n),
      u = l.value === r,
      [d, p] = f.useState(s ?? ""),
      [m, g] = f.useState(!1),
      S = Ne(t, (v) => {
        var x;
        return (x = c.itemRefCallback) == null ? void 0 : x.call(c, v, r, o);
      }),
      h = Co(),
      w = f.useRef("touch"),
      y = () => {
        o || (l.onValueChange(r), l.onOpenChange(!1));
      };
    if (r === "")
      throw new Error(
        "A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.",
      );
    return i.jsx(z2, {
      scope: n,
      value: r,
      disabled: o,
      textId: h,
      isSelected: u,
      onItemTextChange: f.useCallback((v) => {
        p((x) => x || ((v == null ? void 0 : v.textContent) ?? "").trim());
      }, []),
      children: i.jsx(jl.ItemSlot, {
        scope: n,
        value: r,
        disabled: o,
        textValue: d,
        children: i.jsx(ne.div, {
          role: "option",
          "aria-labelledby": h,
          "data-highlighted": m ? "" : void 0,
          "aria-selected": u && m,
          "data-state": u ? "checked" : "unchecked",
          "aria-disabled": o || void 0,
          "data-disabled": o ? "" : void 0,
          tabIndex: o ? void 0 : -1,
          ...a,
          ref: S,
          onFocus: ee(a.onFocus, () => g(!0)),
          onBlur: ee(a.onBlur, () => g(!1)),
          onClick: ee(a.onClick, () => {
            w.current !== "mouse" && y();
          }),
          onPointerUp: ee(a.onPointerUp, () => {
            w.current === "mouse" && y();
          }),
          onPointerDown: ee(a.onPointerDown, (v) => {
            w.current = v.pointerType;
          }),
          onPointerMove: ee(a.onPointerMove, (v) => {
            var x;
            ((w.current = v.pointerType),
              o
                ? (x = c.onItemLeave) == null || x.call(c)
                : w.current === "mouse" &&
                  v.currentTarget.focus({ preventScroll: !0 }));
          }),
          onPointerLeave: ee(a.onPointerLeave, (v) => {
            var x;
            v.currentTarget === document.activeElement &&
              ((x = c.onItemLeave) == null || x.call(c));
          }),
          onKeyDown: ee(a.onKeyDown, (v) => {
            var j;
            (((j = c.searchRef) == null ? void 0 : j.current) !== "" &&
              v.key === " ") ||
              (N2.includes(v.key) && y(), v.key === " " && v.preventDefault());
          }),
        }),
      }),
    });
  });
sx.displayName = Ba;
var bs = "SelectItemText",
  ix = f.forwardRef((e, t) => {
    const { __scopeSelect: n, className: r, style: o, ...s } = e,
      a = mr(bs, n),
      l = gr(bs, n),
      c = ox(bs, n),
      u = P2(bs, n),
      [d, p] = f.useState(null),
      m = Ne(
        t,
        (y) => p(y),
        c.onItemTextChange,
        (y) => {
          var v;
          return (v = l.itemTextRefCallback) == null
            ? void 0
            : v.call(l, y, c.value, c.disabled);
        },
      ),
      g = d == null ? void 0 : d.textContent,
      S = f.useMemo(
        () =>
          i.jsx(
            "option",
            { value: c.value, disabled: c.disabled, children: g },
            c.value,
          ),
        [c.disabled, c.value, g],
      ),
      { onNativeOptionAdd: h, onNativeOptionRemove: w } = u;
    return (
      Ue(() => (h(S), () => w(S)), [h, w, S]),
      i.jsxs(i.Fragment, {
        children: [
          i.jsx(ne.span, { id: c.textId, ...s, ref: m }),
          c.isSelected && a.valueNode && !a.valueNodeHasChildren
            ? qr.createPortal(s.children, a.valueNode)
            : null,
        ],
      })
    );
  });
ix.displayName = bs;
var ax = "SelectItemIndicator",
  lx = f.forwardRef((e, t) => {
    const { __scopeSelect: n, ...r } = e;
    return ox(ax, n).isSelected
      ? i.jsx(ne.span, { "aria-hidden": !0, ...r, ref: t })
      : null;
  });
lx.displayName = ax;
var Tu = "SelectScrollUpButton",
  cx = f.forwardRef((e, t) => {
    const n = gr(Tu, e.__scopeSelect),
      r = ef(Tu, e.__scopeSelect),
      [o, s] = f.useState(!1),
      a = Ne(t, r.onScrollButtonChange);
    return (
      Ue(() => {
        if (n.viewport && n.isPositioned) {
          let l = function () {
            const u = c.scrollTop > 0;
            s(u);
          };
          const c = n.viewport;
          return (
            l(),
            c.addEventListener("scroll", l),
            () => c.removeEventListener("scroll", l)
          );
        }
      }, [n.viewport, n.isPositioned]),
      o
        ? i.jsx(dx, {
            ...e,
            ref: a,
            onAutoScroll: () => {
              const { viewport: l, selectedItem: c } = n;
              l && c && (l.scrollTop = l.scrollTop - c.offsetHeight);
            },
          })
        : null
    );
  });
cx.displayName = Tu;
var Ru = "SelectScrollDownButton",
  ux = f.forwardRef((e, t) => {
    const n = gr(Ru, e.__scopeSelect),
      r = ef(Ru, e.__scopeSelect),
      [o, s] = f.useState(!1),
      a = Ne(t, r.onScrollButtonChange);
    return (
      Ue(() => {
        if (n.viewport && n.isPositioned) {
          let l = function () {
            const u = c.scrollHeight - c.clientHeight,
              d = Math.ceil(c.scrollTop) < u;
            s(d);
          };
          const c = n.viewport;
          return (
            l(),
            c.addEventListener("scroll", l),
            () => c.removeEventListener("scroll", l)
          );
        }
      }, [n.viewport, n.isPositioned]),
      o
        ? i.jsx(dx, {
            ...e,
            ref: a,
            onAutoScroll: () => {
              const { viewport: l, selectedItem: c } = n;
              l && c && (l.scrollTop = l.scrollTop + c.offsetHeight);
            },
          })
        : null
    );
  });
ux.displayName = Ru;
var dx = f.forwardRef((e, t) => {
    const { __scopeSelect: n, onAutoScroll: r, ...o } = e,
      s = gr("SelectScrollButton", n),
      a = f.useRef(null),
      l = bl(n),
      c = f.useCallback(() => {
        a.current !== null &&
          (window.clearInterval(a.current), (a.current = null));
      }, []);
    return (
      f.useEffect(() => () => c(), [c]),
      Ue(() => {
        var d;
        const u = l().find((p) => p.ref.current === document.activeElement);
        (d = u == null ? void 0 : u.ref.current) == null ||
          d.scrollIntoView({ block: "nearest" });
      }, [l]),
      i.jsx(ne.div, {
        "aria-hidden": !0,
        ...o,
        ref: t,
        style: { flexShrink: 0, ...o.style },
        onPointerDown: ee(o.onPointerDown, () => {
          a.current === null && (a.current = window.setInterval(r, 50));
        }),
        onPointerMove: ee(o.onPointerMove, () => {
          var u;
          ((u = s.onItemLeave) == null || u.call(s),
            a.current === null && (a.current = window.setInterval(r, 50)));
        }),
        onPointerLeave: ee(o.onPointerLeave, () => {
          c();
        }),
      })
    );
  }),
  $2 = "SelectSeparator",
  fx = f.forwardRef((e, t) => {
    const { __scopeSelect: n, ...r } = e;
    return i.jsx(ne.div, { "aria-hidden": !0, ...r, ref: t });
  });
fx.displayName = $2;
var Au = "SelectArrow",
  U2 = f.forwardRef((e, t) => {
    const { __scopeSelect: n, ...r } = e,
      o = Nl(n),
      s = mr(Au, n),
      a = gr(Au, n);
    return s.open && a.position === "popper"
      ? i.jsx(oy, { ...o, ...r, ref: t })
      : null;
  });
U2.displayName = Au;
var B2 = "SelectBubbleInput",
  px = f.forwardRef(({ __scopeSelect: e, value: t, ...n }, r) => {
    const o = f.useRef(null),
      s = Ne(r, o),
      a = LE(t);
    return (
      f.useEffect(() => {
        const l = o.current;
        if (!l) return;
        const c = window.HTMLSelectElement.prototype,
          d = Object.getOwnPropertyDescriptor(c, "value").set;
        if (a !== t && d) {
          const p = new Event("change", { bubbles: !0 });
          (d.call(l, t), l.dispatchEvent(p));
        }
      }, [a, t]),
      i.jsx(ne.select, {
        ...n,
        style: { ...ev, ...n.style },
        ref: s,
        defaultValue: t,
      })
    );
  });
px.displayName = B2;
function hx(e) {
  return e === "" || e === void 0;
}
function mx(e) {
  const t = Ot(e),
    n = f.useRef(""),
    r = f.useRef(0),
    o = f.useCallback(
      (a) => {
        const l = n.current + a;
        (t(l),
          (function c(u) {
            ((n.current = u),
              window.clearTimeout(r.current),
              u !== "" && (r.current = window.setTimeout(() => c(""), 1e3)));
          })(l));
      },
      [t],
    ),
    s = f.useCallback(() => {
      ((n.current = ""), window.clearTimeout(r.current));
    }, []);
  return (
    f.useEffect(() => () => window.clearTimeout(r.current), []),
    [n, o, s]
  );
}
function gx(e, t, n) {
  const o = t.length > 1 && Array.from(t).every((u) => u === t[0]) ? t[0] : t,
    s = n ? e.indexOf(n) : -1;
  let a = V2(e, Math.max(s, 0));
  o.length === 1 && (a = a.filter((u) => u !== n));
  const c = a.find((u) =>
    u.textValue.toLowerCase().startsWith(o.toLowerCase()),
  );
  return c !== n ? c : void 0;
}
function V2(e, t) {
  return e.map((n, r) => e[(t + r) % e.length]);
}
var W2 = Vy,
  vx = Hy,
  H2 = Qy,
  K2 = qy,
  Q2 = Gy,
  yx = Yy,
  q2 = ex,
  xx = rx,
  wx = sx,
  G2 = ix,
  Y2 = lx,
  Sx = cx,
  jx = ux,
  bx = fx;
const si = W2,
  ii = H2,
  Qo = f.forwardRef(({ className: e, children: t, ...n }, r) =>
    i.jsxs(vx, {
      ref: r,
      className: X(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        e,
      ),
      ...n,
      children: [
        t,
        i.jsx(K2, {
          asChild: !0,
          children: i.jsx(bv, { className: "h-4 w-4 opacity-50" }),
        }),
      ],
    }),
  );
Qo.displayName = vx.displayName;
const Nx = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx(Sx, {
    ref: n,
    className: X("flex cursor-default items-center justify-center py-1", e),
    ...t,
    children: i.jsx(qS, { className: "h-4 w-4" }),
  }),
);
Nx.displayName = Sx.displayName;
const Cx = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx(jx, {
    ref: n,
    className: X("flex cursor-default items-center justify-center py-1", e),
    ...t,
    children: i.jsx(bv, { className: "h-4 w-4" }),
  }),
);
Cx.displayName = jx.displayName;
const qo = f.forwardRef(
  ({ className: e, children: t, position: n = "popper", ...r }, o) =>
    i.jsx(Q2, {
      children: i.jsxs(yx, {
        ref: o,
        className: X(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          n === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          e,
        ),
        position: n,
        ...r,
        children: [
          i.jsx(Nx, {}),
          i.jsx(q2, {
            className: X(
              "p-1",
              n === "popper" &&
                "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
            ),
            children: t,
          }),
          i.jsx(Cx, {}),
        ],
      }),
    }),
);
qo.displayName = yx.displayName;
const X2 = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx(xx, {
    ref: n,
    className: X("py-1.5 pl-8 pr-2 text-sm font-semibold", e),
    ...t,
  }),
);
X2.displayName = xx.displayName;
const Kt = f.forwardRef(({ className: e, children: t, ...n }, r) =>
  i.jsxs(wx, {
    ref: r,
    className: X(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      e,
    ),
    ...n,
    children: [
      i.jsx("span", {
        className:
          "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
        children: i.jsx(Y2, { children: i.jsx(Cr, { className: "h-4 w-4" }) }),
      }),
      i.jsx(G2, { children: t }),
    ],
  }),
);
Kt.displayName = wx.displayName;
const J2 = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx(bx, { ref: n, className: X("-mx-1 my-1 h-px bg-muted", e), ...t }),
);
J2.displayName = bx.displayName;
const Z2 = [
    "Plomería",
    "Electricidad",
    "Pintura",
    "Carpintería",
    "Refrigeración",
    "Limpieza",
    "Mudanzas",
    "Jardinería",
    "Otros",
  ],
  ek = () => {
    const e = ze(),
      { user: t } = Re(),
      [n, r] = f.useState(!1),
      [o, s] = f.useState({
        title: "",
        description: "",
        category: "",
        budget: "",
        urgency: "media",
        location: "",
      }),
      a = async (l) => {
        (l.preventDefault(), r(!0));
        try {
          if (
            !o.title ||
            !o.description ||
            !o.category ||
            !o.budget ||
            !o.location
          )
            throw new Error("Por favor completá todos los campos");
          const c = parseFloat(o.budget);
          if (isNaN(c) || c <= 0)
            throw new Error("El presupuesto debe ser un número mayor a 0");
          const u = K.createOffer({
            authorId: t.id,
            title: o.title,
            description: o.description,
            category: o.category,
            budget: c,
            urgency: o.urgency,
            location: o.location,
            status: "abierta",
          });
          (be.success("¡Solicitud creada exitosamente!"),
            e(`/u/requests/${u.id}`));
        } catch (c) {
          be.error(c.message || "Error al crear la solicitud");
        } finally {
          r(!1);
        }
      };
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-primary-light via-background to-accent-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
          i.jsxs(Y, {
            className: "max-w-2xl mx-auto shadow-xl",
            children: [
              i.jsxs(ie, {
                children: [
                  i.jsx(ae, {
                    className: "text-2xl",
                    children: "Nueva Solicitud",
                  }),
                  i.jsx(ge, {
                    children:
                      "Describí tu urgencia y recibí propuestas de trabajadores",
                  }),
                ],
              }),
              i.jsx(ue, {
                children: i.jsxs("form", {
                  onSubmit: a,
                  className: "space-y-6",
                  children: [
                    i.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        i.jsx(fe, { htmlFor: "title", children: "Título *" }),
                        i.jsx(ye, {
                          id: "title",
                          placeholder: "Ej: Reparación de pérdida de agua",
                          value: o.title,
                          onChange: (l) => s({ ...o, title: l.target.value }),
                          required: !0,
                        }),
                      ],
                    }),
                    i.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        i.jsx(fe, {
                          htmlFor: "description",
                          children: "Descripción *",
                        }),
                        i.jsx(wl, {
                          id: "description",
                          placeholder:
                            "Describí en detalle el trabajo que necesitás...",
                          rows: 5,
                          value: o.description,
                          onChange: (l) =>
                            s({ ...o, description: l.target.value }),
                          required: !0,
                        }),
                      ],
                    }),
                    i.jsxs("div", {
                      className: "grid md:grid-cols-2 gap-4",
                      children: [
                        i.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            i.jsx(fe, {
                              htmlFor: "category",
                              children: "Categoría *",
                            }),
                            i.jsxs(si, {
                              value: o.category,
                              onValueChange: (l) => s({ ...o, category: l }),
                              children: [
                                i.jsx(Qo, {
                                  id: "category",
                                  children: i.jsx(ii, {
                                    placeholder: "Seleccionar categoría",
                                  }),
                                }),
                                i.jsx(qo, {
                                  children: Z2.map((l) =>
                                    i.jsx(Kt, { value: l, children: l }, l),
                                  ),
                                }),
                              ],
                            }),
                          ],
                        }),
                        i.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            i.jsx(fe, {
                              htmlFor: "urgency",
                              children: "Urgencia *",
                            }),
                            i.jsxs(si, {
                              value: o.urgency,
                              onValueChange: (l) => s({ ...o, urgency: l }),
                              children: [
                                i.jsx(Qo, {
                                  id: "urgency",
                                  children: i.jsx(ii, {}),
                                }),
                                i.jsxs(qo, {
                                  children: [
                                    i.jsx(Kt, {
                                      value: "baja",
                                      children: "Baja",
                                    }),
                                    i.jsx(Kt, {
                                      value: "media",
                                      children: "Media",
                                    }),
                                    i.jsx(Kt, {
                                      value: "alta",
                                      children: "Alta / Urgente",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    i.jsxs("div", {
                      className: "grid md:grid-cols-2 gap-4",
                      children: [
                        i.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            i.jsx(fe, {
                              htmlFor: "budget",
                              children: "Presupuesto (ARS) *",
                            }),
                            i.jsx(ye, {
                              id: "budget",
                              type: "number",
                              placeholder: "5000",
                              value: o.budget,
                              onChange: (l) =>
                                s({ ...o, budget: l.target.value }),
                              required: !0,
                              min: "1",
                            }),
                          ],
                        }),
                        i.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            i.jsx(fe, {
                              htmlFor: "location",
                              children: "Ubicación *",
                            }),
                            i.jsx(ye, {
                              id: "location",
                              placeholder: "Ej: Palermo, CABA",
                              value: o.location,
                              onChange: (l) =>
                                s({ ...o, location: l.target.value }),
                              required: !0,
                            }),
                          ],
                        }),
                      ],
                    }),
                    i.jsxs("div", {
                      className: "flex gap-4",
                      children: [
                        i.jsx(re, {
                          type: "button",
                          variant: "outline",
                          onClick: () => e("/u/home"),
                          className: "flex-1",
                          children: "Cancelar",
                        }),
                        i.jsx(re, {
                          type: "submit",
                          disabled: n,
                          className: "flex-1",
                          children: n
                            ? i.jsxs(i.Fragment, {
                                children: [
                                  i.jsx(es, {
                                    className: "mr-2 h-4 w-4 animate-spin",
                                  }),
                                  "Creando...",
                                ],
                              })
                            : "Publicar Solicitud",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      }),
    });
  };
var Ex = { exports: {} },
  kx = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Go = f;
function tk(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
}
var nk = typeof Object.is == "function" ? Object.is : tk,
  rk = Go.useState,
  ok = Go.useEffect,
  sk = Go.useLayoutEffect,
  ik = Go.useDebugValue;
function ak(e, t) {
  var n = t(),
    r = rk({ inst: { value: n, getSnapshot: t } }),
    o = r[0].inst,
    s = r[1];
  return (
    sk(
      function () {
        ((o.value = n), (o.getSnapshot = t), gc(o) && s({ inst: o }));
      },
      [e, n, t],
    ),
    ok(
      function () {
        return (
          gc(o) && s({ inst: o }),
          e(function () {
            gc(o) && s({ inst: o });
          })
        );
      },
      [e],
    ),
    ik(n),
    n
  );
}
function gc(e) {
  var t = e.getSnapshot;
  e = e.value;
  try {
    var n = t();
    return !nk(e, n);
  } catch {
    return !0;
  }
}
function lk(e, t) {
  return t();
}
var ck =
  typeof window > "u" ||
  typeof window.document > "u" ||
  typeof window.document.createElement > "u"
    ? lk
    : ak;
kx.useSyncExternalStore =
  Go.useSyncExternalStore !== void 0 ? Go.useSyncExternalStore : ck;
Ex.exports = kx;
var uk = Ex.exports;
function dk() {
  return uk.useSyncExternalStore(
    fk,
    () => !0,
    () => !1,
  );
}
function fk() {
  return () => {};
}
var tf = "Avatar",
  [pk, tP] = Gr(tf),
  [hk, Px] = pk(tf),
  Tx = f.forwardRef((e, t) => {
    const { __scopeAvatar: n, ...r } = e,
      [o, s] = f.useState("idle");
    return i.jsx(hk, {
      scope: n,
      imageLoadingStatus: o,
      onImageLoadingStatusChange: s,
      children: i.jsx(ne.span, { ...r, ref: t }),
    });
  });
Tx.displayName = tf;
var Rx = "AvatarImage",
  Ax = f.forwardRef((e, t) => {
    const {
        __scopeAvatar: n,
        src: r,
        onLoadingStatusChange: o = () => {},
        ...s
      } = e,
      a = Px(Rx, n),
      l = mk(r, s),
      c = Ot((u) => {
        (o(u), a.onImageLoadingStatusChange(u));
      });
    return (
      Ue(() => {
        l !== "idle" && c(l);
      }, [l, c]),
      l === "loaded" ? i.jsx(ne.img, { ...s, ref: t, src: r }) : null
    );
  });
Ax.displayName = Rx;
var Ix = "AvatarFallback",
  Ox = f.forwardRef((e, t) => {
    const { __scopeAvatar: n, delayMs: r, ...o } = e,
      s = Px(Ix, n),
      [a, l] = f.useState(r === void 0);
    return (
      f.useEffect(() => {
        if (r !== void 0) {
          const c = window.setTimeout(() => l(!0), r);
          return () => window.clearTimeout(c);
        }
      }, [r]),
      a && s.imageLoadingStatus !== "loaded"
        ? i.jsx(ne.span, { ...o, ref: t })
        : null
    );
  });
Ox.displayName = Ix;
function bh(e, t) {
  return e
    ? t
      ? (e.src !== t && (e.src = t),
        e.complete && e.naturalWidth > 0 ? "loaded" : "loading")
      : "error"
    : "idle";
}
function mk(e, { referrerPolicy: t, crossOrigin: n }) {
  const r = dk(),
    o = f.useRef(null),
    s = r ? (o.current || (o.current = new window.Image()), o.current) : null,
    [a, l] = f.useState(() => bh(s, e));
  return (
    Ue(() => {
      l(bh(s, e));
    }, [s, e]),
    Ue(() => {
      const c = (p) => () => {
        l(p);
      };
      if (!s) return;
      const u = c("loaded"),
        d = c("error");
      return (
        s.addEventListener("load", u),
        s.addEventListener("error", d),
        t && (s.referrerPolicy = t),
        typeof n == "string" && (s.crossOrigin = n),
        () => {
          (s.removeEventListener("load", u), s.removeEventListener("error", d));
        }
      );
    }, [s, n, t]),
    a
  );
}
var Mx = Tx,
  _x = Ax,
  Dx = Ox;
const vr = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx(Mx, {
    ref: n,
    className: X(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      e,
    ),
    ...t,
  }),
);
vr.displayName = Mx.displayName;
const gk = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx(_x, { ref: n, className: X("aspect-square h-full w-full", e), ...t }),
);
gk.displayName = _x.displayName;
const yr = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx(Dx, {
    ref: n,
    className: X(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      e,
    ),
    ...t,
  }),
);
yr.displayName = Dx.displayName;
const vk = () => {
    const { id: e } = Yd(),
      t = ze(),
      { user: n } = Re(),
      r = K.getOffer(e || ""),
      o = K.getProposals({ offerId: e });
    if (!r)
      return i.jsx("div", {
        className: "min-h-screen flex items-center justify-center",
        children: i.jsx("p", { children: "Solicitud no encontrada" }),
      });
    const s = (u) => {
        try {
          (K.updateOffer(r.id, { status: u }),
            be.success("Estado actualizado"),
            window.location.reload());
        } catch (d) {
          be.error(d.message);
        }
      },
      a = (u) => {
        try {
          (K.updateProposal(u, "aceptada"),
            K.updateOffer(r.id, { status: "asignada" }),
            be.success("¡Propuesta aceptada!"),
            window.location.reload());
        } catch (d) {
          be.error(d.message);
        }
      },
      c = ((u) => {
        const d = {
          abierta: {
            label: "Abierta",
            className: "bg-success text-success-foreground",
          },
          asignada: {
            label: "Asignada",
            className: "bg-primary text-primary-foreground",
          },
          cerrada: {
            label: "Cerrada",
            className: "bg-muted text-muted-foreground",
          },
        };
        return d[u] || d.abierta;
      })(r.status);
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-primary-light via-background to-accent-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
          i.jsxs("div", {
            className: "grid lg:grid-cols-3 gap-6",
            children: [
              i.jsxs("div", {
                className: "lg:col-span-2 space-y-6",
                children: [
                  i.jsxs(Y, {
                    className: "shadow-xl",
                    children: [
                      i.jsxs(ie, {
                        children: [
                          i.jsxs("div", {
                            className:
                              "flex justify-between items-start gap-4 mb-2",
                            children: [
                              i.jsxs("div", {
                                className: "flex gap-2",
                                children: [
                                  i.jsx(wn, {
                                    className: c.className,
                                    children: c.label,
                                  }),
                                  i.jsx(Xd, { urgency: r.urgency }),
                                ],
                              }),
                              r.authorId === (n == null ? void 0 : n.id) &&
                                i.jsxs(si, {
                                  value: r.status,
                                  onValueChange: s,
                                  children: [
                                    i.jsx(Qo, {
                                      className: "w-32",
                                      children: i.jsx(ii, {}),
                                    }),
                                    i.jsxs(qo, {
                                      children: [
                                        i.jsx(Kt, {
                                          value: "abierta",
                                          children: "Abierta",
                                        }),
                                        i.jsx(Kt, {
                                          value: "asignada",
                                          children: "Asignada",
                                        }),
                                        i.jsx(Kt, {
                                          value: "cerrada",
                                          children: "Cerrada",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                            ],
                          }),
                          i.jsx(ae, {
                            className: "text-2xl",
                            children: r.title,
                          }),
                          i.jsx(ge, { children: r.description }),
                        ],
                      }),
                      i.jsx(ue, {
                        className: "space-y-4",
                        children: i.jsxs("div", {
                          className: "grid grid-cols-2 gap-4",
                          children: [
                            i.jsxs("div", {
                              className: "flex items-center gap-2 text-sm",
                              children: [
                                i.jsx(Ev, {
                                  className: "h-4 w-4 text-muted-foreground",
                                }),
                                i.jsx("span", { children: r.location }),
                              ],
                            }),
                            i.jsxs("div", {
                              className: "flex items-center gap-2 text-sm",
                              children: [
                                i.jsx(Ad, {
                                  className: "h-4 w-4 text-muted-foreground",
                                }),
                                i.jsxs("span", {
                                  className: "font-semibold",
                                  children: ["$", r.budget.toLocaleString()],
                                }),
                              ],
                            }),
                            i.jsxs("div", {
                              className: "flex items-center gap-2 text-sm",
                              children: [
                                i.jsx(QS, {
                                  className: "h-4 w-4 text-muted-foreground",
                                }),
                                i.jsx("span", {
                                  children: new Date(
                                    r.createdAt,
                                  ).toLocaleDateString(),
                                }),
                              ],
                            }),
                            i.jsx("div", {
                              className: "flex items-center gap-2 text-sm",
                              children: i.jsx(wn, {
                                variant: "outline",
                                children: r.category,
                              }),
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                  i.jsxs(Y, {
                    className: "shadow-xl",
                    children: [
                      i.jsxs(ie, {
                        children: [
                          i.jsxs(ae, {
                            children: ["Propuestas Recibidas (", o.length, ")"],
                          }),
                          i.jsx(ge, {
                            children:
                              o.length === 0
                                ? "Aún no hay propuestas para esta solicitud"
                                : "Seleccioná la mejor propuesta para tu trabajo",
                          }),
                        ],
                      }),
                      i.jsx(ue, {
                        children:
                          o.length === 0
                            ? i.jsx("p", {
                                className:
                                  "text-center text-muted-foreground py-8",
                                children:
                                  "Las propuestas aparecerán aquí cuando los trabajadores se postulen",
                              })
                            : i.jsx("div", {
                                className: "space-y-4",
                                children: o.map((u) => {
                                  const d = K.getUser(u.workerId);
                                  return d
                                    ? i.jsx(
                                        Y,
                                        {
                                          className:
                                            u.status === "aceptada"
                                              ? "border-success border-2"
                                              : "",
                                          children: i.jsxs(ue, {
                                            className: "pt-6",
                                            children: [
                                              i.jsxs("div", {
                                                className:
                                                  "flex items-start justify-between gap-4 mb-4",
                                                children: [
                                                  i.jsxs("div", {
                                                    className:
                                                      "flex items-center gap-3",
                                                    children: [
                                                      i.jsx(vr, {
                                                        children: i.jsx(yr, {
                                                          children: d.name[0],
                                                        }),
                                                      }),
                                                      i.jsxs("div", {
                                                        children: [
                                                          i.jsx("p", {
                                                            className:
                                                              "font-semibold",
                                                            children: d.name,
                                                          }),
                                                          i.jsx("p", {
                                                            className:
                                                              "text-sm text-muted-foreground",
                                                            children: d.trade,
                                                          }),
                                                          d.rating &&
                                                            i.jsxs("p", {
                                                              className:
                                                                "text-sm",
                                                              children: [
                                                                "⭐ ",
                                                                d.rating.toFixed(
                                                                  1,
                                                                ),
                                                              ],
                                                            }),
                                                        ],
                                                      }),
                                                    ],
                                                  }),
                                                  i.jsxs("div", {
                                                    className: "text-right",
                                                    children: [
                                                      i.jsxs("p", {
                                                        className:
                                                          "text-2xl font-bold text-primary",
                                                        children: [
                                                          "$",
                                                          u.price.toLocaleString(),
                                                        ],
                                                      }),
                                                      u.status === "aceptada" &&
                                                        i.jsxs(wn, {
                                                          className:
                                                            "mt-1 bg-success text-success-foreground",
                                                          children: [
                                                            i.jsx(Op, {
                                                              className:
                                                                "h-3 w-3 mr-1",
                                                            }),
                                                            "Aceptada",
                                                          ],
                                                        }),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                              i.jsx("p", {
                                                className: "text-sm mb-4",
                                                children: u.message,
                                              }),
                                              i.jsxs("div", {
                                                className: "flex gap-2",
                                                children: [
                                                  u.status === "enviada" &&
                                                    r.status === "abierta" &&
                                                    i.jsxs(re, {
                                                      onClick: () => a(u.id),
                                                      className: "gap-2",
                                                      children: [
                                                        i.jsx(Op, {
                                                          className: "h-4 w-4",
                                                        }),
                                                        "Aceptar Propuesta",
                                                      ],
                                                    }),
                                                  i.jsxs(re, {
                                                    variant: "outline",
                                                    className: "gap-2",
                                                    onClick: () => {
                                                      const p = K.createChat(
                                                        n.id,
                                                        d.id,
                                                      );
                                                      t(`/u/chat/${p.id}`);
                                                    },
                                                    children: [
                                                      i.jsx(Oa, {
                                                        className: "h-4 w-4",
                                                      }),
                                                      "Chatear",
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        },
                                        u.id,
                                      )
                                    : null;
                                }),
                              }),
                      }),
                    ],
                  }),
                ],
              }),
              i.jsx("div", {
                children: i.jsxs(Y, {
                  className: "shadow-xl",
                  children: [
                    i.jsx(ie, {
                      children: i.jsx(ae, { children: "Acciones Rápidas" }),
                    }),
                    i.jsx(ue, {
                      className: "space-y-2",
                      children: i.jsxs(re, {
                        variant: "outline",
                        className: "w-full justify-start gap-2",
                        children: [
                          i.jsx(Oa, { className: "h-4 w-4" }),
                          "Ver Mensajes",
                        ],
                      }),
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      }),
    });
  },
  yk = () => {
    ze();
    const { user: e, updateUser: t } = Re(),
      [n, r] = f.useState(!1),
      [o, s] = f.useState({
        name: (e == null ? void 0 : e.name) || "",
        phone: (e == null ? void 0 : e.phone) || "",
      }),
      a = async (l) => {
        (l.preventDefault(), r(!0));
        try {
          (await t(o), be.success("Perfil actualizado exitosamente"));
        } catch (c) {
          be.error(c.message || "Error al actualizar perfil");
        } finally {
          r(!1);
        }
      };
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-primary-light via-background to-accent-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
          i.jsxs(Y, {
            className: "max-w-2xl mx-auto shadow-xl",
            children: [
              i.jsxs(ie, {
                className: "text-center",
                children: [
                  i.jsx("div", {
                    className: "flex justify-center mb-4",
                    children: i.jsx(vr, {
                      className: "h-24 w-24",
                      children: i.jsx(yr, {
                        className:
                          "text-2xl bg-primary text-primary-foreground",
                        children: e == null ? void 0 : e.name[0],
                      }),
                    }),
                  }),
                  i.jsx(ae, { className: "text-2xl", children: "Mi Perfil" }),
                  i.jsx(ge, { children: "Administrá tu información personal" }),
                ],
              }),
              i.jsx(ue, {
                children: i.jsxs("form", {
                  onSubmit: a,
                  className: "space-y-6",
                  children: [
                    i.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        i.jsx(fe, {
                          htmlFor: "name",
                          children: "Nombre completo",
                        }),
                        i.jsx(ye, {
                          id: "name",
                          type: "text",
                          value: o.name,
                          onChange: (l) => s({ ...o, name: l.target.value }),
                          required: !0,
                        }),
                      ],
                    }),
                    i.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        i.jsx(fe, { htmlFor: "email", children: "Email" }),
                        i.jsx(ye, {
                          id: "email",
                          type: "email",
                          value: e == null ? void 0 : e.email,
                          disabled: !0,
                        }),
                        i.jsx("p", {
                          className: "text-sm text-muted-foreground",
                          children: "El email no se puede modificar",
                        }),
                      ],
                    }),
                    i.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        i.jsx(fe, { htmlFor: "phone", children: "Teléfono" }),
                        i.jsx(ye, {
                          id: "phone",
                          type: "tel",
                          placeholder: "+54 11 1234-5678",
                          value: o.phone,
                          onChange: (l) => s({ ...o, phone: l.target.value }),
                        }),
                      ],
                    }),
                    i.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        i.jsx(fe, { children: "Rol" }),
                        i.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            i.jsx(ul, { className: "h-4 w-4 text-primary" }),
                            i.jsx("span", {
                              className: "font-medium",
                              children: "Usuario",
                            }),
                          ],
                        }),
                      ],
                    }),
                    i.jsx(re, {
                      type: "submit",
                      className: "w-full",
                      disabled: n,
                      children: n
                        ? i.jsxs(i.Fragment, {
                            children: [
                              i.jsx(es, {
                                className: "mr-2 h-4 w-4 animate-spin",
                              }),
                              "Guardando...",
                            ],
                          })
                        : "Guardar Cambios",
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      }),
    });
  },
  xk = () => {
    const e = ze(),
      { user: t } = Re(),
      n = K.getChats((t == null ? void 0 : t.id) || "");
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-primary-light via-background to-accent-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
          i.jsxs(Y, {
            className: "max-w-3xl mx-auto shadow-xl",
            children: [
              i.jsx(ie, {
                children: i.jsx(ae, {
                  className: "text-2xl",
                  children: "Mensajes",
                }),
              }),
              i.jsx(ue, {
                children:
                  n.length === 0
                    ? i.jsx("div", {
                        className: "text-center py-12",
                        children: i.jsx("p", {
                          className: "text-muted-foreground",
                          children: "No tenés conversaciones activas",
                        }),
                      })
                    : i.jsx("div", {
                        className: "space-y-2",
                        children: n.map((r) => {
                          const o = r.participantIds.find(
                              (a) => a !== (t == null ? void 0 : t.id),
                            ),
                            s = K.getUser(o || "");
                          return s
                            ? i.jsxs(
                                "div",
                                {
                                  className:
                                    "flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                                  onClick: () => e(`/u/chat/${r.id}`),
                                  children: [
                                    i.jsx(vr, {
                                      children: i.jsx(yr, {
                                        children: s.name[0],
                                      }),
                                    }),
                                    i.jsxs("div", {
                                      className: "flex-1 min-w-0",
                                      children: [
                                        i.jsx("p", {
                                          className: "font-semibold",
                                          children: s.name,
                                        }),
                                        s.trade &&
                                          i.jsx("p", {
                                            className:
                                              "text-sm text-muted-foreground",
                                            children: s.trade,
                                          }),
                                        r.lastMessage &&
                                          i.jsx("p", {
                                            className:
                                              "text-sm text-muted-foreground truncate",
                                            children: r.lastMessage,
                                          }),
                                      ],
                                    }),
                                    i.jsx("div", {
                                      className:
                                        "text-xs text-muted-foreground",
                                      children: new Date(
                                        r.lastMessageAt,
                                      ).toLocaleDateString(),
                                    }),
                                  ],
                                },
                                r.id,
                              )
                            : null;
                        }),
                      }),
              }),
            ],
          }),
        ],
      }),
    });
  },
  wk = () => {
    const { id: e } = Yd(),
      { user: t } = Re(),
      [n, r] = f.useState(""),
      [o, s] = f.useState(K.getMessages(e || "")),
      a = f.useRef(null),
      l = K.getChats((t == null ? void 0 : t.id) || "").find((m) => m.id === e),
      c =
        l == null
          ? void 0
          : l.participantIds.find((m) => m !== (t == null ? void 0 : t.id)),
      u = K.getUser(c || "");
    (f.useEffect(() => {
      var m;
      (m = a.current) == null || m.scrollIntoView({ behavior: "smooth" });
    }, [o]),
      f.useEffect(() => {
        const m = setInterval(() => {
          const g = K.getMessages(e || "");
          g.length !== o.length && s(g);
        }, 1e3);
        return () => clearInterval(m);
      }, [e, o.length]));
    const d = () => {
        if (n.trim())
          try {
            const m = K.createMessage(e || "", n);
            (s([...o, m]), r(""));
          } catch (m) {
            be.error(m.message);
          }
      },
      p = (m) => {
        m.key === "Enter" && !m.shiftKey && (m.preventDefault(), d());
      };
    return !l || !u
      ? i.jsx("div", {
          className: "min-h-screen flex items-center justify-center",
          children: i.jsx("p", { children: "Chat no encontrado" }),
        })
      : i.jsx("div", {
          className:
            "min-h-screen bg-gradient-to-br from-primary-light via-background to-accent-light",
          children: i.jsxs("div", {
            className: "container mx-auto px-4 py-8",
            children: [
              i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
              i.jsxs(Y, {
                className: "max-w-3xl mx-auto shadow-xl",
                children: [
                  i.jsx(ie, {
                    className: "border-b",
                    children: i.jsxs("div", {
                      className: "flex items-center gap-3",
                      children: [
                        i.jsx(vr, {
                          children: i.jsx(yr, { children: u.name[0] }),
                        }),
                        i.jsxs("div", {
                          children: [
                            i.jsx(ae, { children: u.name }),
                            u.trade &&
                              i.jsx("p", {
                                className: "text-sm text-muted-foreground",
                                children: u.trade,
                              }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  i.jsxs(ue, {
                    className: "p-0",
                    children: [
                      i.jsxs("div", {
                        className: "h-[500px] overflow-y-auto p-4 space-y-4",
                        children: [
                          o.map((m) => {
                            const g =
                              m.authorId === (t == null ? void 0 : t.id);
                            return i.jsx(
                              "div",
                              {
                                className: `flex ${g ? "justify-end" : "justify-start"}`,
                                children: i.jsxs("div", {
                                  className: `max-w-[70%] rounded-lg px-4 py-2 ${g ? "bg-primary text-primary-foreground" : "bg-muted"}`,
                                  children: [
                                    i.jsx("p", {
                                      className: "text-sm",
                                      children: m.text,
                                    }),
                                    i.jsx("p", {
                                      className: "text-xs opacity-70 mt-1",
                                      children: new Date(
                                        m.ts,
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }),
                                    }),
                                  ],
                                }),
                              },
                              m.id,
                            );
                          }),
                          i.jsx("div", { ref: a }),
                        ],
                      }),
                      i.jsx("div", {
                        className: "border-t p-4",
                        children: i.jsxs("div", {
                          className: "flex gap-2",
                          children: [
                            i.jsx(ye, {
                              placeholder: "Escribí tu mensaje...",
                              value: n,
                              onChange: (m) => r(m.target.value),
                              onKeyPress: p,
                            }),
                            i.jsxs(re, {
                              onClick: d,
                              className: "gap-2",
                              children: [
                                i.jsx(Id, { className: "h-4 w-4" }),
                                "Enviar",
                              ],
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        });
  },
  Sk = () => {
    const e = ze(),
      { user: t, logout: n } = Re(),
      r = K.getServices({ workerId: t == null ? void 0 : t.id }),
      o = K.getProposals({ workerId: t == null ? void 0 : t.id });
    K.getChats((t == null ? void 0 : t.id) || "");
    const a = K.getPayouts((t == null ? void 0 : t.id) || "").filter(
        (c) => c.status === "pendiente",
      ),
      l = () => {
        (n(), e("/"));
      };
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-accent-light via-background to-primary-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsxs("div", {
            className: "flex justify-between items-center mb-8",
            children: [
              i.jsxs("div", {
                children: [
                  i.jsxs("h1", {
                    className: "text-3xl font-bold",
                    children: ["Bienvenido, ", t == null ? void 0 : t.name],
                  }),
                  i.jsx("p", {
                    className: "text-muted-foreground",
                    children: "¿Qué trabajo vas a hacer hoy?",
                  }),
                ],
              }),
              i.jsxs(re, {
                variant: "ghost",
                onClick: l,
                className: "gap-2",
                children: [i.jsx(Cv, { className: "h-4 w-4" }), "Salir"],
              }),
            ],
          }),
          i.jsxs("div", {
            className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12",
            children: [
              i.jsx(Y, {
                className:
                  "hover:shadow-lg transition-shadow cursor-pointer bg-accent/5",
                onClick: () => e("/w/jobs"),
                children: i.jsxs(ie, {
                  children: [
                    i.jsx("div", {
                      className:
                        "w-12 h-12 rounded-full bg-accent-light flex items-center justify-center mb-2",
                      children: i.jsx(Ma, { className: "h-6 w-6 text-accent" }),
                    }),
                    i.jsx(ae, { children: "Buscar Trabajos" }),
                    i.jsx(ge, { children: "Encontrá nuevos clientes" }),
                  ],
                }),
              }),
              i.jsx(Y, {
                className: "hover:shadow-lg transition-shadow cursor-pointer",
                onClick: () => e("/w/services"),
                children: i.jsxs(ie, {
                  children: [
                    i.jsx("div", {
                      className:
                        "w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-2",
                      children: i.jsx(Nv, {
                        className: "h-6 w-6 text-primary",
                      }),
                    }),
                    i.jsx(ae, { children: "Mis Servicios" }),
                    i.jsxs(ge, { children: [r.length, " publicados"] }),
                  ],
                }),
              }),
              i.jsx(Y, {
                className: "hover:shadow-lg transition-shadow cursor-pointer",
                onClick: () => e("/w/proposals"),
                children: i.jsxs(ie, {
                  children: [
                    i.jsx("div", {
                      className:
                        "w-12 h-12 rounded-full bg-success-light flex items-center justify-center mb-2",
                      children: i.jsx(Oa, {
                        className: "h-6 w-6 text-success",
                      }),
                    }),
                    i.jsx(ae, { children: "Propuestas" }),
                    i.jsxs(ge, { children: [o.length, " enviadas"] }),
                  ],
                }),
              }),
              i.jsx(Y, {
                className: "hover:shadow-lg transition-shadow cursor-pointer",
                onClick: () => e("/w/cobros"),
                children: i.jsxs(ie, {
                  children: [
                    i.jsx("div", {
                      className:
                        "w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-2",
                      children: i.jsx(Ad, {
                        className: "h-6 w-6 text-primary",
                      }),
                    }),
                    i.jsx(ae, { children: "Cobros" }),
                    i.jsxs(ge, { children: [a.length, " pendientes"] }),
                  ],
                }),
              }),
            ],
          }),
          i.jsxs("div", {
            className: "grid md:grid-cols-2 gap-6",
            children: [
              i.jsxs("div", {
                children: [
                  i.jsx("h2", {
                    className: "text-2xl font-bold mb-4",
                    children: "Trabajos Disponibles",
                  }),
                  i.jsx(Y, {
                    children: i.jsxs(ue, {
                      className: "py-8 text-center",
                      children: [
                        i.jsx("p", {
                          className: "text-muted-foreground mb-4",
                          children: "Explorá trabajos cerca tuyo",
                        }),
                        i.jsxs(re, {
                          onClick: () => e("/w/jobs"),
                          className: "gap-2",
                          children: [
                            i.jsx(Ma, { className: "h-4 w-4" }),
                            "Buscar Trabajos",
                          ],
                        }),
                      ],
                    }),
                  }),
                ],
              }),
              i.jsxs("div", {
                children: [
                  i.jsxs("div", {
                    className: "flex justify-between items-center mb-4",
                    children: [
                      i.jsx("h2", {
                        className: "text-2xl font-bold",
                        children: "Mis Servicios",
                      }),
                      i.jsx(re, {
                        variant: "outline",
                        size: "sm",
                        onClick: () => e("/w/services/new"),
                        children: "Nuevo",
                      }),
                    ],
                  }),
                  r.length === 0
                    ? i.jsx(Y, {
                        children: i.jsxs(ue, {
                          className: "py-8 text-center",
                          children: [
                            i.jsx("p", {
                              className: "text-muted-foreground mb-4",
                              children: "Publicá tus servicios profesionales",
                            }),
                            i.jsx(re, {
                              onClick: () => e("/w/services/new"),
                              children: "Crear Servicio",
                            }),
                          ],
                        }),
                      })
                    : i.jsx("div", {
                        className: "space-y-4",
                        children: r
                          .slice(0, 3)
                          .map((c) =>
                            i.jsxs(
                              Y,
                              {
                                className: "hover:shadow-lg transition-shadow",
                                children: [
                                  i.jsxs(ie, {
                                    children: [
                                      i.jsx(ae, {
                                        className: "text-lg",
                                        children: c.title,
                                      }),
                                      i.jsx(ge, {
                                        className: "line-clamp-2",
                                        children: c.description,
                                      }),
                                    ],
                                  }),
                                  i.jsx(ue, {
                                    children: i.jsxs("div", {
                                      className:
                                        "flex justify-between items-center",
                                      children: [
                                        i.jsx("span", {
                                          className:
                                            "text-muted-foreground text-sm",
                                          children: c.category,
                                        }),
                                        i.jsxs("span", {
                                          className:
                                            "font-semibold text-primary",
                                          children: [
                                            "$",
                                            c.price.toLocaleString(),
                                          ],
                                        }),
                                      ],
                                    }),
                                  }),
                                ],
                              },
                              c.id,
                            ),
                          ),
                      }),
                ],
              }),
            ],
          }),
        ],
      }),
    });
  };
var Cl = "Dialog",
  [Lx, nP] = Gr(Cl),
  [jk, Jt] = Lx(Cl),
  Fx = (e) => {
    const {
        __scopeDialog: t,
        children: n,
        open: r,
        defaultOpen: o,
        onOpenChange: s,
        modal: a = !0,
      } = e,
      l = f.useRef(null),
      c = f.useRef(null),
      [u, d] = Ia({ prop: r, defaultProp: o ?? !1, onChange: s, caller: Cl });
    return i.jsx(jk, {
      scope: t,
      triggerRef: l,
      contentRef: c,
      contentId: Co(),
      titleId: Co(),
      descriptionId: Co(),
      open: u,
      onOpenChange: d,
      onOpenToggle: f.useCallback(() => d((p) => !p), [d]),
      modal: a,
      children: n,
    });
  };
Fx.displayName = Cl;
var zx = "DialogTrigger",
  $x = f.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = Jt(zx, n),
      s = Ne(t, o.triggerRef);
    return i.jsx(ne.button, {
      type: "button",
      "aria-haspopup": "dialog",
      "aria-expanded": o.open,
      "aria-controls": o.contentId,
      "data-state": of(o.open),
      ...r,
      ref: s,
      onClick: ee(e.onClick, o.onOpenToggle),
    });
  });
$x.displayName = zx;
var nf = "DialogPortal",
  [bk, Ux] = Lx(nf, { forceMount: void 0 }),
  Bx = (e) => {
    const { __scopeDialog: t, forceMount: n, children: r, container: o } = e,
      s = Jt(nf, t);
    return i.jsx(bk, {
      scope: t,
      forceMount: n,
      children: f.Children.map(r, (a) =>
        i.jsx(Zo, {
          present: n || s.open,
          children: i.jsx(il, { asChild: !0, container: o, children: a }),
        }),
      ),
    });
  };
Bx.displayName = nf;
var Va = "DialogOverlay",
  Vx = f.forwardRef((e, t) => {
    const n = Ux(Va, e.__scopeDialog),
      { forceMount: r = n.forceMount, ...o } = e,
      s = Jt(Va, e.__scopeDialog);
    return s.modal
      ? i.jsx(Zo, {
          present: r || s.open,
          children: i.jsx(Ck, { ...o, ref: t }),
        })
      : null;
  });
Vx.displayName = Va;
var Nk = Vo("DialogOverlay.RemoveScroll"),
  Ck = f.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = Jt(Va, n);
    return i.jsx(Zd, {
      as: Nk,
      allowPinchZoom: !0,
      shards: [o.contentRef],
      children: i.jsx(ne.div, {
        "data-state": of(o.open),
        ...r,
        ref: t,
        style: { pointerEvents: "auto", ...r.style },
      }),
    });
  }),
  Hr = "DialogContent",
  Wx = f.forwardRef((e, t) => {
    const n = Ux(Hr, e.__scopeDialog),
      { forceMount: r = n.forceMount, ...o } = e,
      s = Jt(Hr, e.__scopeDialog);
    return i.jsx(Zo, {
      present: r || s.open,
      children: s.modal
        ? i.jsx(Ek, { ...o, ref: t })
        : i.jsx(kk, { ...o, ref: t }),
    });
  });
Wx.displayName = Hr;
var Ek = f.forwardRef((e, t) => {
    const n = Jt(Hr, e.__scopeDialog),
      r = f.useRef(null),
      o = Ne(t, n.contentRef, r);
    return (
      f.useEffect(() => {
        const s = r.current;
        if (s) return _y(s);
      }, []),
      i.jsx(Hx, {
        ...e,
        ref: o,
        trapFocus: n.open,
        disableOutsidePointerEvents: !0,
        onCloseAutoFocus: ee(e.onCloseAutoFocus, (s) => {
          var a;
          (s.preventDefault(), (a = n.triggerRef.current) == null || a.focus());
        }),
        onPointerDownOutside: ee(e.onPointerDownOutside, (s) => {
          const a = s.detail.originalEvent,
            l = a.button === 0 && a.ctrlKey === !0;
          (a.button === 2 || l) && s.preventDefault();
        }),
        onFocusOutside: ee(e.onFocusOutside, (s) => s.preventDefault()),
      })
    );
  }),
  kk = f.forwardRef((e, t) => {
    const n = Jt(Hr, e.__scopeDialog),
      r = f.useRef(!1),
      o = f.useRef(!1);
    return i.jsx(Hx, {
      ...e,
      ref: t,
      trapFocus: !1,
      disableOutsidePointerEvents: !1,
      onCloseAutoFocus: (s) => {
        var a, l;
        ((a = e.onCloseAutoFocus) == null || a.call(e, s),
          s.defaultPrevented ||
            (r.current || (l = n.triggerRef.current) == null || l.focus(),
            s.preventDefault()),
          (r.current = !1),
          (o.current = !1));
      },
      onInteractOutside: (s) => {
        var c, u;
        ((c = e.onInteractOutside) == null || c.call(e, s),
          s.defaultPrevented ||
            ((r.current = !0),
            s.detail.originalEvent.type === "pointerdown" && (o.current = !0)));
        const a = s.target;
        (((u = n.triggerRef.current) == null ? void 0 : u.contains(a)) &&
          s.preventDefault(),
          s.detail.originalEvent.type === "focusin" &&
            o.current &&
            s.preventDefault());
      },
    });
  }),
  Hx = f.forwardRef((e, t) => {
    const {
        __scopeDialog: n,
        trapFocus: r,
        onOpenAutoFocus: o,
        onCloseAutoFocus: s,
        ...a
      } = e,
      l = Jt(Hr, n),
      c = f.useRef(null),
      u = Ne(t, c);
    return (
      Iy(),
      i.jsxs(i.Fragment, {
        children: [
          i.jsx(Jd, {
            asChild: !0,
            loop: !0,
            trapped: r,
            onMountAutoFocus: o,
            onUnmountAutoFocus: s,
            children: i.jsx(hi, {
              role: "dialog",
              id: l.contentId,
              "aria-describedby": l.descriptionId,
              "aria-labelledby": l.titleId,
              "data-state": of(l.open),
              ...a,
              ref: u,
              onDismiss: () => l.onOpenChange(!1),
            }),
          }),
          i.jsxs(i.Fragment, {
            children: [
              i.jsx(Pk, { titleId: l.titleId }),
              i.jsx(Rk, { contentRef: c, descriptionId: l.descriptionId }),
            ],
          }),
        ],
      })
    );
  }),
  rf = "DialogTitle",
  Kx = f.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = Jt(rf, n);
    return i.jsx(ne.h2, { id: o.titleId, ...r, ref: t });
  });
Kx.displayName = rf;
var Qx = "DialogDescription",
  qx = f.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = Jt(Qx, n);
    return i.jsx(ne.p, { id: o.descriptionId, ...r, ref: t });
  });
qx.displayName = Qx;
var Gx = "DialogClose",
  Yx = f.forwardRef((e, t) => {
    const { __scopeDialog: n, ...r } = e,
      o = Jt(Gx, n);
    return i.jsx(ne.button, {
      type: "button",
      ...r,
      ref: t,
      onClick: ee(e.onClick, () => o.onOpenChange(!1)),
    });
  });
Yx.displayName = Gx;
function of(e) {
  return e ? "open" : "closed";
}
var Xx = "DialogTitleWarning",
  [rP, Jx] = J1(Xx, { contentName: Hr, titleName: rf, docsSlug: "dialog" }),
  Pk = ({ titleId: e }) => {
    const t = Jx(Xx),
      n = `\`${t.contentName}\` requires a \`${t.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${t.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${t.docsSlug}`;
    return (
      f.useEffect(() => {
        e && (document.getElementById(e) || console.error(n));
      }, [n, e]),
      null
    );
  },
  Tk = "DialogDescriptionWarning",
  Rk = ({ contentRef: e, descriptionId: t }) => {
    const r = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${Jx(Tk).contentName}}.`;
    return (
      f.useEffect(() => {
        var s;
        const o =
          (s = e.current) == null ? void 0 : s.getAttribute("aria-describedby");
        t && o && (document.getElementById(t) || console.warn(r));
      }, [r, e, t]),
      null
    );
  },
  Ak = Fx,
  Ik = $x,
  Ok = Bx,
  Zx = Vx,
  e0 = Wx,
  t0 = Kx,
  n0 = qx,
  Mk = Yx;
const r0 = Ak,
  o0 = Ik,
  _k = Ok,
  s0 = f.forwardRef(({ className: e, ...t }, n) =>
    i.jsx(Zx, {
      ref: n,
      className: X(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        e,
      ),
      ...t,
    }),
  );
s0.displayName = Zx.displayName;
const sf = f.forwardRef(({ className: e, children: t, ...n }, r) =>
  i.jsxs(_k, {
    children: [
      i.jsx(s0, {}),
      i.jsxs(e0, {
        ref: r,
        className: X(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          e,
        ),
        ...n,
        children: [
          t,
          i.jsxs(Mk, {
            className:
              "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
            children: [
              i.jsx(kv, { className: "h-4 w-4" }),
              i.jsx("span", { className: "sr-only", children: "Close" }),
            ],
          }),
        ],
      }),
    ],
  }),
);
sf.displayName = e0.displayName;
const af = ({ className: e, ...t }) =>
  i.jsx("div", {
    className: X("flex flex-col space-y-1.5 text-center sm:text-left", e),
    ...t,
  });
af.displayName = "DialogHeader";
const lf = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx(t0, {
    ref: n,
    className: X("text-lg font-semibold leading-none tracking-tight", e),
    ...t,
  }),
);
lf.displayName = t0.displayName;
const cf = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx(n0, { ref: n, className: X("text-sm text-muted-foreground", e), ...t }),
);
cf.displayName = n0.displayName;
const Dk = () => {
    ze();
    const { user: e } = Re(),
      [t, n] = f.useState(""),
      [r, o] = f.useState("all"),
      [s, a] = f.useState(null),
      [l, c] = f.useState(""),
      [u, d] = f.useState(""),
      p = K.getOffers({ status: "abierta" }),
      m = p.filter((h) => {
        const w =
            h.title.toLowerCase().includes(t.toLowerCase()) ||
            h.description.toLowerCase().includes(t.toLowerCase()),
          y = r === "all" || h.category === r;
        return w && y;
      }),
      g = Array.from(new Set(p.map((h) => h.category))),
      S = () => {
        if (!s || !l || !u) {
          be.error("Por favor completá todos los campos");
          return;
        }
        const h = parseFloat(u);
        if (isNaN(h) || h <= 0) {
          be.error("El precio debe ser mayor a 0");
          return;
        }
        try {
          (K.createProposal({
            offerId: s,
            workerId: e.id,
            message: l,
            price: h,
            status: "enviada",
          }),
            be.success("¡Propuesta enviada exitosamente!"),
            a(null),
            c(""),
            d(""));
        } catch (w) {
          be.error(w.message);
        }
      };
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-accent-light via-background to-primary-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
          i.jsxs("div", {
            className: "mb-6",
            children: [
              i.jsx("h1", {
                className: "text-3xl font-bold mb-2",
                children: "Buscar Trabajos",
              }),
              i.jsxs("p", {
                className: "text-muted-foreground",
                children: [m.length, " trabajos disponibles"],
              }),
            ],
          }),
          i.jsxs("div", {
            className: "grid md:grid-cols-2 gap-4 mb-6",
            children: [
              i.jsxs("div", {
                className: "relative",
                children: [
                  i.jsx(Ma, {
                    className:
                      "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
                  }),
                  i.jsx(ye, {
                    placeholder: "Buscar trabajos...",
                    value: t,
                    onChange: (h) => n(h.target.value),
                    className: "pl-10",
                  }),
                ],
              }),
              i.jsxs(si, {
                value: r,
                onValueChange: o,
                children: [
                  i.jsx(Qo, {
                    children: i.jsx(ii, {
                      placeholder: "Todas las categorías",
                    }),
                  }),
                  i.jsxs(qo, {
                    children: [
                      i.jsx(Kt, {
                        value: "all",
                        children: "Todas las categorías",
                      }),
                      g.map((h) => i.jsx(Kt, { value: h, children: h }, h)),
                    ],
                  }),
                ],
              }),
            ],
          }),
          m.length === 0
            ? i.jsx(Y, {
                children: i.jsx(ue, {
                  className: "py-12 text-center",
                  children: i.jsx("p", {
                    className: "text-muted-foreground",
                    children: "No se encontraron trabajos",
                  }),
                }),
              })
            : i.jsx("div", {
                className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: m.map((h) => {
                  const y =
                    K.getProposals({
                      offerId: h.id,
                      workerId: e == null ? void 0 : e.id,
                    }).length > 0;
                  return i.jsxs(
                    Y,
                    {
                      className: "hover:shadow-lg transition-shadow",
                      children: [
                        i.jsxs(ie, {
                          children: [
                            i.jsxs("div", {
                              className:
                                "flex justify-between items-start gap-2 mb-2",
                              children: [
                                i.jsx(Xd, { urgency: h.urgency }),
                                i.jsx("span", {
                                  className: "text-xs text-muted-foreground",
                                  children: new Date(
                                    h.createdAt,
                                  ).toLocaleDateString(),
                                }),
                              ],
                            }),
                            i.jsx(ae, { children: h.title }),
                            i.jsx(ge, {
                              className: "line-clamp-3",
                              children: h.description,
                            }),
                          ],
                        }),
                        i.jsxs(ue, {
                          className: "space-y-4",
                          children: [
                            i.jsxs("div", {
                              className: "space-y-2 text-sm",
                              children: [
                                i.jsxs("div", {
                                  className:
                                    "flex items-center justify-between",
                                  children: [
                                    i.jsx("span", {
                                      className: "text-muted-foreground",
                                      children: "Categoría:",
                                    }),
                                    i.jsx("span", {
                                      className: "font-medium",
                                      children: h.category,
                                    }),
                                  ],
                                }),
                                i.jsxs("div", {
                                  className:
                                    "flex items-center justify-between",
                                  children: [
                                    i.jsx("span", {
                                      className: "text-muted-foreground",
                                      children: "Presupuesto:",
                                    }),
                                    i.jsxs("span", {
                                      className: "font-semibold text-primary",
                                      children: [
                                        "$",
                                        h.budget.toLocaleString(),
                                      ],
                                    }),
                                  ],
                                }),
                                i.jsxs("div", {
                                  className:
                                    "flex items-center gap-2 text-muted-foreground",
                                  children: [
                                    i.jsx(Ev, { className: "h-3 w-3" }),
                                    i.jsx("span", {
                                      className: "text-xs",
                                      children: h.location,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            y
                              ? i.jsx(re, {
                                  variant: "outline",
                                  className: "w-full",
                                  disabled: !0,
                                  children: "Ya enviaste propuesta",
                                })
                              : i.jsxs(r0, {
                                  open: s === h.id,
                                  onOpenChange: (v) => !v && a(null),
                                  children: [
                                    i.jsx(o0, {
                                      asChild: !0,
                                      children: i.jsxs(re, {
                                        className: "w-full gap-2",
                                        onClick: () => a(h.id),
                                        children: [
                                          i.jsx(Id, { className: "h-4 w-4" }),
                                          "Enviar Propuesta",
                                        ],
                                      }),
                                    }),
                                    i.jsxs(sf, {
                                      children: [
                                        i.jsxs(af, {
                                          children: [
                                            i.jsx(lf, {
                                              children: "Enviar Propuesta",
                                            }),
                                            i.jsx(cf, { children: h.title }),
                                          ],
                                        }),
                                        i.jsxs("div", {
                                          className: "space-y-4",
                                          children: [
                                            i.jsxs("div", {
                                              className: "space-y-2",
                                              children: [
                                                i.jsx(fe, {
                                                  htmlFor: "message",
                                                  children: "Tu mensaje",
                                                }),
                                                i.jsx(wl, {
                                                  id: "message",
                                                  placeholder:
                                                    "Describí tu experiencia y por qué sos el indicado para este trabajo...",
                                                  rows: 4,
                                                  value: l,
                                                  onChange: (v) =>
                                                    c(v.target.value),
                                                }),
                                              ],
                                            }),
                                            i.jsxs("div", {
                                              className: "space-y-2",
                                              children: [
                                                i.jsx(fe, {
                                                  htmlFor: "price",
                                                  children: "Tu precio (ARS)",
                                                }),
                                                i.jsx(ye, {
                                                  id: "price",
                                                  type: "number",
                                                  placeholder: "5000",
                                                  value: u,
                                                  onChange: (v) =>
                                                    d(v.target.value),
                                                  min: "1",
                                                }),
                                              ],
                                            }),
                                            i.jsx(re, {
                                              onClick: S,
                                              className: "w-full",
                                              children: "Enviar Propuesta",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                          ],
                        }),
                      ],
                    },
                    h.id,
                  );
                }),
              }),
        ],
      }),
    });
  },
  Lk = () => {
    const e = ze(),
      { user: t } = Re(),
      n = K.getServices({ workerId: t == null ? void 0 : t.id });
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-accent-light via-background to-primary-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
          i.jsxs("div", {
            className: "flex justify-between items-center mb-6",
            children: [
              i.jsxs("div", {
                children: [
                  i.jsx("h1", {
                    className: "text-3xl font-bold",
                    children: "Mis Servicios",
                  }),
                  i.jsxs("p", {
                    className: "text-muted-foreground",
                    children: [n.length, " servicios publicados"],
                  }),
                ],
              }),
              i.jsxs(re, {
                onClick: () => e("/w/services/new"),
                className: "gap-2",
                children: [
                  i.jsx(Wo, { className: "h-4 w-4" }),
                  "Nuevo Servicio",
                ],
              }),
            ],
          }),
          n.length === 0
            ? i.jsx(Y, {
                children: i.jsxs(ue, {
                  className: "py-12 text-center",
                  children: [
                    i.jsx("p", {
                      className: "text-muted-foreground mb-4",
                      children: "Aún no tenés servicios publicados",
                    }),
                    i.jsxs(re, {
                      onClick: () => e("/w/services/new"),
                      children: [
                        i.jsx(Wo, { className: "mr-2 h-4 w-4" }),
                        "Crear Primer Servicio",
                      ],
                    }),
                  ],
                }),
              })
            : i.jsx("div", {
                className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: n.map((r) =>
                  i.jsxs(
                    Y,
                    {
                      className: "hover:shadow-lg transition-shadow",
                      children: [
                        i.jsxs(ie, {
                          children: [
                            i.jsxs("div", {
                              className:
                                "flex justify-between items-start gap-2 mb-2",
                              children: [
                                i.jsx(wn, {
                                  className: r.active
                                    ? "bg-success text-success-foreground"
                                    : "bg-muted text-muted-foreground",
                                  children: r.active ? "Activo" : "Inactivo",
                                }),
                                i.jsxs("div", {
                                  className:
                                    "flex items-center gap-1 text-xs text-muted-foreground",
                                  children: [
                                    i.jsx(YS, { className: "h-3 w-3" }),
                                    i.jsx("span", { children: r.views }),
                                  ],
                                }),
                              ],
                            }),
                            i.jsx(ae, { children: r.title }),
                            i.jsx(ge, {
                              className: "line-clamp-3",
                              children: r.description,
                            }),
                          ],
                        }),
                        i.jsxs(ue, {
                          className: "space-y-2",
                          children: [
                            i.jsxs("div", {
                              className: "flex justify-between text-sm",
                              children: [
                                i.jsx("span", {
                                  className: "text-muted-foreground",
                                  children: "Categoría:",
                                }),
                                i.jsx("span", {
                                  className: "font-medium",
                                  children: r.category,
                                }),
                              ],
                            }),
                            i.jsxs("div", {
                              className: "flex justify-between text-sm",
                              children: [
                                i.jsx("span", {
                                  className: "text-muted-foreground",
                                  children: "Precio:",
                                }),
                                i.jsxs("span", {
                                  className: "font-semibold text-primary",
                                  children: ["$", r.price.toLocaleString()],
                                }),
                              ],
                            }),
                            r.duration &&
                              i.jsxs("div", {
                                className: "flex justify-between text-sm",
                                children: [
                                  i.jsx("span", {
                                    className: "text-muted-foreground",
                                    children: "Duración:",
                                  }),
                                  i.jsx("span", {
                                    className: "font-medium",
                                    children: r.duration,
                                  }),
                                ],
                              }),
                          ],
                        }),
                      ],
                    },
                    r.id,
                  ),
                ),
              }),
        ],
      }),
    });
  },
  Fk = [
    "Plomería",
    "Electricidad",
    "Pintura",
    "Carpintería",
    "Refrigeración",
    "Limpieza",
    "Mudanzas",
    "Jardinería",
    "Otros",
  ],
  zk = () => {
    const e = ze(),
      { user: t } = Re(),
      [n, r] = f.useState(!1),
      [o, s] = f.useState({
        title: "",
        description: "",
        category: "",
        price: "",
        duration: "",
      }),
      a = async (l) => {
        (l.preventDefault(), r(!0));
        try {
          if (!o.title || !o.description || !o.category || !o.price)
            throw new Error("Por favor completá todos los campos obligatorios");
          const c = parseFloat(o.price);
          if (isNaN(c) || c <= 0)
            throw new Error("El precio debe ser un número mayor a 0");
          (K.createService({
            workerId: t.id,
            title: o.title,
            description: o.description,
            category: o.category,
            price: c,
            duration: o.duration || void 0,
            active: !0,
          }),
            be.success("¡Servicio creado exitosamente!"),
            e("/w/services"));
        } catch (c) {
          be.error(c.message || "Error al crear el servicio");
        } finally {
          r(!1);
        }
      };
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-accent-light via-background to-primary-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
          i.jsxs(Y, {
            className: "max-w-2xl mx-auto shadow-xl",
            children: [
              i.jsxs(ie, {
                children: [
                  i.jsx(ae, {
                    className: "text-2xl",
                    children: "Nuevo Servicio",
                  }),
                  i.jsx(ge, {
                    children:
                      "Publicá un servicio profesional para que te encuentren clientes",
                  }),
                ],
              }),
              i.jsx(ue, {
                children: i.jsxs("form", {
                  onSubmit: a,
                  className: "space-y-6",
                  children: [
                    i.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        i.jsx(fe, {
                          htmlFor: "title",
                          children: "Título del servicio *",
                        }),
                        i.jsx(ye, {
                          id: "title",
                          placeholder: "Ej: Reparación de cañerías",
                          value: o.title,
                          onChange: (l) => s({ ...o, title: l.target.value }),
                          required: !0,
                        }),
                      ],
                    }),
                    i.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        i.jsx(fe, {
                          htmlFor: "description",
                          children: "Descripción *",
                        }),
                        i.jsx(wl, {
                          id: "description",
                          placeholder: "Describí tu servicio en detalle...",
                          rows: 5,
                          value: o.description,
                          onChange: (l) =>
                            s({ ...o, description: l.target.value }),
                          required: !0,
                        }),
                      ],
                    }),
                    i.jsxs("div", {
                      className: "grid md:grid-cols-2 gap-4",
                      children: [
                        i.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            i.jsx(fe, {
                              htmlFor: "category",
                              children: "Categoría *",
                            }),
                            i.jsxs(si, {
                              value: o.category,
                              onValueChange: (l) => s({ ...o, category: l }),
                              children: [
                                i.jsx(Qo, {
                                  id: "category",
                                  children: i.jsx(ii, {
                                    placeholder: "Seleccionar categoría",
                                  }),
                                }),
                                i.jsx(qo, {
                                  children: Fk.map((l) =>
                                    i.jsx(Kt, { value: l, children: l }, l),
                                  ),
                                }),
                              ],
                            }),
                          ],
                        }),
                        i.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            i.jsx(fe, {
                              htmlFor: "duration",
                              children: "Duración estimada",
                            }),
                            i.jsx(ye, {
                              id: "duration",
                              placeholder: "Ej: 2-3 horas",
                              value: o.duration,
                              onChange: (l) =>
                                s({ ...o, duration: l.target.value }),
                            }),
                          ],
                        }),
                      ],
                    }),
                    i.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        i.jsx(fe, {
                          htmlFor: "price",
                          children: "Precio (ARS) *",
                        }),
                        i.jsx(ye, {
                          id: "price",
                          type: "number",
                          placeholder: "5000",
                          value: o.price,
                          onChange: (l) => s({ ...o, price: l.target.value }),
                          required: !0,
                          min: "1",
                        }),
                      ],
                    }),
                    i.jsxs("div", {
                      className: "flex gap-4",
                      children: [
                        i.jsx(re, {
                          type: "button",
                          variant: "outline",
                          onClick: () => e("/w/services"),
                          className: "flex-1",
                          children: "Cancelar",
                        }),
                        i.jsx(re, {
                          type: "submit",
                          disabled: n,
                          className: "flex-1",
                          children: n
                            ? i.jsxs(i.Fragment, {
                                children: [
                                  i.jsx(es, {
                                    className: "mr-2 h-4 w-4 animate-spin",
                                  }),
                                  "Creando...",
                                ],
                              })
                            : "Publicar Servicio",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      }),
    });
  },
  $k = () => {
    ze();
    const { user: e } = Re(),
      t = K.getProposals({ workerId: e == null ? void 0 : e.id }),
      n = (r) => {
        const o = {
          enviada: {
            label: "Enviada",
            className: "bg-primary text-primary-foreground",
          },
          aceptada: {
            label: "Aceptada",
            className: "bg-success text-success-foreground",
          },
          rechazada: {
            label: "Rechazada",
            className: "bg-destructive text-destructive-foreground",
          },
        };
        return o[r] || o.enviada;
      };
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-accent-light via-background to-primary-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
          i.jsxs("div", {
            className: "mb-6",
            children: [
              i.jsx("h1", {
                className: "text-3xl font-bold",
                children: "Mis Propuestas",
              }),
              i.jsxs("p", {
                className: "text-muted-foreground",
                children: [t.length, " propuestas enviadas"],
              }),
            ],
          }),
          t.length === 0
            ? i.jsx(Y, {
                children: i.jsx(ue, {
                  className: "py-12 text-center",
                  children: i.jsx("p", {
                    className: "text-muted-foreground mb-4",
                    children: "Aún no enviaste propuestas",
                  }),
                }),
              })
            : i.jsx("div", {
                className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6",
                children: t.map((r) => {
                  const o = K.getOffer(r.offerId);
                  if (!o) return null;
                  const s = n(r.status);
                  return i.jsxs(
                    Y,
                    {
                      className: "hover:shadow-lg transition-shadow",
                      children: [
                        i.jsxs(ie, {
                          children: [
                            i.jsxs("div", {
                              className:
                                "flex justify-between items-start gap-2 mb-2",
                              children: [
                                i.jsx(wn, {
                                  className: s.className,
                                  children: s.label,
                                }),
                                i.jsx("span", {
                                  className: "text-xs text-muted-foreground",
                                  children: new Date(
                                    r.createdAt,
                                  ).toLocaleDateString(),
                                }),
                              ],
                            }),
                            i.jsx(ae, { children: o.title }),
                            i.jsx(ge, {
                              className: "line-clamp-2",
                              children: o.description,
                            }),
                          ],
                        }),
                        i.jsxs(ue, {
                          className: "space-y-4",
                          children: [
                            i.jsxs("div", {
                              className: "space-y-2 text-sm",
                              children: [
                                i.jsxs("div", {
                                  className: "flex justify-between",
                                  children: [
                                    i.jsx("span", {
                                      className: "text-muted-foreground",
                                      children: "Tu precio:",
                                    }),
                                    i.jsxs("span", {
                                      className: "font-semibold text-primary",
                                      children: ["$", r.price.toLocaleString()],
                                    }),
                                  ],
                                }),
                                i.jsxs("div", {
                                  className: "flex justify-between",
                                  children: [
                                    i.jsx("span", {
                                      className: "text-muted-foreground",
                                      children: "Presupuesto cliente:",
                                    }),
                                    i.jsxs("span", {
                                      className: "font-medium",
                                      children: [
                                        "$",
                                        o.budget.toLocaleString(),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            i.jsxs("div", {
                              className: "pt-4 border-t",
                              children: [
                                i.jsx("p", {
                                  className:
                                    "text-sm text-muted-foreground mb-1",
                                  children: "Tu mensaje:",
                                }),
                                i.jsx("p", {
                                  className: "text-sm line-clamp-3",
                                  children: r.message,
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    },
                    r.id,
                  );
                }),
              }),
        ],
      }),
    });
  },
  i0 = f.forwardRef(({ className: e, ...t }, n) =>
    i.jsx("div", {
      className: "relative w-full overflow-auto",
      children: i.jsx("table", {
        ref: n,
        className: X("w-full caption-bottom text-sm", e),
        ...t,
      }),
    }),
  );
i0.displayName = "Table";
const a0 = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx("thead", { ref: n, className: X("[&_tr]:border-b", e), ...t }),
);
a0.displayName = "TableHeader";
const l0 = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx("tbody", {
    ref: n,
    className: X("[&_tr:last-child]:border-0", e),
    ...t,
  }),
);
l0.displayName = "TableBody";
const Uk = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx("tfoot", {
    ref: n,
    className: X("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", e),
    ...t,
  }),
);
Uk.displayName = "TableFooter";
const Iu = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx("tr", {
    ref: n,
    className: X(
      "border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50",
      e,
    ),
    ...t,
  }),
);
Iu.displayName = "TableRow";
const Ns = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx("th", {
    ref: n,
    className: X(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      e,
    ),
    ...t,
  }),
);
Ns.displayName = "TableHead";
const Cs = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx("td", {
    ref: n,
    className: X("p-4 align-middle [&:has([role=checkbox])]:pr-0", e),
    ...t,
  }),
);
Cs.displayName = "TableCell";
const Bk = f.forwardRef(({ className: e, ...t }, n) =>
  i.jsx("caption", {
    ref: n,
    className: X("mt-4 text-sm text-muted-foreground", e),
    ...t,
  }),
);
Bk.displayName = "TableCaption";
const Vk = () => {
    const { user: e } = Re(),
      [t, n] = f.useState(""),
      [r, o] = f.useState(!1),
      s = K.getPayouts((e == null ? void 0 : e.id) || ""),
      a = s
        .filter((d) => d.status === "pendiente")
        .reduce((d, p) => d + p.amount, 0),
      l = s
        .filter((d) => d.status === "liquidado")
        .reduce((d, p) => d + p.amount, 0),
      c = () => {
        const d = parseFloat(t);
        if (isNaN(d) || d <= 0) {
          be.error("El monto debe ser mayor a 0");
          return;
        }
        try {
          (K.createPayout(d),
            be.success("Solicitud de cobro creada exitosamente"),
            n(""),
            o(!1),
            window.location.reload());
        } catch (p) {
          be.error(p.message);
        }
      },
      u = (d) => {
        const p = {
          pendiente: {
            label: "Pendiente",
            className: "bg-primary text-primary-foreground",
          },
          liquidado: {
            label: "Liquidado",
            className: "bg-success text-success-foreground",
          },
        };
        return p[d] || p.pendiente;
      };
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-accent-light via-background to-primary-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
          i.jsxs("div", {
            className: "mb-6",
            children: [
              i.jsx("h1", {
                className: "text-3xl font-bold",
                children: "Mis Cobros",
              }),
              i.jsx("p", {
                className: "text-muted-foreground",
                children: "Gestioná tus pagos y solicitudes de cobro",
              }),
            ],
          }),
          i.jsxs("div", {
            className: "grid md:grid-cols-3 gap-6 mb-8",
            children: [
              i.jsx(Y, {
                children: i.jsxs(ie, {
                  children: [
                    i.jsx(ge, { children: "Total Pendiente" }),
                    i.jsxs(ae, {
                      className: "text-3xl text-primary",
                      children: ["$", a.toLocaleString()],
                    }),
                  ],
                }),
              }),
              i.jsx(Y, {
                children: i.jsxs(ie, {
                  children: [
                    i.jsx(ge, { children: "Total Liquidado" }),
                    i.jsxs(ae, {
                      className: "text-3xl text-success",
                      children: ["$", l.toLocaleString()],
                    }),
                  ],
                }),
              }),
              i.jsx(Y, {
                className: "flex items-center justify-center",
                children: i.jsx(ue, {
                  className: "pt-6",
                  children: i.jsxs(r0, {
                    open: r,
                    onOpenChange: o,
                    children: [
                      i.jsx(o0, {
                        asChild: !0,
                        children: i.jsxs(re, {
                          className: "gap-2",
                          size: "lg",
                          children: [
                            i.jsx(Ad, { className: "h-5 w-5" }),
                            "Solicitar Cobro",
                          ],
                        }),
                      }),
                      i.jsxs(sf, {
                        children: [
                          i.jsxs(af, {
                            children: [
                              i.jsx(lf, { children: "Solicitar Cobro" }),
                              i.jsx(cf, {
                                children: "Ingresá el monto que querés cobrar",
                              }),
                            ],
                          }),
                          i.jsxs("div", {
                            className: "space-y-4",
                            children: [
                              i.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  i.jsx(fe, {
                                    htmlFor: "amount",
                                    children: "Monto (ARS)",
                                  }),
                                  i.jsx(ye, {
                                    id: "amount",
                                    type: "number",
                                    placeholder: "5000",
                                    value: t,
                                    onChange: (d) => n(d.target.value),
                                    min: "1",
                                  }),
                                ],
                              }),
                              i.jsx(re, {
                                onClick: c,
                                className: "w-full",
                                children: "Solicitar",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              }),
            ],
          }),
          i.jsxs(Y, {
            className: "shadow-xl",
            children: [
              i.jsxs(ie, {
                children: [
                  i.jsx(ae, { children: "Historial de Cobros" }),
                  i.jsxs(ge, { children: [s.length, " solicitudes totales"] }),
                ],
              }),
              i.jsx(ue, {
                children:
                  s.length === 0
                    ? i.jsx("div", {
                        className: "text-center py-8",
                        children: i.jsx("p", {
                          className: "text-muted-foreground",
                          children: "No tenés solicitudes de cobro",
                        }),
                      })
                    : i.jsxs(i0, {
                        children: [
                          i.jsx(a0, {
                            children: i.jsxs(Iu, {
                              children: [
                                i.jsx(Ns, { children: "Fecha" }),
                                i.jsx(Ns, { children: "Monto" }),
                                i.jsx(Ns, { children: "Estado" }),
                                i.jsx(Ns, { children: "Liquidado" }),
                              ],
                            }),
                          }),
                          i.jsx(l0, {
                            children: s.map((d) => {
                              const p = u(d.status);
                              return i.jsxs(
                                Iu,
                                {
                                  children: [
                                    i.jsx(Cs, {
                                      children: new Date(
                                        d.createdAt,
                                      ).toLocaleDateString(),
                                    }),
                                    i.jsxs(Cs, {
                                      className: "font-semibold",
                                      children: [
                                        "$",
                                        d.amount.toLocaleString(),
                                      ],
                                    }),
                                    i.jsx(Cs, {
                                      children: i.jsx(wn, {
                                        className: p.className,
                                        children: p.label,
                                      }),
                                    }),
                                    i.jsx(Cs, {
                                      children: d.paidAt
                                        ? new Date(
                                            d.paidAt,
                                          ).toLocaleDateString()
                                        : "-",
                                    }),
                                  ],
                                },
                                d.id,
                              );
                            }),
                          }),
                        ],
                      }),
              }),
            ],
          }),
        ],
      }),
    });
  },
  Wk = () => {
    ze();
    const { user: e, updateUser: t } = Re(),
      [n, r] = f.useState(!1),
      [o, s] = f.useState({
        name: (e == null ? void 0 : e.name) || "",
        phone: (e == null ? void 0 : e.phone) || "",
        trade: (e == null ? void 0 : e.trade) || "",
      }),
      a = async (l) => {
        (l.preventDefault(), r(!0));
        try {
          (await t(o), be.success("Perfil actualizado exitosamente"));
        } catch (c) {
          be.error(c.message || "Error al actualizar perfil");
        } finally {
          r(!1);
        }
      };
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-accent-light via-background to-primary-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
          i.jsxs(Y, {
            className: "max-w-2xl mx-auto shadow-xl",
            children: [
              i.jsxs(ie, {
                className: "text-center",
                children: [
                  i.jsx("div", {
                    className: "flex justify-center mb-4",
                    children: i.jsx(vr, {
                      className: "h-24 w-24",
                      children: i.jsx(yr, {
                        className: "text-2xl bg-accent text-accent-foreground",
                        children: e == null ? void 0 : e.name[0],
                      }),
                    }),
                  }),
                  i.jsx(ae, { className: "text-2xl", children: "Mi Perfil" }),
                  i.jsx(ge, {
                    children: "Administrá tu información profesional",
                  }),
                  (e == null ? void 0 : e.verified) &&
                    i.jsx(wn, {
                      className:
                        "mt-2 bg-success text-success-foreground w-fit mx-auto",
                      children: "Verificado",
                    }),
                ],
              }),
              i.jsxs(ue, {
                children: [
                  i.jsxs("form", {
                    onSubmit: a,
                    className: "space-y-6",
                    children: [
                      i.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          i.jsx(fe, {
                            htmlFor: "name",
                            children: "Nombre completo",
                          }),
                          i.jsx(ye, {
                            id: "name",
                            type: "text",
                            value: o.name,
                            onChange: (l) => s({ ...o, name: l.target.value }),
                            required: !0,
                          }),
                        ],
                      }),
                      i.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          i.jsx(fe, { htmlFor: "email", children: "Email" }),
                          i.jsx(ye, {
                            id: "email",
                            type: "email",
                            value: e == null ? void 0 : e.email,
                            disabled: !0,
                          }),
                          i.jsx("p", {
                            className: "text-sm text-muted-foreground",
                            children: "El email no se puede modificar",
                          }),
                        ],
                      }),
                      i.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          i.jsx(fe, { htmlFor: "phone", children: "Teléfono" }),
                          i.jsx(ye, {
                            id: "phone",
                            type: "tel",
                            placeholder: "+54 11 1234-5678",
                            value: o.phone,
                            onChange: (l) => s({ ...o, phone: l.target.value }),
                          }),
                        ],
                      }),
                      i.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          i.jsx(fe, { htmlFor: "trade", children: "Oficio" }),
                          i.jsx(ye, {
                            id: "trade",
                            type: "text",
                            placeholder: "Ej: Plomería, Electricidad",
                            value: o.trade,
                            onChange: (l) => s({ ...o, trade: l.target.value }),
                          }),
                        ],
                      }),
                      i.jsxs("div", {
                        className: "space-y-2",
                        children: [
                          i.jsx(fe, { children: "Rol" }),
                          i.jsxs("div", {
                            className: "flex items-center gap-2",
                            children: [
                              i.jsx(Od, { className: "h-4 w-4 text-accent" }),
                              i.jsx("span", {
                                className: "font-medium",
                                children: "Trabajador",
                              }),
                            ],
                          }),
                        ],
                      }),
                      (e == null ? void 0 : e.rating) &&
                        e.rating > 0 &&
                        i.jsxs("div", {
                          className: "space-y-2",
                          children: [
                            i.jsx(fe, { children: "Calificación" }),
                            i.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                i.jsx(XS, {
                                  className:
                                    "h-5 w-5 text-yellow-500 fill-yellow-500",
                                }),
                                i.jsx("span", {
                                  className: "text-2xl font-bold",
                                  children: e.rating.toFixed(1),
                                }),
                                i.jsx("span", {
                                  className: "text-muted-foreground",
                                  children: "/ 5.0",
                                }),
                              ],
                            }),
                          ],
                        }),
                      i.jsx(re, {
                        type: "submit",
                        className: "w-full",
                        disabled: n,
                        children: n
                          ? i.jsxs(i.Fragment, {
                              children: [
                                i.jsx(es, {
                                  className: "mr-2 h-4 w-4 animate-spin",
                                }),
                                "Guardando...",
                              ],
                            })
                          : "Guardar Cambios",
                      }),
                    ],
                  }),
                  i.jsxs("div", {
                    className: "mt-6 p-4 bg-muted rounded-lg",
                    children: [
                      i.jsx("p", {
                        className: "text-sm font-semibold mb-2",
                        children: "Documentación (próximamente)",
                      }),
                      i.jsx("p", {
                        className: "text-sm text-muted-foreground",
                        children:
                          "Podrás subir tu matrícula profesional y documento de identidad para verificar tu cuenta.",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    });
  },
  Hk = () => {
    const e = ze(),
      { user: t } = Re(),
      n = K.getChats((t == null ? void 0 : t.id) || "");
    return i.jsx("div", {
      className:
        "min-h-screen bg-gradient-to-br from-accent-light via-background to-primary-light",
      children: i.jsxs("div", {
        className: "container mx-auto px-4 py-8",
        children: [
          i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
          i.jsxs(Y, {
            className: "max-w-3xl mx-auto shadow-xl",
            children: [
              i.jsx(ie, {
                children: i.jsx(ae, {
                  className: "text-2xl",
                  children: "Mensajes",
                }),
              }),
              i.jsx(ue, {
                children:
                  n.length === 0
                    ? i.jsx("div", {
                        className: "text-center py-12",
                        children: i.jsx("p", {
                          className: "text-muted-foreground",
                          children: "No tenés conversaciones activas",
                        }),
                      })
                    : i.jsx("div", {
                        className: "space-y-2",
                        children: n.map((r) => {
                          const o = r.participantIds.find(
                              (a) => a !== (t == null ? void 0 : t.id),
                            ),
                            s = K.getUser(o || "");
                          return s
                            ? i.jsxs(
                                "div",
                                {
                                  className:
                                    "flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors",
                                  onClick: () => e(`/w/chat/${r.id}`),
                                  children: [
                                    i.jsx(vr, {
                                      children: i.jsx(yr, {
                                        children: s.name[0],
                                      }),
                                    }),
                                    i.jsxs("div", {
                                      className: "flex-1 min-w-0",
                                      children: [
                                        i.jsx("p", {
                                          className: "font-semibold",
                                          children: s.name,
                                        }),
                                        r.lastMessage &&
                                          i.jsx("p", {
                                            className:
                                              "text-sm text-muted-foreground truncate",
                                            children: r.lastMessage,
                                          }),
                                      ],
                                    }),
                                    i.jsx("div", {
                                      className:
                                        "text-xs text-muted-foreground",
                                      children: new Date(
                                        r.lastMessageAt,
                                      ).toLocaleDateString(),
                                    }),
                                  ],
                                },
                                r.id,
                              )
                            : null;
                        }),
                      }),
              }),
            ],
          }),
        ],
      }),
    });
  },
  Kk = () => {
    const { id: e } = Yd(),
      { user: t } = Re(),
      [n, r] = f.useState(""),
      [o, s] = f.useState(K.getMessages(e || "")),
      a = f.useRef(null),
      l = K.getChats((t == null ? void 0 : t.id) || "").find((m) => m.id === e),
      c =
        l == null
          ? void 0
          : l.participantIds.find((m) => m !== (t == null ? void 0 : t.id)),
      u = K.getUser(c || "");
    (f.useEffect(() => {
      var m;
      (m = a.current) == null || m.scrollIntoView({ behavior: "smooth" });
    }, [o]),
      f.useEffect(() => {
        const m = setInterval(() => {
          const g = K.getMessages(e || "");
          g.length !== o.length && s(g);
        }, 1e3);
        return () => clearInterval(m);
      }, [e, o.length]));
    const d = () => {
        if (n.trim())
          try {
            const m = K.createMessage(e || "", n);
            (s([...o, m]), r(""));
          } catch (m) {
            be.error(m.message);
          }
      },
      p = (m) => {
        m.key === "Enter" && !m.shiftKey && (m.preventDefault(), d());
      };
    return !l || !u
      ? i.jsx("div", {
          className: "min-h-screen flex items-center justify-center",
          children: i.jsx("p", { children: "Chat no encontrado" }),
        })
      : i.jsx("div", {
          className:
            "min-h-screen bg-gradient-to-br from-accent-light via-background to-primary-light",
          children: i.jsxs("div", {
            className: "container mx-auto px-4 py-8",
            children: [
              i.jsx("div", { className: "mb-6", children: i.jsx(mt, {}) }),
              i.jsxs(Y, {
                className: "max-w-3xl mx-auto shadow-xl",
                children: [
                  i.jsx(ie, {
                    className: "border-b",
                    children: i.jsxs("div", {
                      className: "flex items-center gap-3",
                      children: [
                        i.jsx(vr, {
                          children: i.jsx(yr, { children: u.name[0] }),
                        }),
                        i.jsx("div", {
                          children: i.jsx(ae, { children: u.name }),
                        }),
                      ],
                    }),
                  }),
                  i.jsxs(ue, {
                    className: "p-0",
                    children: [
                      i.jsxs("div", {
                        className: "h-[500px] overflow-y-auto p-4 space-y-4",
                        children: [
                          o.map((m) => {
                            const g =
                              m.authorId === (t == null ? void 0 : t.id);
                            return i.jsx(
                              "div",
                              {
                                className: `flex ${g ? "justify-end" : "justify-start"}`,
                                children: i.jsxs("div", {
                                  className: `max-w-[70%] rounded-lg px-4 py-2 ${g ? "bg-accent text-accent-foreground" : "bg-muted"}`,
                                  children: [
                                    i.jsx("p", {
                                      className: "text-sm",
                                      children: m.text,
                                    }),
                                    i.jsx("p", {
                                      className: "text-xs opacity-70 mt-1",
                                      children: new Date(
                                        m.ts,
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }),
                                    }),
                                  ],
                                }),
                              },
                              m.id,
                            );
                          }),
                          i.jsx("div", { ref: a }),
                        ],
                      }),
                      i.jsx("div", {
                        className: "border-t p-4",
                        children: i.jsxs("div", {
                          className: "flex gap-2",
                          children: [
                            i.jsx(ye, {
                              placeholder: "Escribí tu mensaje...",
                              value: n,
                              onChange: (m) => r(m.target.value),
                              onKeyPress: p,
                            }),
                            i.jsxs(re, {
                              onClick: d,
                              className: "gap-2",
                              children: [
                                i.jsx(Id, { className: "h-4 w-4" }),
                                "Enviar",
                              ],
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        });
  },
  Qk = new lC(),
  qk = () => {
    const e = Re((t) => t.initialize);
    return (
      f.useEffect(() => {
        e();
      }, [e]),
      i.jsx(uC, {
        client: Qk,
        children: i.jsxs(FN, {
          children: [
            i.jsx(Oj, {}),
            i.jsx(db, {}),
            i.jsx(aE, {
              children: i.jsxs(ZC, {
                children: [
                  i.jsx(De, { path: "/", element: i.jsx(xE, {}) }),
                  i.jsx(De, { path: "/auth/login", element: i.jsx(bE, {}) }),
                  i.jsx(De, { path: "/auth/register", element: i.jsx(NE, {}) }),
                  i.jsx(De, {
                    path: "/u/home",
                    element: i.jsx(Ze, {
                      requiredRole: "user",
                      children: i.jsx(CE, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/u/requests",
                    element: i.jsx(Ze, {
                      requiredRole: "user",
                      children: i.jsx(kE, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/u/requests/new",
                    element: i.jsx(Ze, {
                      requiredRole: "user",
                      children: i.jsx(ek, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/u/requests/:id",
                    element: i.jsx(Ze, {
                      requiredRole: "user",
                      children: i.jsx(vk, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/u/chat",
                    element: i.jsx(Ze, {
                      requiredRole: "user",
                      children: i.jsx(xk, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/u/chat/:id",
                    element: i.jsx(Ze, {
                      requiredRole: "user",
                      children: i.jsx(wk, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/u/profile",
                    element: i.jsx(Ze, {
                      requiredRole: "user",
                      children: i.jsx(yk, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/w/home",
                    element: i.jsx(Ze, {
                      requiredRole: "worker",
                      children: i.jsx(Sk, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/w/jobs",
                    element: i.jsx(Ze, {
                      requiredRole: "worker",
                      children: i.jsx(Dk, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/w/services",
                    element: i.jsx(Ze, {
                      requiredRole: "worker",
                      children: i.jsx(Lk, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/w/services/new",
                    element: i.jsx(Ze, {
                      requiredRole: "worker",
                      children: i.jsx(zk, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/w/proposals",
                    element: i.jsx(Ze, {
                      requiredRole: "worker",
                      children: i.jsx($k, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/w/cobros",
                    element: i.jsx(Ze, {
                      requiredRole: "worker",
                      children: i.jsx(Vk, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/w/chat",
                    element: i.jsx(Ze, {
                      requiredRole: "worker",
                      children: i.jsx(Hk, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/w/chat/:id",
                    element: i.jsx(Ze, {
                      requiredRole: "worker",
                      children: i.jsx(Kk, {}),
                    }),
                  }),
                  i.jsx(De, {
                    path: "/w/profile",
                    element: i.jsx(Ze, {
                      requiredRole: "worker",
                      children: i.jsx(Wk, {}),
                    }),
                  }),
                  i.jsx(De, { path: "*", element: i.jsx(wE, {}) }),
                ],
              }),
            }),
          ],
        }),
      })
    );
  };
Kg(document.getElementById("root")).render(i.jsx(qk, {}));
