import { useIsPresent } from 'motion/react';
import * as m from 'motion/react-m';

import { demoReceivable, formatDemoCurrency, formatDemoDueDate } from '../debt-demo-data';

import type { DebtStoryScene } from './debt-story-scenes';
import styles from './debt-story-stage.module.css';

type DebtStoryStageProps = Readonly<{ scene: DebtStoryScene; reducedMotion: boolean }>;

export function DebtStoryStage({ scene, reducedMotion }: DebtStoryStageProps) {
  const isPresent = useIsPresent();
  return (
    <div className={styles.scene} data-scene={scene.id} aria-hidden={!isPresent}>
      <m.div
        className={styles.receivable}
        initial={reducedMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.3, delay: reducedMotion ? 0 : 0.08 }}
      >
        <div className={styles.sceneHeader}>
          <div>
            <span>
              {demoReceivable.code} · Đến hạn{' '}
              <time dateTime={demoReceivable.dueDate}>
                {formatDemoDueDate(demoReceivable.dueDate)}
              </time>
            </span>
            <h3>{demoReceivable.partner}</h3>
          </div>
          <span className={styles.status}>{scene.status}</span>
        </div>
        <dl className={styles.totals}>
          <div>
            <dt>Còn phải thu</dt>
            <dd>{formatDemoCurrency(demoReceivable.amount - scene.paid)}</dd>
          </div>
          <div>
            <dt>Đã thu</dt>
            <dd>{formatDemoCurrency(scene.paid)}</dd>
          </div>
        </dl>
        <div className={styles.bar} aria-hidden="true">
          <m.span
            initial={reducedMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: scene.paid / demoReceivable.amount }}
            transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.12 }}
          />
        </div>
      </m.div>
      <m.div
        className={styles.event}
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.28, delay: reducedMotion ? 0 : 0.18 }}
      >
        <span className={styles.eventIcon} aria-hidden="true">
          {scene.id === 'overdue' ? '!' : '✓'}
        </span>
        <div>
          <strong>{scene.event}</strong>
          <p>{scene.detail}</p>
        </div>
      </m.div>
    </div>
  );
}
