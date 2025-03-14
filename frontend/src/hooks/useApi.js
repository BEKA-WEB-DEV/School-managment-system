// import { useCallback } from 'react';

// const useApi = () => {
//   const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

//   const fetchApi = useCallback(async (url, options = {}) => {
//     try {
//       const fullUrl = `${baseURL}${url}`;
      
//       const headers = {
//         'Content-Type': 'application/json',
//         ...options.headers,
//       };

//       const response = await fetch(fullUrl, {
//         ...options,
//         headers,
//         credentials: 'include',
//         body: options.body ? JSON.stringify(options.body) : null,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Authentication failed');
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('API Error:', error.message);
//       throw error;
//     }
//   }, [baseURL]);

//   const get = useCallback((url, params) => {
//     const query = new URLSearchParams(params).toString();
//     return fetchApi(`${url}${query ? `?${query}` : ''}`, { method: 'GET' });
//   }, [fetchApi]);

//   const post = useCallback((url, body) => {
//     return fetchApi(url, { method: 'POST', body });
//   }, [fetchApi]);

//   const patch = useCallback((url, body) => {
//     return fetchApi(url, { method: 'PATCH', body });
//   }, [fetchApi]);

//   const del = useCallback((url) => {
//     return fetchApi(url, { method: 'DELETE' });
//   }, [fetchApi]);

//   return { get, post, patch, del };
// };

// export default useApi;



// import { useCallback } from 'react';

// const useApi = () => {
//   const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

//   const fetchApi = async (url, options = {}) => {
//     try {
//       const response = await fetch(`${baseURL}${url}`, {
//         ...options,
//         credentials: 'include',
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Request failed');
//       }

//       return response.json();
//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   };

//   const get = useCallback((url, params) => {
//     const query = new URLSearchParams(params).toString();
//     return fetchApi(`${url}${query ? `?${query}` : ''}`, { method: 'GET' });
//   }, []);

//   const post = useCallback((url, body, headers = {}) => {
//     return fetchApi(url, { 
//       method: 'POST', 
//       body: JSON.stringify(body),
//       headers: { 
//         'Content-Type': 'application/json',
//         ...headers,
//       },
//     });
//   }, []);

//   const patch = useCallback((url, body) => {
//     return fetchApi(url, { 
//       method: 'PATCH', 
//       body: JSON.stringify(body),
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }, []);

//   const del = useCallback((url) => {
//     return fetchApi(url, { method: 'DELETE' });
//   }, []);

//   return { get, post, patch, del };
// };

// export default useApi;


// hooks/useApi.js
import { useCallback } from 'react';
import { useAuth } from './useAuth';

const useApi = () => {
  const { user } = useAuth(); // Get user from auth context
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  const fetchApi = useCallback(async (url, options = {}) => {
    try {
      const fullUrl = `${baseURL}${url}`;
      
      // Add Authorization header if user is authenticated
      const headers = {
        'Content-Type': 'application/json',
        ...(user?.token && { Authorization: `Bearer ${user.token}` }), // Add token if available
        ...options.headers,
      };

      const response = await fetch(fullUrl, {
        ...options,
        headers,
        credentials: 'include',
        body: options.body ? JSON.stringify(options.body) : null,
      });

      // Handle token expiration
      if (response.status === 401) {
        // Attempt to refresh the token
        const refreshResponse = await fetch(`${baseURL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          const { token: newToken } = await refreshResponse.json();
          // Update token in auth context (assuming your useAuth hook has a setToken method)
          // setToken(newToken); // Uncomment if you have a setToken method
          headers.Authorization = `Bearer ${newToken}`; // Update headers
          return fetchApi(url, options); // Retry the original request
        } else {
          throw new Error('Session expired. Please log in again.');
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error.message);
      throw error;
    }
  }, [baseURL, user?.token]); // Add user.token as a dependency

  const get = useCallback((url, params) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`${url}${query ? `?${query}` : ''}`, { method: 'GET' });
  }, [fetchApi]);

  const post = useCallback((url, body) => {
    return fetchApi(url, { method: 'POST', body });
  }, [fetchApi]);

  const patch = useCallback((url, body) => {
    return fetchApi(url, { method: 'PATCH', body });
  }, [fetchApi]);

  const del = useCallback((url) => {
    return fetchApi(url, { method: 'DELETE' });
  }, [fetchApi]);

  return { get, post, patch, del };
};

export default useApi;