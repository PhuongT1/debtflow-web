import styles from './product-questions.module.css';

const questions = [
  {
    title: 'DebtFlow quản lý khoản phải thu hay khoản phải trả?',
    answer:
      'Cả hai. Bạn có thể theo dõi số tiền khách hàng còn nợ và số tiền doanh nghiệp cần trả nhà cung cấp.',
  },
  {
    title: 'Nếu đối tác thanh toán một phần thì sao?',
    answer:
      'Bạn có thể ghi nhận số tiền thực tế đã thu hoặc đã trả, xem khoản đã được phân bổ và kiểm tra số dư còn lại.',
  },
  {
    title: 'Có thể xuất danh sách công nợ để đối chiếu không?',
    answer: 'Có. Trong ứng dụng, bạn có thể xuất danh sách công nợ ra Excel theo bộ lọc đang chọn.',
  },
  {
    title: 'Tôi cần chuẩn bị gì để ghi nhận công nợ?',
    answer:
      'Chuẩn bị thông tin đối tác, số tiền phải thu hoặc phải trả, ngày phát sinh và hạn thanh toán. Bạn có thể thêm số hóa đơn hoặc ghi chú để tra cứu sau.',
  },
  {
    title: 'Tôi có thể xem minh họa trước khi đăng nhập không?',
    answer:
      'Có. Bạn có thể chọn từng bước trong minh họa và thử bộ lọc trên sổ mẫu ngay tại trang này. Hai phần sử dụng dữ liệu ví dụ.',
  },
];

export function ProductQuestions() {
  return (
    <section
      className={`site-width content-section ${styles.section}`}
      aria-labelledby="questions-title"
    >
      <h2 className="section-title" id="questions-title">
        Câu hỏi thường gặp
      </h2>
      <div className={styles.list}>
        {questions.map((question) => (
          <details key={question.title}>
            <summary>{question.title}</summary>
            <p>{question.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
