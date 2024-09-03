import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import usersRouter from './controllers/users.js';

const app = express();

const ff= 12

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json()); 


// Add routes here
app.use('/api/users', usersRouter)

export default app;