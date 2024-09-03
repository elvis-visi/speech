import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import usersRouter from './controllers/users.js';
import transcriptionsRouter from './controllers/transcriptions.js';
import loginRouter from './controllers/login.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json()); 


// Add routes here
app.use('/api/users', usersRouter)
app.use('/api/transcriptions',transcriptionsRouter)
app.use('/api/login',loginRouter)

export default app;