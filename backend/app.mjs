import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.mjs";
import routes from './routes/index.mjs';
import  scheduleDailyEmail  from './cron/node_schedule.mjs'

const app = express();

app.use(express.json());


const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
// Configure CORS options
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests with no origin (e.g., mobile apps, Postman) or a valid origin
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
};

// Apply CORS middleware
app.use(cors(corsOptions));

connectDB();

app.use('/api', routes);
scheduleDailyEmail();

export default app;