import memoize from './memoize';

// [Number] -> [Number]
function cartesianFromPolar([r, theta]) {
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

// Number -> Number
function radians(degrees) {
  return degrees * Math.PI / 180;
}

// Number -> Number
function internalAngle(n) {
  return ((n - 2) * 180) / n;
}

// Number -> [[Number]]
function _vertexCoordinates(n) {
  const vertices = [[0, 0], [1, 0]];
  const a = radians(internalAngle(n) / 2);
  const r = 0.5 / Math.cos(a);
  const u = 0.5;
  const v = 0.5 * Math.tan(a);
  const c = radians(360 / n);

  for (let i = 3; i <= n; i += 1) {
    const theta = ((i - 2) * c) - a;
    const [x, y] = cartesianFromPolar([r, theta]);
    vertices.push([x + u, y + v]);
  }

  return vertices;
}

const vertexCoordinates = memoize(_vertexCoordinates);

export {
  internalAngle,
  vertexCoordinates,
};
