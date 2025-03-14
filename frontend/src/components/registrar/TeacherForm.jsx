// components/registrar/TeacherForm.jsx
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Input from '../common/Input';
import Button from '../common/Button';
import styles from './TeacherForm.module.css';

const TeacherForm = () => {
  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    gender: Yup.string().required('Required'),
    dob: Yup.date().required('Required'),
    bloodGroup: Yup.string().required('Required'),
    religion: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    phone: Yup.string().matches(/^[0-9]+$/, 'Invalid phone number')
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      gender: '',
      dob: '',
      bloodGroup: '',
      religion: '',
      email: '',
      phone: '',
      address: '',
      bio: '',
      class: '',
      section: '',
      photo: null
    },
    validationSchema,
    onSubmit: values => {
      // Handle form submission
      console.log(values);
    }
  });

  return (
    <div className={styles.formContainer}>
      <h2>Add New Teacher</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.formSection}>
          <div className={styles.formRow}>
            <Input
              label="First Name *"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={formik.touched.firstName && formik.errors.firstName}
            />
            <Input
              label="Last Name *"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && formik.errors.lastName}
            />
          </div>

          <div className={styles.formRow}>
            <Input
              label="Gender *"
              name="gender"
              as="select"
              value={formik.values.gender}
              onChange={formik.handleChange}
              error={formik.touched.gender && formik.errors.gender}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Input>
            
            <Input
              label="Date of Birth *"
              type="date"
              name="dob"
              value={formik.values.dob}
              onChange={formik.handleChange}
              error={formik.touched.dob && formik.errors.dob}
            />
          </div>

          {/* Add more form fields following the same pattern */}
          
          <div className={styles.photoUpload}>
            <label>Upload Photo (150px X 150px)</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => formik.setFieldValue('photo', e.target.files[0])}
            />
          </div>

          <Button type="submit">Add Teacher</Button>
        </div>
      </form>
    </div>
  );
};

export default TeacherForm;