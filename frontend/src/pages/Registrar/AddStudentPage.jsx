import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentForm from '../../components/registrar/StudentForm';
import { adminService } from '../../services/adminService';
import { registrarService } from '../../services/registrarService';
import MainLayout from '../../components/layouts/MainLayout';
import styles from './AddStudentPage.module.css';

const AddStudentPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');

      // Initialize services
      const adminAPI = adminService();
      const registrarAPI = registrarService();

      // 1. Create User First
      const user = await adminAPI.createUser({
        user_id: formData.user_id,
        email: formData.userEmail,
        password: formData.userPassword,
        role: 'student'
      });

      // 2. Create Parent
      const parent = await registrarAPI.registerParent({
        parent_id: formData.parent_id,
        user_id: formData.user_id,
        father_first_name: formData.fatherFirstName,
        father_middle_name: formData.fatherMiddleName,
        father_last_name: formData.fatherLastName,
        mother_first_name: formData.motherFirstName,
        mother_middle_name: formData.motherMiddleName,
        mother_last_name: formData.motherLastName,
        phone: formData.phone,
        email: formData.email,
        relationship: formData.relationship,
        address: formData.parentsAddress
      });

      // 3. Create Student
      const student = await registrarAPI.registerStudent({
        student_id: `STU_${Date.now()}`,
        user_id: formData.user_id,
        parent_id: formData.parent_id,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        gender: formData.gender,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        email: formData.email,
        photo: formData.photo,
        roll: formData.roll,
        blood_type: formData.bloodGroup,
        religion: formData.religion,
        class: formData.className,
        section: formData.section,
        admission_id: formData.admissionId,
        phone: formData.phone,
        status: 'active'
      });

      navigate('/registrar/students');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout role="registrar">
      <div className={styles.page}>
        <h1>Add New Student</h1>
        {error && <div className={styles.error}>{error}</div>}
        <StudentForm 
          onSubmit={handleSubmit} 
          loading={loading}
        />
      </div>
    </MainLayout>
  );
};

export default AddStudentPage;