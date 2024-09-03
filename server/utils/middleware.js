import jwt from 'jsonwebtoken'
import User from '../models/User.js'


/**
 * Logs details of incoming requests.
 * @function requestLogger
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {Function} next - Express next middleware function
 */
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
      }
  
 /**
 * Extracts the token from the Authorization header.
 * @function getTokenFrom
 * @param {Object} request - Express request object
 * @returns {string|null} The extracted token or null if not found
 */ 
const getTokenFrom = request => {
    const authorization = request.get('authorization') // bearer token
    
    if (authorization && authorization.startsWith('Bearer')) {
        return authorization.substring(7)
    }
    return null
}

/**
 * Authenticates the user based on the provided token.
 * @function getUser
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {Function} next - Express next middleware function
 * @throws {jwt.JsonWebTokenError} If token is not provided or invalid
 */
const getUser = async (request, response, next) => {
    
    try {
        const token = getTokenFrom(request)  

        if (!token) {
            return next(new jwt.JsonWebTokenError('token not provided'))
        }

       const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({error: 'token invalid'})
        }

        const user = await User.findById(decodedToken.id)
        if (!user) {
            return response.status(404).json({error: 'user not found'})
        }

        request.user = user
        next()
    } catch (error) {
        next(error)
    }
}

  /**
 * Handles various types of errors and sends appropriate responses.
 * @function errorHandler
 * @param {Error} error - The error object
 * @param {Object} request - Express request object
 * @param {Object} response - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    } 
    else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
      return response.status(400).json({ error: 'expected `username` to be unique' })
    }else if (error.name ===  'JsonWebTokenError') {
      return response.status(401).json({ error: 'token invalid' })
    }else if (error.name === 'TokenExpiredError') {
      return response.status(401).json({
        error: 'token expired'
      })
    }
  
    next(error)
}
  
export {
    requestLogger, errorHandler, getUser, getTokenFrom
}