// * -> Boolean
function isPrimitive(v) {
  return v === null || typeof v !== 'object' && typeof v !== 'function';
}

// Function -> Function
function memoize1(f) {
  const m = new Map();
  const wm = new WeakMap();

  return function memoized(a) {
    const _m = isPrimitive(a) ? m : wm;

    if (!_m.has(a)) {
      _m.set(a, f(a));
    }

    return _m.get(a);
  };
}

// Function -> Function
function memoize2(f2) {
  const curried2 = memoize1(a => memoize1(b => f2(a, b)));
  return (a, b) => curried2(a)(b);
}

// Function -> Function
function memoize3(f3) {
  const curried3 = memoize1(a => memoize1(b => memoize1(c => f3(a, b, c))));
  return (a, b, c) => curried3(a)(b)(c);
}

// Function -> Function
export default function memoize(f) {
  if (typeof f !== 'function') {
    throw new TypeError('`memoize` expects a function');
  }

  switch (f.length) {
    case 1: return memoize1(f);
    case 2: return memoize2(f);
    case 3: return memoize3(f);
    default: throw new Error('`memoize` expects a function of arity between 1 and 3');
  }
}
