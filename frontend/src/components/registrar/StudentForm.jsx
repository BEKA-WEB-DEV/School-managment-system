import React, { useState } from 'react';
import Button from '../common/Button';
import styles from './StudentForm.module.css';

const StudentForm = ({ onSubmit, loading }) => {
  // Helper to generate IDs
  const generateIds = () => ({
    user_id: `USR_${Date.now()}`,
    parent_id: `PAR_${Date.now()}`
  });

  // 1. INITIAL STATE
  const initialState = {
    // New User Registration Fields
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
    // Student info
    user_id: '',
    parent_id: '',
    photo: null,
    firstName: '',
    middleName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    roll: '',
    bloodGroup: '',
    religion: '',
    email: '',
    className: '',
    section: '',
    admissionId: '',
    phone: '',
    shortBio: '',

    // Parent/Guardian info
    fatherFirstName: '',
    fatherMiddleName: '',
    fatherLastName: '',
    motherFirstName: '',
    motherMiddleName: '',
    motherLastName: '',
    phone: '',
    email: '',
    parentsAddress: '',
    relationship: ''
  };

  // Initialize formData with auto-generated IDs.
  const [formData, setFormData] = useState({
    ...initialState,
    ...generateIds()
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  // 2. HANDLE FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate required fields
    const requiredFields = [
      'userEmail', 'userPassword', 'confirmPassword', 'firstName', 'middleName', 
      'lastName', 'gender', 'dateOfBirth', 'email', 'address',
      'fatherFirstName', 'fatherLastName', 'relationship'
    ];
  
    // Password validation
    if (formData.userPassword !== formData.confirmPassword) {
      setErrors({ general: 'Passwords do not match' });
      return false;
    }
  
    // Email format validation
    if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
      setErrors({ general: 'Invalid email format' });
      return false;
    }
  
    // Check for missing required fields
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setErrors({ general: 'Please fill all required fields' });
      return;
    }
  
    try {
      // 1. First Create the User
      const userResponse = await fetch('http://localhost:3000/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: formData.user_id,
          email: formData.userEmail,
          password: formData.userPassword,
          role: 'student'
        })
      });
  
      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.error || 'Failed to create user');
      }
  
      // 2. Then Create the Parent
      const parentResponse = await fetch('/api/parents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        })
      });
  
      if (!parentResponse.ok) {
        const errorData = await parentResponse.json();
        throw new Error(errorData.error || 'Failed to create parent');
      }
  
      // 3. Finally Create the Student
      const studentResponse = await fetch('/registrar/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: `STU_${Date.now()}`,
          user_id: formData.user_id,
          parent_id: formData.parent_id,
          first_name: formData.firstName,
          middle_name: formData.middleName,
          last_name: formData.lastName,
          gender: formData.gender,
          date_of_birth: formData.dateOfBirth,
          address: formData.address,
          email: formData.studentEmail,
          photo: formData.photo,
          roll: formData.roll,
          blood_type: formData.bloodGroup,
          religion: formData.religion,
          class: formData.className,
          section: formData.section,
          admission_id: formData.admissionId,
          status: 'active'
        })
      });
  
      if (!studentResponse.ok) {
        const errorData = await studentResponse.json();
        throw new Error(errorData.error || 'Failed to create student');
      }
  
      // If all successful
      onSubmit({
        success: true,
        message: 'Student registration completed successfully'
      });
  
    } catch (error) {
      setErrors({ general: error.message });
    }
  };
  // 3. RESET FORM: reset all fields and generate new IDs
  const handleReset = () => {
    setFormData({
      ...initialState,
      ...generateIds()
    });
    setPhotoPreview(null);
    setErrors({});
  };

  // 4. HANDLE FIELD CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 5. HANDLE PHOTO UPLOAD (with basic validation)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prevErrors) => ({ ...prevErrors, photo: 'Only image files allowed' }));
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prevErrors) => ({ ...prevErrors, photo: 'File size must be under 2MB' }));
        return;
      }
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(null);
    }
    setFormData((prev) => ({ ...prev, photo: file || null }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add New Student</h2>

      {errors.general && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* ======================
          STUDENT DETAILS
        ====================== */}

    {/* New User Registration Section */}
    <div className={styles.userSection}>
        <h3>User Account Details</h3>
        <div className={styles.gridContainer}>
          <div>
            <label htmlFor="userEmail" className={styles.relationshipLabel}>
              Email *
            </label>
            <input
              id="userEmail"
              name="userEmail"
              type="email"
              value={formData.userEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="userPassword" className={styles.relationshipLabel}>
              Password *
            </label>
            <input
              id="userPassword"
              name="userPassword"
              type="password"
              value={formData.userPassword}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={styles.relationshipLabel}>
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      <hr style={{ margin: '2rem 0' }} />

<div className={styles.gridContainer}>
  {/* FIRST NAME */}
  <div>
    <label htmlFor="firstName" className={styles.relationshipLabel}>
      First Name *
    </label>
    <input
      id="firstName"
      name="firstName"
      type="text"
      value={formData.firstName}
      onChange={handleChange}
      required
    />
  </div>

  {/* MIDDLE NAME */}
  <div>
    <label htmlFor="middleName" className={styles.relationshipLabel}>
      Middle Name
    </label>
    <input
      id="middleName"
      name="middleName"
      type="text"
      value={formData.middleName}
      onChange={handleChange}
    />
  </div>

  {/* LAST NAME */}
  <div>
    <label htmlFor="lastName" className={styles.relationshipLabel}>
      Last Name *
    </label>
    <input
      id="lastName"
      name="lastName"
      type="text"
      value={formData.lastName}
      onChange={handleChange}
      required
    />
  </div>

  {/* ADDRESS */}
  <div>
    <label htmlFor="address" className={styles.relationshipLabel}>
      Address *
    </label>
    <input
      id="address"
      name="address"
      type="text"
      value={formData.address}
      onChange={handleChange}
      required
    />
  </div>

  {/* GENDER */}
  <div>
    <label htmlFor="gender" className={styles.relationshipLabel}>
      Gender *
    </label>
    <select
      id="gender"
      name="gender"
      value={formData.gender}
      onChange={handleChange}
      required
      className={styles.relationshipSelect}
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
  </div>

  {/* DATE OF BIRTH */}
  <div>
    <label htmlFor="dateOfBirth" className={styles.relationshipLabel}>
      Date Of Birth *
    </label>
    <input
      id="dateOfBirth"
      name="dateOfBirth"
      type="date"
      max={new Date().toISOString().split('T')[0]}
      value={formData.dateOfBirth}
      onChange={handleChange}
      required
    />
  </div>

  {/* EMAIL */}
  <div>
    <label htmlFor="email" className={styles.relationshipLabel}>
      E-Mail *
    </label>
    <input
      id="email"
      name="email"
      type="email"
      value={formData.studentEmail}
      onChange={handleChange}
      required
    />
  </div>

            {/* CLASS */}
            <div>
            <label htmlFor="className" className={styles.relationshipLabel}>
              Class
            </label>
            <select
              id="className"
              name="className"
              value={formData.className}
              onChange={handleChange}
              className={styles.relationshipSelect}
            >
              <option value="">Select Class</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
              {/* Add more as needed */}
            </select>
          </div>

          {/* SECTION */}
          <div>
            <label htmlFor="section" className={styles.relationshipLabel}>
              Section
            </label>
            <select
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className={styles.relationshipSelect}
            >
              <option value="">Select Section</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

  {/* STATUS */}
  <div>
    <label htmlFor="status" className={styles.relationshipLabel}>
      Status *
    </label>
    <select
      id="status"
      name="status"
      value={formData.status}
      onChange={handleChange}
      required
      className={styles.relationshipSelect}
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
      <option value="graduated">Graduated</option>
    </select>
  </div>
</div>

{/* PHOTO UPLOAD */}
<div className={styles.photoUploadContainer}>
  <label className={styles.label}>
    Upload Student Photo (150px x 150px)
  </label>
  <input
    className={styles.photoInput}
    type="file"
    accept="image/*"
    onChange={handlePhotoChange}
  />
  {errors.photo && (
    <p style={{ color: 'red', marginTop: '0.5rem' }}>
      {errors.photo}
    </p>
  )}
  {photoPreview && (
    <div className={styles.photoPreviewContainer}>
      <img
        src={photoPreview}
        alt="Preview"
        className={styles.photoPreviewImg}
      />
    </div>
  )}
  {formData.photo && (
    <div style={{ marginTop: '0.5rem' }}>
      <button
        type="button"
        onClick={() => {
          setFormData({ ...formData, photo: null });
          setPhotoPreview(null);
        }}
        className={styles.removePhotoBtn}
      >
        Remove Photo
      </button>
    </div>
  )}
</div>

<hr style={{ margin: '2rem 0' }} />

{/* PARENT / GUARDIAN DETAILS */}
<h3>Parent / Guardian Details</h3>
<div className={styles.gridContainer}>
  {/* PARENT ID */}
  <div>
    <label htmlFor="parent_id" className={styles.relationshipLabel}>
      Parent ID *
    </label>
    <input
      id="parent_id"
      name="parent_id"
      type="text"
      value={formData.parent_id}
      readOnly
    />
  </div>

  {/* FATHER'S FIRST NAME */}
  <div>
    <label htmlFor="fatherFirstName" className={styles.relationshipLabel}>
      Father's First Name *
    </label>
    <input
      id="fatherFirstName"
      name="fatherFirstName"
      type="text"
      value={formData.fatherFirstName}
      onChange={handleChange}
      required
    />
  </div>

  {/* FATHER'S MIDDLE NAME */}
  <div>
    <label htmlFor="fatherMiddleName" className={styles.relationshipLabel}>
      Father's Middle Name
    </label>
    <input
      id="fatherMiddleName"
      name="fatherMiddleName"
      type="text"
      value={formData.fatherMiddleName}
      onChange={handleChange}
    />
  </div>

  {/* FATHER'S LAST NAME */}
  <div>
    <label htmlFor="fatherLastName" className={styles.relationshipLabel}>
      Father's Last Name *
    </label>
    <input
      id="fatherLastName"
      name="fatherLastName"
      type="text"
      value={formData.fatherLastName}
      onChange={handleChange}
      required
    />
  </div>

  {/* PHONE */}
  <div>
    <label htmlFor="phone" className={styles.relationshipLabel}>
      Phone *
    </label>
    <input
      id="phone"
      name="phone"
      type="number"
      value={formData.phone}
      onChange={handleChange}
      required
    />
  </div>

  {/* EMAIL */}
  <div>
    <label htmlFor="email" className={styles.relationshipLabel}>
      Email *
    </label>
    <input
      id="email"
      name="email"
      type="email"
      value={formData.email}
      onChange={handleChange}
      required
    />
  </div>

  {/* MOTHER'S FIRST NAME */}
  <div>
    <label htmlFor="motherFirstName" className={styles.relationshipLabel}>
      Mother's First Name *
    </label>
    <input
      id="motherFirstName"
      name="motherFirstName"
      type="text"
      value={formData.motherFirstName}
      onChange={handleChange}
      required
    />
  </div>

  {/* MOTHER'S MIDDLE NAME */}
  <div>
    <label htmlFor="motherMiddleName" className={styles.relationshipLabel}>
      Mother's Middle Name
    </label>
    <input
      id='motherMiddleName'
      name='motherMiddleName'
      type='text'
      value={formData.motherMiddleName}
      onChange={handleChange}
      required
    />
  </div>

  {/* MOTHER'S LAST NAME */}
  <div>
    <label htmlFor="motherLastName" className={styles.relationshipLabel}>
      Mother's Last Name *
    </label>
    <input
      id="motherLastName"
      name="motherLastName"
      type="text"
      value={formData.motherLastName}
      onChange={handleChange}
      required
    />
  </div>

  {/* RELATIONSHIP */}
  <div>
    <label htmlFor="relationship" className={styles.relationshipLabel}>
      Relationship *
    </label>
    <select
      id="relationship"
      name="relationship"
      value={formData.relationship}
      onChange={handleChange}
      required
      className={styles.relationshipSelect}
    >
      <option value="">Select Relationship</option>
      <option value="Parent">Parent</option>
      <option value="Guardian">Guardian</option>
    </select>
  </div>

  {/* ADDRESS */}
  <div style={{ gridColumn: 'span 4' }}>
    <label htmlFor="address" className={styles.relationshipLabel}>
      Address *
    </label>
    <input
      style={{ width: '25%', marginLeft: '0.5rem' }}
      id="parentsAddress"
      name="parentsAddress"
      type="text"
      value={formData.parentsAddress}
      onChange={handleChange}
      required
    />
  </div>
</div>

        {/* ACTION BUTTONS */}
        <div className={styles.actionButtons}>
          <Button
            type="submit"
            disabled={loading}
            className={styles.saveBtn}
          >
            {loading ? 'Saving...' : 'Add Student'}
          </Button>
          <Button
            type="button"
            onClick={handleReset}
            className={styles.resetBtn}
            disabled={loading}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
