import memoize from './memoize';
import range from './range';
import { internalAngle } from './polygonData';

// array utilities

// (Array, Array) -> Boolean
function equalArrays(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}

// (Function, Array) -> Array
function sortedUniqueWith(eq, array) {
  return array.reduce((result, x) => {
    const last = result[result.length - 1];

    if (last === undefined || !eq(x, last)) {
      result.push(x);
    }

    return result;
  }, []);
}

// (Array, Array) -> Number
function arrayComparator(a, b) {
  const length = Math.max(a.length, b.length);

  for (let i = 0; i < length; i += 1) {
    const x = a[i] !== undefined ? a[i] : -Infinity;
    const y = b[i] !== undefined ? b[i] : -Infinity;

    if (x < y) {
      return -1;
    } else if (y < x) {
      return 1;
    }
  }

  return 0;
}

// (Array, Array) -> Array
function zip(a, b) {
  return a.map((x, i) => [x, b[i]]);
}

// Array -> Array
function reverse(array) {
  return array.slice().reverse();
}

/*-----------------------------------------------------------------------------------------------*/

// find all compositions of a number with a restricted set of summands

// ([Number], Number) -> [[Number]]
const compositions = memoize((summands, n) => {
  const maxDifference = n - Math.min(...summands);
  const comps = summands
    .filter(s => s <= maxDifference)
    .map(s => compositions(summands, n - s).map(c => [s, ...c]))
    .reduce((r, x) => r.concat(x), []); // flatten
  return summands.includes(n)
    ? comps.concat([[n]])
    : comps;
});

// return a consistent ordering for any permutation of a cycle

// [a] -> [a]
function canonicalPermutation(cycle) {
  // include all rotations
  const rotations = [...range(0, cycle.length)]
    .map(i => [...cycle.slice(i), ...cycle.slice(0, i)]);

  // include the mirror of each rotation
  const permutations = [...rotations, ...rotations.map(reverse)];

  // take the last permutation of the sorted order as the canonical representation
  return permutations.sort(arrayComparator)[permutations.length - 1];
}

// compute typical vertices

const sides = [...range(3, 43)];
const angles = sides.map(internalAngle);
const sidesFromAngle = new Map(zip(angles, sides));

const typicalVertices = sortedUniqueWith(equalArrays,
    compositions(angles, 360)
      .map(canonicalPermutation)
      .sort(arrayComparator)
  )
  .map(path => path.map(angle => sidesFromAngle.get(angle)));

export default typicalVertices;
