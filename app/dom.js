// data Children = [Node|String|Children]
// Children -> [Node]
function flattenChildren(children) {
  return children.reduce((result, item) => {
    if (item instanceof Node) {
      result.push(item);
      return result;
    }

    if (typeof item === 'string') {
      result.push(document.createTextNode(item));
      return result;
    }

    if (Array.isArray(item)) {
      return result.concat(flattenChildren(item));
    }

    throw new TypeError(`unexpected child: ${item}`);
  }, []);
}

const svgTagNames = [
  'circle',
  'g',
  'path',
  'svg',
  'text',
];

const htmlTagNames = [
  'div',
];

// (String, Object, ...[Node|String]) -> Element
function createElement(tagName, attributes, ...children) {
  const element = svgTagNames.includes(tagName)
    ? document.createElementNS('http://www.w3.org/2000/svg', tagName)
    : document.createElement(tagName);

  if (attributes) {
    for (const key of Object.keys(attributes)) {
      element.setAttribute(key === 'className' ? 'class' : key, attributes[key]);
    }
  }

  for (const child of flattenChildren(children)) {
    element.appendChild(child);
  }

  return element;
}

const dom = [...svgTagNames, ...htmlTagNames].reduce((result, tagName) => {
  result[tagName] = createElement.bind(null, tagName);
  return result;
}, {});

export default dom;
