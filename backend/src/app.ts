import express from 'express';
import router from './routes';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
});