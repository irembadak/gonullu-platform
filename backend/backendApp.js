const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middlewares/errorHandler');

const userRoutes = require("./routes/userRoutes");
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const orgRoutes = require('./routes/organizationRoutes');
const emergencyRoutes = require('./routes/emergencies');
const aiRoutes = require('./routes/ai');
const transportRoutes = require('./routes/transportRoutes');

const app = express();

app.set('trust proxy', 1);
app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000 
});
app.use(limiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/emergency', emergencyRoutes); 
app.use('/api/ai', aiRoutes);
app.use('/api/transport', transportRoutes);

app.get('/api/test', (req, res) => {
    res.json({ success: true, message: "Backend API çalışıyor!" });
});
app.use(errorHandler);

module.exports = app;