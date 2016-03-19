import memoize from './memoize';
import range from './range';
import { internalAngle } from './polygonData';

// ------------------------------------------------------------------------------------------------
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

// ------------------------------------------------------------------------------------------------
// compositions of a number with a restricted set of summands

// ([Number], Number) -> [[Number]]
const compositions = memoize((summands, n) => {
  const min = Math.min(...summands);
  const comps = summands
    .filter(s => s <= (n - min))
    .map(s => compositions(summands, n - s).map(c => [s, ...c]))
    .reduce((r, x) => r.concat(x), []); // flatten
  return summands.includes(n)
    ? comps.concat([[n]])
    : comps;
});

// ------------------------------------------------------------------------------------------------
// canonical permutation of a cycle

// [a] -> [a]
function canonicalPermutation(cycle) {
  // include all rotations
  let permutations = [...range(0, cycle.length)]
    .map(i => [...cycle.slice(i), ...cycle.slice(0, i)]);

  // include the mirror of each rotation
  permutations = [...permutations, ...permutations.map(reverse)];

  // take the last permutation of the sorted order as the canonical representation
  return permutations.sort(arrayComparator)[permutations.length - 1];
}

// ------------------------------------------------------------------------------------------------
// compute typical vertices

const faces = [...range(3, 43)];
const angles = faces.map(internalAngle);
const circle = 360;

const angleToFaces = new Map(zip(angles, faces));

const sorted = compositions(angles, circle)
    .map(canonicalPermutation)
    .sort(arrayComparator);

const typicalVertices = sortedUniqueWith(equalArrays, sorted)
    .map(path => path.map(angle => angleToFaces.get(angle)));

export default typicalVertices;
