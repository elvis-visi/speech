import { Router } from 'express';
import Transcription from '../models/Transcription.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { getUser } from '../utils/middleware.js'

const transcriptionsRouter = Router();

transcriptionsRouter.post('/', getUser, async (request, response, next) => {
    const { text, audioFileUrl, language } = request.body;

    try {
        
        const user = request.user

        if (!user) {
            return response.status(404).json({ error: 'User not found' });
        }

        const transcription = new Transcription({
            userId: user.id,
            text,
            audioFileUrl,
            language
        });

        const savedTranscription = await transcription.save();
        user.transcriptions = user.transcriptions.concat(savedTranscription._id);
        await user.save();

        response.status(201).json(savedTranscription);
    } catch (exception) {
        next(exception)
    }
});

transcriptionsRouter.get('/', async (request, response) => {
    try {
        const transcriptions = await Transcription.find({})
            .populate('userId', { username: 1 });
        response.json(transcriptions);
    } catch (error) {
        console.error('Error fetching transcriptions:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
});

export default transcriptionsRouter;