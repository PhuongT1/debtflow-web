'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, domAnimation, LazyMotion, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';

import styles from './daily-workflow.module.css';
import { dailyWorkflowSteps } from './daily-workflow-content';

export function DailyWorkflow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const activeStep = dailyWorkflowSteps[activeIndex];

  return (
    <section className={`site-width ${styles.section}`} aria-labelledby="daily-workflow-title">
      <div className={styles.intro}>
        <h2 className="section-title" id="daily-workflow-title">
          Một ngày quản lý công nợ
        </h2>
        <p>Chọn từng thời điểm để xem bạn có thể làm gì với DebtFlow trong ngày.</p>
      </div>
      <div className={styles.controls} role="group" aria-label="Chọn thời điểm làm việc">
        {dailyWorkflowSteps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            aria-pressed={index === activeIndex}
            aria-controls="daily-workflow-panel"
            onClick={() => setActiveIndex(index)}
          >
            {step.label}
          </button>
        ))}
      </div>
      <div id="daily-workflow-panel">
        <LazyMotion features={domAnimation}>
          <AnimatePresence initial={false} mode="wait">
            <m.article
              className={styles.panel}
              key={activeStep.id}
              initial={reducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
              transition={{ duration: reducedMotion ? 0 : 0.22 }}
            >
              <div className={styles.image}>
                <Image
                  src={activeStep.image}
                  alt={activeStep.imageAlt}
                  fill
                  sizes="(max-width: 760px) 100vw, 45vw"
                />
              </div>
              <div className={styles.copy}>
                <h3>{activeStep.title}</h3>
                <p>{activeStep.description}</p>
                <ol>
                  {activeStep.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <Link className={`button button-primary ${styles.action}`} href={activeStep.href}>
                  {activeStep.action} <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </m.article>
          </AnimatePresence>
        </LazyMotion>
      </div>
    </section>
  );
}
