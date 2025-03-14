import styles from './Input.module.css';

const Input = ({ type = 'text', placeholder, value, onChange, required = false }) => {
  return (
    <input
      type={type}
      className={styles.input}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  );
};

export default Input;