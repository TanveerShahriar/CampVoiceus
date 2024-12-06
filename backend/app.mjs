import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.mjs";
import routes from './routes/index.mjs';

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use('/api', routes);

export default app;