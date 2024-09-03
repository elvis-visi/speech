import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import usersRouter from './controllers/users.js';
import transcriptionsRouter from './controllers/transcriptions.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json()); 


// Add routes here
app.use('/api/users', usersRouter)
app.use('/api/transcriptions',transcriptionsRouter)

export default app;