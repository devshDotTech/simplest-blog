import express from 'express';
import cors from 'cors';
import router from './routes/blogs';
import admin from './routes/admin';
import dotenv from 'dotenv';

//dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use('/api', router);
app.use('/api', admin);

app.listen(port, () => {
  console.log(`[server]: listening at port: ${port}`)
})

