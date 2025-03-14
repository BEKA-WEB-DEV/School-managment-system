import { useEffect, useState } from 'react';
import PaymentForm from '../../components/parent/PaymentForm';
import { parentService } from '../../services/parentService';
import Notification from '../../components/system/Notification';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './PaymentPage.module.css';

const PaymentPage = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await parentService().getPaymentHistory();
        setPaymentHistory(data);
      } catch (err) {
        setError('Failed to load payment history');
      }
    };
    fetchPayments();
  }, []);

  const handlePayment = async (paymentData) => {
    try {
      const newPayment = await parentService().makePayment(paymentData);
      setPaymentHistory([newPayment, ...paymentHistory]);
      setSuccess('Payment successful');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Payment failed');
    }
  };

  return (
    <MainLayout role="parent">
      <div className={styles.paymentPage}>
        <h1>Payment Management</h1>
        {success && <Notification message={success} type="success" />}
        {error && <Notification message={error} type="error" />}
        
        <div className={styles.paymentSection}>
          <h2>New Payment</h2>
          <PaymentForm onSubmit={handlePayment} />
        </div>

        <div className={styles.historySection}>
          <h2>Payment History</h2>
          <div className={styles.paymentList}>
            {paymentHistory.map((payment) => (
              <div key={payment.payment_id} className={styles.paymentItem}>
                <span>Amount: ${payment.amount}</span>
                <span>Date: {new Date(payment.date).toLocaleDateString()}</span>
                <span>Status: {payment.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentPage;