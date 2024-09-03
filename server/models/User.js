import mongoose from 'mongoose';

/**
 * User Schema
 * @typedef {Object} User
 * @property {string} username - The user's unique username
 * @property {string} email - The user's unique email address
 * @property {string} passwordHash - Hashed password for user authentication
 * @property {Array<mongoose.Schema.Types.ObjectId>} transcriptions - Array of references to associated Transcription documents
 */

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    passwordHash: String,
    transcriptions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transcription'
        }
    ]
})

/**
 * Transform the user document for JSON serialization
 * Removes sensitive and unnecessary fields
 */
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      // the passwordHash should not be revealed
      delete returnedObject.passwordHash
    }
})
  
const User = mongoose.model('User', userSchema);

export default User;