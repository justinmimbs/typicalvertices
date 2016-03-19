// (Number, Number, Number) -> Iterator
function rangeIterator(start, end, step = 1) {
  let n = start;
  return {
    next() {
      if (n < end) {
        const value = n;
        n += step;
        return { done: false, value };
      }

      return { done: true };
    },
  };
}

// (Number, Number, Number) -> Iterable
export default function range(start, end, step) {
  return {
    [Symbol.iterator]: rangeIterator.bind(null, start, end, step),
  };
}
