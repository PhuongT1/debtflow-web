// Convert primitive hex colors once for reusable state and elevation roles.
export function withOpacity(hex: string, opacity: number) {
  const channels = [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
  return `rgba(${channels.join(', ')}, ${opacity})`;
}
