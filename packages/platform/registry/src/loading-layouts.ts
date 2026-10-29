import { partnerListLayout } from './registrations/partner-ops/loading-layout';

const loadingLayouts: Record<string, typeof partnerListLayout | undefined> = {
  'partner-ops': partnerListLayout,
};
export function getApplicationLoadingLayout(name: string) {
  return loadingLayouts[name];
}
