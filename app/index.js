import typicalVertices from './typicalVertices';
import { internalAngle, vertexCoordinates } from './polygonData';
import dom from './dom';

// [[Number, Number]] -> String
function pathDataFromCoordinates(coordinates) {
  return `M${coordinates
    .map(c => c.map(n => n.toFixed(20).replace(/\.?0+$/, '')).join(','))
    .join('L')}`;
}

// Object -> Element
function domVertexConfiguration({ transform, config }) {
  return dom.g({ transform },
    dom.text({ transform: 'translate(1.4, -1.4)' }, config.slice().reverse().join(',')),
    dom.circle({ r: 0.5 }),
    config.reduce((result, n) => {
      const d = pathDataFromCoordinates(vertexCoordinates(n));
      result.paths.push(dom.path({ d, transform: `rotate(${result.angle})` }));
      result.angle += internalAngle(n);
      return result;
    }, { paths: [], angle: 0 }).paths
  );
}

// create display

const div = dom.div(null,
  typicalVertices.map(config =>
    dom.div({ className: 'cell' },
      dom.svg(null,
        domVertexConfiguration({ transform: 'translate(100.5, 110.5) scale(30, 30)', config }))
    )
  )
);

document.querySelector('#output').appendChild(div);
