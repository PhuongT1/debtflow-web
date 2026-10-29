import { brand } from '../palette/brand';

// Keep every gradient stop dark enough for the shared white action foreground.
export function createBrandEffects() {
  return {
    primaryGradient: `linear-gradient(135deg, ${brand[700]}, ${brand[600]})`,
    primaryHoverGradient: `linear-gradient(135deg, ${brand[800]}, ${brand[700]})`,
    brandPanel: `linear-gradient(145deg, ${brand[800]}, ${brand[600]})`,
  };
}
