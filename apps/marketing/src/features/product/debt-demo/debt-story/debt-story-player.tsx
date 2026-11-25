'use client';

import { AnimatePresence, domAnimation, LazyMotion } from 'motion/react';
import * as m from 'motion/react-m';

import styles from './debt-story.module.css';
import { debtStoryScenes } from './debt-story-scenes';
import { DebtStoryStage } from './debt-story-stage';
import { useDebtStoryPlayback } from './use-debt-story-playback';

export function DebtStoryPlayer() {
  const {
    stageRef,
    activeIndex,
    playing,
    running,
    reducedMotion,
    sceneDuration,
    selectScene,
    togglePlayback,
  } = useDebtStoryPlayback();
  const scene = debtStoryScenes[activeIndex];

  return (
    <LazyMotion features={domAnimation}>
      <div className={styles.player}>
        <div className={styles.controls}>
          <div className={styles.steps} role="group" aria-label="Chọn bước trong minh họa">
            {debtStoryScenes.map(({ action, id }, index) => (
              <button
                key={id}
                type="button"
                aria-pressed={activeIndex === index}
                onClick={() => selectScene(index)}
              >
                <span className={styles.stepNumber} aria-hidden="true">
                  {index + 1}
                </span>
                {action}
              </button>
            ))}
          </div>
          {!reducedMotion && (
            <button className={styles.playback} type="button" onClick={togglePlayback}>
              <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
              {playing ? 'Tạm dừng' : 'Phát tiếp'}
            </button>
          )}
        </div>
        <div ref={stageRef} className={styles.stage} aria-live={running ? 'off' : 'polite'}>
          <div className={styles.stageHeader}>
            <strong>Chi tiết khoản phải thu</strong>
            <span>Dữ liệu minh họa</span>
          </div>
          <div className={styles.playProgress} aria-hidden="true">
            {running && (
              <m.span
                key={activeIndex}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: sceneDuration / 1000, ease: 'linear' }}
              />
            )}
          </div>
          <div className={styles.stageCanvas}>
            <AnimatePresence initial={false}>
              <m.div
                key={scene.id}
                className={styles.frame}
                initial={reducedMotion ? false : { opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reducedMotion ? 0 : -14 }}
                transition={{ duration: reducedMotion ? 0 : 0.27 }}
              >
                <DebtStoryStage scene={scene} reducedMotion={reducedMotion} />
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
