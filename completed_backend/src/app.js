const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middleware/errorHandler');
const { requestLogger } = require('./middleware/requestLogger');

const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(helmet());

// Rate limiting for auth endpoints
//const authLimiter = rateLimit({
//  windowMs: 15 * 60 * 1000, // 15 minutes
//  max: 5, // limit each IP to 5 requests per windowMs
//  message: 'Too many requests from this IP, please try again after 15 minutes',
//});
//app.use('/auth', authLimiter);
//app.use('/user/register', authLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/user', userRoutes);
app.use('/item', itemRoutes);
app.use('/transaction', transactionRoutes);
app.use('/auth', authRoutes);
app.use('/reports', reportRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found`, payload: null });
});

app.use(errorHandler);

module.exports = app;