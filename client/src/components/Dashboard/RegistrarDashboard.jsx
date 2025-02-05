// src/components/Dashboard/RegistrarDashboard.jsx
import React, { useState } from 'react';
import { registrarService } from '../../services/registrarService';
import './RegistrarDashboard.css';

const RegistrarDashboard = () => {
    const [studentFormData, setStudentFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        email: '',
        address: '',
        parentName: '',
        phoneNumber: '',
        paymentMethod: ''
    });

    const [teacherFormData, setTeacherFormData] = useState({
        firstName: '',
        lastName: '',
        gender: '',
        dob: '',
        bloodGroup: '',
        religion: '',
        email: '',
        idNo: '',
        class: '',
        section: '',
        address: '',
        phone: '',
        shortBio: ''
    });

    const handleStudentChange = (e) => {
        setStudentFormData({ ...studentFormData, [e.target.name]: e.target.value });
    };

    const handleTeacherChange = (e) => {
        setTeacherFormData({ ...teacherFormData, [e.target.name]: e.target.value });
    };

    const handleSubmitStudent = async (e) => {
        e.preventDefault();
        try {
            await registrarService.addNewStudent(studentFormData);
            alert('Student added successfully!');
        } catch (err) {
            alert('Error adding student');
        }
    };

    const handleSubmitTeacher = async (e) => {
        e.preventDefault();
        try {
            await registrarService.addNewTeacher(teacherFormData);
            alert('Teacher added successfully!');
        } catch (err) {
            alert('Error adding teacher');
        }
    };

    return (
        <div className="registrar-dashboard">
            <h2>Registrar Dashboard</h2>
            <div className="add-new-student">
                <h3>Add New Student</h3>
                <form onSubmit={handleSubmitStudent}>
                    {/* Student form fields */}
                    <input type="text" name="firstName" placeholder="First Name" value={studentFormData.firstName} onChange={handleStudentChange} />
                    <input type="text" name="lastName" placeholder="Last Name" value={studentFormData.lastName} onChange={handleStudentChange} />
                    <input type="date" name="dob" placeholder="Date of Birth" value={studentFormData.dob} onChange={handleStudentChange} />
                    <select name="gender" value={studentFormData.gender} onChange={handleStudentChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <input type="email" name="email" placeholder="Email" value={studentFormData.email} onChange={handleStudentChange} />
                    <textarea name="address" placeholder="Address" value={studentFormData.address} onChange={handleStudentChange} />
                    <input type="text" name="parentName" placeholder="Parent Name" value={studentFormData.parentName} onChange={handleStudentChange} />
                    <input type="tel" name="phoneNumber" placeholder="Phone Number" value={studentFormData.phoneNumber} onChange={handleStudentChange} />
                    <input type="radio" name="paymentMethod" value="Cash" checked={studentFormData.paymentMethod === 'Cash'} onChange={handleStudentChange} /> Cash
                    <input type="radio" name="paymentMethod" value="Online" checked={studentFormData.paymentMethod === 'Online'} onChange={handleStudentChange} /> Online
                    <button type="submit">Save</button>
                </form>
            </div>
            <div className="add-new-teacher">
                <h3>Add New Teacher</h3>
                <form onSubmit={handleSubmitTeacher}>
                    {/* Teacher form fields */}
                    <input type="text" name="firstName" placeholder="First Name" value={teacherFormData.firstName} onChange={handleTeacherChange} />
                    <input type="text" name="lastName" placeholder="Last Name" value={teacherFormData.lastName} onChange={handleTeacherChange} />
                    <select name="gender" value={teacherFormData.gender} onChange={handleTeacherChange}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                    <input type="date" name="dob" placeholder="Date of Birth" value={teacherFormData.dob} onChange={handleTeacherChange} />
                    <select name="bloodGroup" value={teacherFormData.bloodGroup} onChange={handleTeacherChange}>
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="B+">B+</option>
                        {/* Add more blood groups */}
                    </select>
                    <select name="religion" value={teacherFormData.religion} onChange={handleTeacherChange}>
                        <option value="">Select Religion</option>
                        <option value="Islam">Islam</option>
                        <option value="Christianity">Christianity</option>
                        {/* Add more religions */}
                    </select>
                    <input type="email" name="email" placeholder="Email" value={teacherFormData.email} onChange={handleTeacherChange} />
                    <input type="text" name="idNo" placeholder="ID No" value={teacherFormData.idNo} onChange={handleTeacherChange} />
                    <select name="class" value={teacherFormData.class} onChange={handleTeacherChange}>
                        <option value="">Select Class</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        {/* Add more classes */}
                    </select>
                    <select name="section" value={teacherFormData.section} onChange={handleTeacherChange}>
                        <option value="">Select Section</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        {/* Add more sections */}
                    </select>
                    <textarea name="shortBio" placeholder="Short Bio" value={teacherFormData.shortBio} onChange={handleTeacherChange} />
                    <input type="file" name="photo" />
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};

export default RegistrarDashboard;