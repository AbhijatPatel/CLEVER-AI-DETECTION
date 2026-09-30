import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { v4 as uuidv4 } from 'uuid';
import { config } from './config/env';
import apiRouter from './routes/api';
import { swaggerDocument } from './docs/swagger';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false // Allow Swagger UI
  })
);

// CORS
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:3000',
  'https://clever-ai.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin) || config.nodeEnv !== 'production') {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not permitted by CORS policy`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-request-id']
  })
);

// Request ID & Logging Middleware
app.use((req, res, next) => {
  const reqId = (req.headers['x-request-id'] as string) || uuidv4();
  req.headers['x-request-id'] = reqId;
  res.setHeader('x-request-id', reqId);
  next();
});

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

// Swagger Documentation
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// API v1 Routes
app.use('/api/v1', apiRouter);

// Global Error Handler
app.use(errorHandler);

export default app;
