import { pageUrl } from './data.js';
import { resolveSourceLink } from './routes.mjs';
import { canonicalPath } from './aliases.mjs';
const namespace = 'http://www.w3.org/2000/svg';
const WHEEL_ZOOM_SENSITIVITY = 0.003;
const ZOOM_RESPONSE = 0.45;
const element = (name, attrs = {}) => {
  const node = document.createElementNS(namespace, name);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, String(value));
  return node;
};

export function createDiagramView(svg, output, openRule) {
  let fitted;
  let camera;
  let zoom = 1;
  let drag;
  let graph;
  let wheelTarget = 1;
  let animation;
  let anchor = { x: 0.5, y: 0.5 };
  function stopWheel() {
    cancelAnimationFrame(animation);
    animation = null;
    wheelTarget = zoom;
  }
  const update = () => {
    svg.setAttribute('viewBox', `${camera.x} ${camera.y} ${camera.width} ${camera.height}`);
    output.textContent = `${Math.round(zoom * 100)}%`;
  };
  function fit() {
    if (!graph || !svg.clientWidth || !svg.clientHeight) return;
    stopWheel();
    const ratio = svg.clientWidth / svg.clientHeight;
    const width = Math.max(graph.width, graph.height * ratio);
    const height = width / ratio;
    fitted = { x: (graph.width - width) / 2, y: (graph.height - height) / 2, width, height };
    camera = { ...fitted };
    zoom = 1;
    update();
  }
  function applyZoom(next, point = { x: 0.5, y: 0.5 }) {
    next = Math.max(0.15, Math.min(8, next));
    const width = fitted.width / next;
    const height = fitted.height / next;
    camera = {
      x: camera.x + (camera.width - width) * point.x,
      y: camera.y + (camera.height - height) * point.y,
      width,
      height,
    };
    zoom = next;
    update();
  }
  function scale(factor) {
    if (!camera) return;
    stopWheel();
    applyZoom(zoom * factor);
  }
  function animateWheel() {
    const difference = wheelTarget - zoom;
    applyZoom(
      Math.abs(difference) < 0.0001 ? wheelTarget : zoom + difference * ZOOM_RESPONSE,
      anchor,
    );
    animation = Math.abs(wheelTarget - zoom) < 0.0001 ? null : requestAnimationFrame(animateWheel);
  }
  function show(data, path) {
    graph = data;
    svg.replaceChildren();
    const defs = element('defs');
    const marker = element('marker', {
      id: 'arrow',
      viewBox: '0 0 10 10',
      refX: 9,
      refY: 5,
      markerWidth: 7,
      markerHeight: 7,
      orient: 'auto-start-reverse',
    });
    marker.append(element('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: '#73849c' }));
    defs.append(marker);
    svg.append(defs);
    const byId = new Map(data.nodes.map((node) => [node.id, node]));
    for (const edge of data.edges) {
      const a = byId.get(edge.from);
      const b = byId.get(edge.to);
      const x = a.x + a.width / 2;
      const y = a.y + a.height;
      const endX = b.x + b.width / 2;
      const endY = b.y;
      const middle = y + Math.max(40, (endY - y) / 2);
      const d =
        endY > y
          ? `M ${x} ${y} C ${x} ${middle}, ${endX} ${middle}, ${endX} ${endY}`
          : `M ${a.x + a.width} ${a.y + 60} C ${a.x + 360} ${a.y + 60}, ${b.x + 360} ${b.y + 60}, ${b.x + b.width} ${b.y + 60}`;
      svg.append(element('path', { d, class: 'edge', 'marker-end': 'url(#arrow)' }));
      if (edge.label) {
        const text = element('text', {
          x: (x + endX) / 2 + 8,
          y: (y + endY) / 2,
          class: 'edge-label',
        });
        text.textContent = edge.label;
        svg.append(text);
      }
    }
    for (const node of data.nodes) {
      const group = element(node.href ? 'a' : 'g', {
        class: `node${node.decision ? ' decision' : ''}`,
        transform: `translate(${node.x},${node.y})`,
        'aria-label': node.label,
      });
      if (node.href) {
        const target = resolveSourceLink(node.href, path);
        group.setAttribute('href', pageUrl(canonicalPath(target.path), target.anchor));
        group.addEventListener('click', (event) => {
          event.preventDefault();
          openRule(node.href, path);
        });
      }
      group.append(
        node.decision
          ? element('polygon', { points: '150,0 300,60 150,120 0,60' })
          : element('rect', { width: 300, height: 120, rx: 10 }),
      );
      const words = node.label.split(/\s+/);
      const lines = [''];
      const limit = node.decision ? 24 : 31;
      for (const word of words) {
        if ((lines.at(-1) + word).length > limit) lines.push('');
        lines[lines.length - 1] += `${lines.at(-1) ? ' ' : ''}${word}`;
      }
      const text = element('text', {
        x: 150,
        y: 60 - (lines.length - 1) * 9,
        'text-anchor': 'middle',
        'dominant-baseline': 'middle',
      });
      lines.forEach((line, index) => {
        const span = element('tspan', { x: 150, dy: index === 0 ? 0 : 18 });
        span.textContent = line;
        text.append(span);
      });
      group.append(text);
      svg.append(group);
    }
    fit();
  }
  svg.addEventListener(
    'wheel',
    (event) => {
      if (!camera || !event.deltaY) return;
      event.preventDefault();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? svg.clientHeight : 1;
      const delta = Math.max(-100, Math.min(100, event.deltaY * unit));
      const bounds = svg.getBoundingClientRect();
      anchor = {
        x: (event.clientX - bounds.left) / bounds.width,
        y: (event.clientY - bounds.top) / bounds.height,
      };
      wheelTarget = Math.max(
        0.15,
        Math.min(8, (animation ? wheelTarget : zoom) * Math.exp(-delta * WHEEL_ZOOM_SENSITIVITY)),
      );
      if (!animation) animation = requestAnimationFrame(animateWheel);
    },
    { passive: false },
  );
  svg.addEventListener('pointerdown', (event) => {
    if (!camera || event.target.closest('a')) return;
    stopWheel();
    drag = { x: event.clientX, y: event.clientY, camera: { ...camera } };
    svg.setPointerCapture(event.pointerId);
  });
  svg.addEventListener('pointermove', (event) => {
    if (!drag) return;
    camera.x = drag.camera.x - ((event.clientX - drag.x) * camera.width) / svg.clientWidth;
    camera.y = drag.camera.y - ((event.clientY - drag.y) * camera.height) / svg.clientHeight;
    update();
  });
  svg.addEventListener('pointerup', () => {
    drag = null;
  });
  svg.addEventListener('pointercancel', () => {
    drag = null;
  });
  svg.addEventListener('keydown', (event) => {
    if (!camera || event.target !== svg) return;
    const delta = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[
      event.key
    ];
    if (!delta) return;
    stopWheel();
    event.preventDefault();
    camera.x += (delta[0] * camera.width) / 10;
    camera.y += (delta[1] * camera.height) / 10;
    update();
  });
  return {
    show,
    fit,
    scale,
    reset: () => {
      fit();
      if (graph) scale(fitted.width / svg.clientWidth);
    },
  };
}
