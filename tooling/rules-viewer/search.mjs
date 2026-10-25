export function searchDocuments(documents, query) {
  const terms = query.trim().toLowerCase().slice(0, 200).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return documents
    .flatMap(({ path, title, text, section }) => {
      const body = `${title}\n${path}\n${text}`.toLowerCase();
      if (!terms.every((term) => body.includes(term))) return [];
      const score = terms.reduce(
        (value, term) =>
          value + (title.toLowerCase().includes(term) ? 20 : 0) + (path.includes(term) ? 8 : 0),
        0,
      );
      const start = Math.max(0, text.toLowerCase().indexOf(terms[0]) - 60);
      return [
        {
          path,
          title,
          section,
          snippet: text.slice(start, start + 200).replace(/[#*`\n|]/g, ' '),
          score,
        },
      ];
    })
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path))
    .slice(0, 20);
}
