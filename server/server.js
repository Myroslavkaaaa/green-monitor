const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./models/db');
const config = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const usersRouter = require('./routes/users');
const zonesRouter = require('./routes/zones');
const sensorsRouter = require('./routes/sensors');
const readingsRouter = require('./routes/readings');
const alertsRouter = require('./routes/alerts');
const adminRouter = require('./routes/admin');

app.use('/api/users', usersRouter);
app.use('/api/zones', zonesRouter);
app.use('/api/sensors', sensorsRouter);
app.use('/api/readings', readingsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/admin', adminRouter);

// Головна сторінка
app.get('/', (req, res) => {
    res.json({
        message: "GreenMonitor API - Система моніторингу мікроклімату теплиць",
        version: "1.0.0",
        database: config.DB_NAME,
        endpoints: {
            users: "/api/users",
            zones: "/api/zones",
            sensors: "/api/sensors",
            readings: "/api/readings",
            alerts: "/api/alerts",
            admin: "/api/admin/actions"
        }
    });
});

// Запуск сервера
connectToDatabase().then(() => {
    app.listen(config.PORT, () => {
        console.log(`🚀 GreenMonitor API запущено на http://localhost:${config.PORT}`);
        console.log(`📡 Доступні endpoints:`);
        console.log(`   - GET  http://localhost:${config.PORT}/api/zones`);
        console.log(`   - GET  http://localhost:${config.PORT}/api/sensors`);
        console.log(`   - GET  http://localhost:${config.PORT}/api/readings`);
        console.log(`   - GET  http://localhost:${config.PORT}/api/alerts`);
    });
});