const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { getDB } = require('../models/db');

// Отримати всі вимірювання
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const { limit } = req.query;

        let query = db.collection('readings').find({}).sort({ timestamp: -1 });

        if (limit) {
            query = query.limit(parseInt(limit));
        }

        const readings = await query.toArray();
        res.json(readings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отримати вимірювання зони
router.get('/zone/:zone_id', async (req, res) => {
    try {
        const db = getDB();
        const zoneId = new ObjectId(req.params.zone_id);
        const readings = await db.collection('readings')
            .find({ zoneId })
            .sort({ timestamp: -1 })
            .toArray();
        res.json(readings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отримати вимірювання сенсора
router.get('/sensor/:sensor_id', async (req, res) => {
    try {
        const db = getDB();
        const sensorId = new ObjectId(req.params.sensor_id);
        const readings = await db.collection('readings')
            .find({ sensorId })
            .sort({ timestamp: -1 })
            .toArray();
        res.json(readings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Додати нове вимірювання
router.post('/', async (req, res) => {
    try {
        const db = getDB();
        const { sensorId, zoneId, temperature, humidity } = req.body;

        const newReading = {
            sensorId: new ObjectId(sensorId),
            zoneId: new ObjectId(zoneId),
            temperature,
            humidity,
            timestamp: new Date()
        };

        const result = await db.collection('readings').insertOne(newReading);

        // Перевірка порогів
        const zone = await db.collection('zones').findOne({ _id: new ObjectId(zoneId) });
        if (zone) {
            const { minTemp, maxTemp, minHum, maxHum } = zone.optimalParams;

            if (temperature > maxTemp) {
                await db.collection('alerts').insertOne({
                    zoneId: new ObjectId(zoneId),
                    sensorId: new ObjectId(sensorId),
                    type: "high_temp",
                    message: `Температура перевищила ${maxTemp}°C`,
                    threshold: maxTemp,
                    value: temperature,
                    createdAt: new Date(),
                    status: "active"
                });
            }

            if (temperature < minTemp) {
                await db.collection('alerts').insertOne({
                    zoneId: new ObjectId(zoneId),
                    sensorId: new ObjectId(sensorId),
                    type: "low_temp",
                    message: `Температура нижча за ${minTemp}°C`,
                    threshold: minTemp,
                    value: temperature,
                    createdAt: new Date(),
                    status: "active"
                });
            }

            if (humidity > maxHum) {
                await db.collection('alerts').insertOne({
                    zoneId: new ObjectId(zoneId),
                    sensorId: new ObjectId(sensorId),
                    type: "high_humidity",
                    message: `Вологість перевищила ${maxHum}%`,
                    threshold: maxHum,
                    value: humidity,
                    createdAt: new Date(),
                    status: "active"
                });
            }
        }

        res.status(201).json({ reading_id: result.insertedId, ...newReading });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Статистика по зоні
router.get('/stats/zone/:zone_id', async (req, res) => {
    try {
        const db = getDB();
        const zoneId = new ObjectId(req.params.zone_id);
        const readings = await db.collection('readings').find({ zoneId }).toArray();

        if (readings.length === 0) {
            return res.status(404).json({ error: "Дані для зони не знайдено" });
        }

        const avgTemp = readings.reduce((sum, r) => sum + r.temperature, 0) / readings.length;
        const avgHum = readings.reduce((sum, r) => sum + r.humidity, 0) / readings.length;
        const maxTemp = Math.max(...readings.map(r => r.temperature));
        const minTemp = Math.min(...readings.map(r => r.temperature));

        res.json({
            zone_id: zoneId,
            totalReadings: readings.length,
            avgTemperature: parseFloat(avgTemp.toFixed(2)),
            avgHumidity: parseFloat(avgHum.toFixed(2)),
            maxTemperature: maxTemp,
            minTemperature: minTemp
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module
    .exports = router;