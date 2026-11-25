import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useInView } from 'motion/react';

import { debtStoryScenes } from './debt-story-scenes';

const sceneDuration = 5200;
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

function prefersReducedMotion() {
  return window.matchMedia(reducedMotionQuery).matches;
}

export function useDebtStoryPlayback() {
  const stageRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stageRef, { amount: 0.4 });
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    prefersReducedMotion,
    () => true,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const running = playing && inView && !reducedMotion;

  useEffect(() => {
    if (!running) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % debtStoryScenes.length);
    }, sceneDuration);

    return () => window.clearTimeout(timer);
  }, [activeIndex, running]);

  function selectScene(index: number) {
    setActiveIndex(index);
    setPlaying(false);
  }

  function togglePlayback() {
    setPlaying((current) => !current);
  }

  return {
    stageRef,
    activeIndex,
    playing,
    running,
    reducedMotion,
    sceneDuration,
    selectScene,
    togglePlayback,
  };
}
