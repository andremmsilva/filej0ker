import express from 'express';
import 'dotenv/config';
import { authRouter } from './routes/auth';

const app = express();
const PORT = process.env.EXPRESS_PORT;

app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})