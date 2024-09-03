import { Router } from 'express';
import Transcription from '../models/Transcription.js';
import User from '../models/User.js';

const transcriptionsRouter = Router();

transcriptionsRouter.post('/', async (request, response) => {
    const { userId, text, audioFileUrl, language } = request.body;

    try {
        const userFound = await User.findById(userId);

        if (!userFound) {
            return response.status(404).json({ error: 'User not found' });
        }

        const transcription = new Transcription({
            userId,
            text,
            audioFileUrl,
            language
        });

        const savedTranscription = await transcription.save();
        userFound.transcriptions = userFound.transcriptions.concat(savedTranscription._id);
        await userFound.save();

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