import 'module-alias/register';
import express from 'express';
import router from './routes';
import cors from 'cors';

import dotenv from 'dotenv';
import errorHandler from './middleware/errorHandler';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CLIENT_URL,
}))

app.use(router);

app.use(errorHandler);

export default app;