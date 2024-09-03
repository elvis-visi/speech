const mongoose = require('mongoose');

/**
 * Transcription Schema
 * @typedef {Object} Transcription
 * @property {mongoose.Schema.Types.ObjectId} user - Reference to the User who owns this transcription
 * @property {string} text - The transcribed text content
 * @property {string} [audioFileUrl] - Optional URL to the audio file
 * @property {string} language - The language of the transcription (default: 'en-US')
 * @property {Date} createdAt - Timestamp of when the transcription was created
 * @property {Date} updatedAt - Timestamp of when the transcription was last updated
 */

const transcriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  audioFileUrl: {
    type: String,
  },
  language: {
    type: String,
    default: 'en-US',
  },
}, { timestamps: true });

/**
 * Transform the transcription document for JSON serialization
 * Converts _id to id and removes unnecessary fields
 */
transcriptionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Transcription = mongoose.model('Transcription', transcriptionSchema);

module.exports = Transcription;