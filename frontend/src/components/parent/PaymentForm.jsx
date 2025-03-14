import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './PaymentForm.module.css';

const PaymentForm = ({ onSubmit }) => {
  const [paymentData, setPaymentData] = useState({
    studentId: '',
    amount: '',
    purpose: 'tuition'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(paymentData);
  };

  return (
    <form className={styles.paymentForm} onSubmit={handleSubmit}>
      <Input
        placeholder="Student ID"
        value={paymentData.studentId}
        onChange={(e) => setPaymentData({ ...paymentData, studentId: e.target.value })}
        required
      />
      <Input
        type="number"
        placeholder="Amount"
        value={paymentData.amount}
        onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
        required
      />
      <select
        value={paymentData.purpose}
        onChange={(e) => setPaymentData({ ...paymentData, purpose: e.target.value })}
        className={styles.select}
      >
        <option value="tuition">Tuition</option>
        <option value="uniform">Uniform</option>
        <option value="activities">Activities</option>
        <option value="other">Other</option>
      </select>
      <Button type="submit">Make Payment</Button>
    </form>
  );
};

export default PaymentForm;