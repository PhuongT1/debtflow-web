'use client';

import { useState } from 'react';

import {
  demoReceivable,
  demoRemainingReceivable,
  formatDemoCurrency,
  formatDemoDueDate,
} from '../debt-demo-data';

import styles from './debt-preview.module.css';

const records = [
  { ...demoReceivable, amount: demoRemainingReceivable },
  {
    code: 'CN-1048',
    partner: 'Thương mại Minh Châu',
    dueDate: '2026-11-26',
    amount: 58500000,
    overdue: false,
  },
  {
    code: 'CN-1051',
    partner: 'Phân phối Nam Việt',
    dueDate: '2026-11-30',
    amount: 37500000,
    overdue: false,
  },
];

const outstanding = records.reduce((total, record) => total + record.amount, 0);
const overdue = records.reduce((total, record) => total + (record.overdue ? record.amount : 0), 0);

export function DebtPreview() {
  const [overdueOnly, setOverdueOnly] = useState(false);
  const visibleRecords = overdueOnly ? records.filter((record) => record.overdue) : records;

  return (
    <div className={styles.preview}>
      <div className={styles.header}>
        <p>Sổ công nợ</p>
        <span>Dữ liệu minh họa</span>
      </div>
      <dl className={styles.summary}>
        <div>
          <dt>Tổng phải thu</dt>
          <dd>{formatDemoCurrency(outstanding)}</dd>
        </div>
        <div>
          <dt>Quá hạn</dt>
          <dd>{formatDemoCurrency(overdue)}</dd>
        </div>
      </dl>
      <div className={styles.filters} role="group" aria-label="Lọc khoản phải thu">
        <button type="button" aria-pressed={!overdueOnly} onClick={() => setOverdueOnly(false)}>
          Tất cả
        </button>
        <button type="button" aria-pressed={overdueOnly} onClick={() => setOverdueOnly(true)}>
          Quá hạn
        </button>
        <span role="status">{visibleRecords.length} khoản</span>
      </div>
      <table className={styles.records}>
        <thead>
          <tr>
            <th scope="col">Đối tác</th>
            <th scope="col">Còn phải thu</th>
          </tr>
        </thead>
        <tbody>
          {visibleRecords.map((record) => (
            <tr key={record.code}>
              <th scope="row">
                <strong>{record.partner}</strong>
                <span>
                  {record.code} · Hạn{' '}
                  <time dateTime={record.dueDate}>{formatDemoDueDate(record.dueDate)}</time>
                </span>
              </th>
              <td>
                <strong>{formatDemoCurrency(record.amount)}</strong>
                <span className={record.overdue ? styles.overdue : undefined}>
                  {record.overdue ? 'Quá hạn' : 'Trong hạn'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
