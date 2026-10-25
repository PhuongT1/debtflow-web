import { sections } from './site.config.mjs';
export { documentDirectories, documentFiles, sections, site } from './site.config.mjs';
export function belongsToGroup(path, group) {
  return group.paths
    ? group.paths.includes(path)
    : path.startsWith(group.root + '/') &&
        (!group.pattern || group.pattern.test(path)) &&
        !group.exclude?.includes(path);
}
export function sectionForPath(path) {
  return sections.find((section) => section.groups.some((group) => belongsToGroup(path, group)));
}
