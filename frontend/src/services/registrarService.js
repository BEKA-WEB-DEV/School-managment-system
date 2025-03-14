import  useApi  from '../hooks/useApi';

export const registrarService = () => {
  const api = useApi();

  return {
    // Student Management
    // registerStudent: async (formData) => {
    //   try {
    //     const data = new FormData();
        
    //     // Append student data
    //     data.append('first_name', formData.student.first_name);
    //     data.append('last_name', formData.student.last_name);
    //     data.append('gender', formData.student.gender);
    //     data.append('date_of_birth', formData.student.date_of_birth);
    //     data.append('email', formData.student.email);
    //     data.append('address', formData.student.address);
        
    //     // Append parent data
    //     data.append('father_first_name', formData.parent.father_first_name);
    //     data.append('father_last_name', formData.parent.father_last_name);
    //     data.append('relationship', formData.parent.relationship);
        
    //     // Append file if exists
    //     if (formData.student.photo) {
    //       data.append('photo', formData.student.photo);
    //     }

    //     const response = await api.post('/registrar/students', data, {
    //       headers: {
    //         'Content-Type': 'multipart/form-data'
    //       }
    //     });

    //     return response.data;
    //   } catch (err) {
    //     throw new Error(err.response?.data?.message || 'Failed to register student');
    //   }
    // }, 

    registerStudent: async (studentData) => {
      return api.post('/registrar/students', studentData);
    },
    getStudents: async (params) => {
      return api.get('/registrar/students', { params });
    },
    updateStudent: async (id, data) => {
      return api.patch(`/registrar/students/${id}`, data);
    },
    deleteStudent: async (id) => {
      return api.delete(`/registrar/students/${id}`);
    },

    // Parent Management
    //POST    /parents            # Create parent
    //GET     /parents/:parentId  # Get parent details
    //GET     /parents/:parentId/children # Get parent's children
    //PATCH   /parents/:parentId  # Update parent

    registerParent: async (parentData) => {
      return api.post('/registrar/parents', parentData);
    },
    
    getParentById: async (id) => {
      return api.get(`/registrar/parents/${id}`);
    },
    getParentChildren: async (id) => {
      return api.get(`/registrar/parents/${id}/children`);
    },
    updateParent: async (id, data) => {
      return api.patch(`/registrar/parents/${id}`, data);
    },


    // Teacher Management
    registerTeacher: async (teacherData) => {
      return api.post('/registrar/teachers', teacherData);
    },
    getTeachers: async () => {
      return api.get('/registrar/teachers');
    },
    updateTeacher: async (id, data) => {
      return api.patch(`/registrar/teachers/${id}`, data);
    },
    deleteTeacher: async (id) => {
      return api.delete(`/registrar/teachers/${id}`);
    },
  };
};