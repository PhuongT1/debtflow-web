// Fixed local icon geometry; Markdown never supplies SVG markup.
const shapes = {
  start: ['M4 5h6a3 3 0 0 1 3 3v13a4 4 0 0 0-4-3H4z', 'M20 5h-4a3 3 0 0 0-3 3v13a4 4 0 0 1 4-3h3z'],
  architecture: ['M12 3 3 8l9 5 9-5z', 'M3 8v9l9 5 9-5V8', 'M12 13v9'],
  standards: ['M8 4H5v16h14V4h-3', 'M8 2h8v5H8z', 'm8 13 2 2 5-5'],
  ai: ['m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z'],
};
export function icon(name, className = 'nav-icon') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  for (const [key, value] of Object.entries({
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '1.7',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
    class: className,
  }))
    svg.setAttribute(key, value);
  for (const geometry of shapes[name] ?? []) {
    const path = document.createElementNS(svg.namespaceURI, 'path');
    path.setAttribute('d', geometry);
    svg.append(path);
  }
  return svg;
}
