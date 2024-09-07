import axios from 'axios';
import { setUser } from '../context/AppContext';

/**
 * Sets the authentication data in localStorage and axios headers
 * @function
 * @param {Object|null} data - The authentication data
 * @param {string} data.token - The JWT token
 * @param {string} data.username - The username
 */
export const setAuthData = (data) => {
  if (data && data.token && data.username) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    localStorage.setItem('authData', JSON.stringify(data));
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('authData');
  }
};

/**
 * Retrieves the authentication data from localStorage
 * @function
 * @returns {Object|null} The authentication data or null if not found
 */
export const getAuthData = () => {
  const authData = localStorage.getItem('authData');
  return authData ? JSON.parse(authData) : null;
};

/**
 * Checks the authentication status and updates the app state
 * @async
 * @function
 * @param {Function} dispatch - The dispatch function from useReducer
 */
export const checkAuthStatus = async (dispatch) => {
  const authData = getAuthData();
  if (authData && authData.token) {
    setAuthData(authData);
    try {
      const response = await axios.get('/api/users/me');
      dispatch(setUser(response.data));
    } catch (error) {
      console.error('Error fetching user data:', error);
      setAuthData(null);
    }
  }
};