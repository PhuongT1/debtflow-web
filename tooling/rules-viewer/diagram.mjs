// Supports the linked flowchart subset used by the repository's canonical Markdown.
export function parseDiagram(markdown) {
  const source = markdown.match(/```mermaid\s*\n([\s\S]*?)```/)?.[1];
  if (!source) return null;
  const nodes = new Map();
  const edges = [];
  const links = new Map();
  const declaration = /([A-Za-z]\w*)\s*(\[([^\]]+)\]|\{([^}]+)\})/g;
  for (const raw of source.split('\n')) {
    const line = raw.trim();
    if (!line || /^(flowchart|%%)/.test(line)) continue;
    const link = line.match(/^click\s+(\w+)\s+"([^"]+)"/);
    if (link) {
      links.set(link[1], link[2]);
      continue;
    }
    const compact = line.replace(declaration, (_, id, shape, square, diamond) => {
      const label = (square ?? diamond).replace(/^"|"$/g, '');
      nodes.set(id, { id, label, decision: shape.startsWith('{') });
      return id;
    });
    const edge = compact.match(/^(\w+)\s*-->\s*(?:\|([^|]+)\|\s*)?(\w+)$/);
    if (edge) edges.push({ from: edge[1], to: edge[3], label: edge[2] ?? '' });
    else if (!/^\w+$/.test(compact)) throw new Error(`Unsupported diagram line: ${line}`);
  }
  for (const edge of edges) {
    if (!nodes.has(edge.from) || !nodes.has(edge.to)) throw new Error('Undefined diagram node');
  }
  for (const id of links.keys()) if (!nodes.has(id)) throw new Error(`Unknown linked node: ${id}`);
  return {
    nodes: [...nodes.values()].map((node) => ({ ...node, href: links.get(node.id) })),
    edges,
  };
}

export function layoutDiagram(graph) {
  const incoming = new Set(graph.edges.map((edge) => edge.to));
  const roots = graph.nodes.filter((node) => !incoming.has(node.id));
  const levels = new Map();
  const queue = (roots.length ? roots : graph.nodes.slice(0, 1)).map((node) => [node.id, 0]);
  for (let index = 0; index < queue.length; index++) {
    const [id, level] = queue[index];
    if (levels.has(id)) continue;
    levels.set(id, level);
    for (const edge of graph.edges.filter((item) => item.from === id))
      queue.push([edge.to, level + 1]);
  }
  const columns = new Map();
  const nodes = graph.nodes.map((node) => {
    const level = levels.get(node.id) ?? 0;
    const column = columns.get(level) ?? 0;
    columns.set(level, column + 1);
    return { ...node, x: 60 + column * 380, y: 60 + level * 210, width: 300, height: 120 };
  });
  return {
    nodes,
    edges: graph.edges,
    width: Math.max(...nodes.map((node) => node.x + node.width)) + 60,
    height: Math.max(...nodes.map((node) => node.y + node.height)) + 60,
  };
}
