import { Router } from 'express';
import Transcription from '../models/Transcription.js';
import User from '../models/User.js';

import jwt from 'jsonwebtoken'

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }

const transcriptionsRouter = Router();

transcriptionsRouter.post('/', async (request, response) => {
    const { userId, text, audioFileUrl, language } = request.body;

    try {
        const decodedToken = jwt.verify(getTokenFrom(request), process.env.JWT_SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }
        const user = await User.findById(decodedToken.id)

        if (!user) {
            return response.status(404).json({ error: 'User not found' });
        }

        const transcription = new Transcription({
            userId,
            text,
            audioFileUrl,
            language
        });

        const savedTranscription = await transcription.save();
        user.transcriptions = user.transcriptions.concat(savedTranscription._id);
        await user.save();

        response.status(201).json(savedTranscription);
    } catch (error) {
        console.error('Error saving transcription:', error);
        if (error.name === 'ValidationError') {
            return response.status(400).json({ error: error.message });
        }
        response.status(500).json({ error: 'Internal server error' });
    }
});

export default transcriptionsRouter;