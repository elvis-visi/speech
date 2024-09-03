import bcrypt from 'bcrypt';
import { Router } from 'express';
import User from '../models/User.js';

const usersRouter = Router();

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('transcriptions', { text: 1, audioFileUrl: 1, language: 1 })
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, email, password } = request.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({ error: 'Username already exists' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    email,
    passwordHash,
  });

  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

export default usersRouter;