export function isFormFieldPath(values: unknown, path: string): boolean {
  if (!path || /(?:^|\.)(?:__proto__|prototype|constructor)(?:\.|$)/.test(path)) return false;
  let current: unknown = values;
  for (const part of path.split('.')) {
    if (!current || typeof current !== 'object' || !Object.hasOwn(current, part)) return false;
    current = Reflect.get(current, part);
  }
  return true;
}
