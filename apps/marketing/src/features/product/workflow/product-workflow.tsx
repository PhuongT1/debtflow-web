import styles from './product-workflow.module.css';

const steps = [
  {
    title: 'Ghi nhận khoản công nợ',
    description: 'Chọn khách hàng hoặc nhà cung cấp, nhập số tiền và hạn thanh toán.',
  },
  {
    title: 'Rà soát khoản đến hạn',
    description: 'Lọc theo trạng thái hoặc đối tác để chuẩn bị danh sách các khoản cần xử lý.',
  },
  {
    title: 'Đối chiếu sau thanh toán',
    description: 'Ghi nhận khoản đã thu hoặc trả, rồi kiểm tra số dư và lịch sử phân bổ.',
  },
];

export function ProductWorkflow() {
  return (
    <section className={styles.section} aria-labelledby="workflow-title">
      <div className="site-width content-section">
        <h2 className="section-title" id="workflow-title">
          Một khoản công nợ được theo dõi thế nào?
        </h2>
        <ol className={styles.steps}>
          {steps.map((step) => (
            <li key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
