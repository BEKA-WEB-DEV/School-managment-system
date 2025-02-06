export const generateEmployeeId = () => {
    const randomChars = Math.random().toString(36).slice(-4).toUpperCase();
    return `EMP-${Date.now().toString().slice(-6)}-${randomChars}`;
  };
  
  export const generatePaymentId = () => {
    const randomChars = Math.random().toString(36).slice(-4).toUpperCase();
    return `PAY-${Date.now().toString().slice(-6)}-${randomChars}`;
  };

  export const generateStudentId = () => {
    const randomChars = Math.random().toString(36).slice(-4).toUpperCase();
    return `STU-${Date.now().toString().slice(-6)}-${randomChars}`;
  };
  
  export const generateParentId = () => {
    const randomChars = Math.random().toString(36).slice(-4).toUpperCase();
    return `PAR-${Date.now().toString().slice(-6)}-${randomChars}`;
  };

    export const generateExamId = () => {
    const randomChars = Math.random().toString(36).slice(-4).toUpperCase();
    return `EXM-${Date.now().toString().slice(-6)}-${randomChars}`;
  }; 