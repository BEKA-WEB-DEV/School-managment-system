import styles from './Button.module.css';

const Button = ({ children, onClick, type = 'button', disabled = false, className }) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;