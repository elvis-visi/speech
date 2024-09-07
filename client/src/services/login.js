import axios from 'axios'
import { setAuthData } from './auth'

/**
 * Base url for login API endpoint
 * @constant {string}
 */
const baseURL = '/api/login'

/**
 * Attempts to log in a user with the provided credentials
 * @async
 * @function login
 * @param {Object} credentials - The user's login credentials
 * @param {string} credentials.username - The user's username
 * @param {string} credentials.password - The user's password
 * @returns {Promise<Object>} The user data returned from the server
 * @throws {Error} If the login request fails
 */
export const login = async credentials => {
    try {
        const response = await axios.post(baseURL, credentials)
        if (response.data.token && response.data.username) {
            console.log("response data ",response.data)
            setAuthData(response.data)
        }
        return response.data
    } catch (error) {
        console.error('Login error:', error.response ? error.response.data : error.message)
        throw error
    }
}

/**
 * Logs out the current user by clearing the authentication data
 * @function logout
 */
export const logout = () => {
    setAuthData(null)
}
