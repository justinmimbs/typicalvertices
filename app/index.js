import typicalVertices from './typicalVertices';
import { internalAngle, vertexCoordinates } from './polygonData';
import dom from './dom';

// [[Number, Number]] -> String
function pathDataFromCoordinates(coordinates) {
  return `M${coordinates
    .map(c => c.map(n => n.toFixed(20).replace(/\.?0+$/, '')).join(','))
    .join('L')}`;
}

// [Number] -> Element
function domFromVertexConfiguration(ns) {
  return dom.g(null,
    dom.text({ transform: 'translate(1.4, -1.4)' }, ns.slice().reverse().join(',')),
    dom.circle({ r: 0.5 }),
    ns.reduce((result, n) => {
      const d = pathDataFromCoordinates(vertexCoordinates(n));
      result.paths.push(dom.path({ d, transform: `rotate(${result.angle})` }));
      result.angle += internalAngle(n);
      return result;
    }, { paths: [], angle: 0 }).paths
  );
}

// (Object, [Node]) -> Element
function domGrid({ transform, rows, cellWidth, cellHeight }, children) {
  return dom.g({ transform: transform || '' }, children.map((node, i) => {
    const c = i % rows;
    const r = Math.floor(i / rows);
    return dom.g({ transform: `translate(${c * cellWidth}, ${r * cellHeight})` }, node);
  }));
}

// create display

const svg = dom.svg({ width: 1650, height: 1050 },
  domGrid(
    {
      transform: 'translate(120.5, 120.5) scale(30, 30)',
      rows: 7,
      cellWidth: 7,
      cellHeight: 8,
    },
    typicalVertices.map(domFromVertexConfiguration)
  )
);

document.querySelector('body').insertBefore(svg, document.querySelector('body').firstChild);
