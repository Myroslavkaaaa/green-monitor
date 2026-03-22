const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { getDB } = require('../models/db');

// Отримати всі сенсори
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const sensors = await db.collection('sensors').find({}).toArray();
        res.json(sensors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отримати сенсор за ID
router.get('/:sensor_id', async (req, res) => {
    try {
        const db = getDB();
        const sensorId = new ObjectId(req.params.sensor_id);
        const sensor = await db.collection('sensors').findOne({ _id: sensorId });

        if (!sensor) {
            return res.status(404).json({ error: "Сенсор не знайдено" });
        }

        res.json(sensor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отримати сенсори зони
router.get('/zone/:zone_id', async (req, res) => {
    try {
        const db = getDB();
        const zoneId = new ObjectId(req.params.zone_id);
        const sensors = await db.collection('sensors').find({ zoneId }).toArray();
        res.json(sensors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Додати новий сенсор
router.post('/', async (req, res) => {
    try {
        const db = getDB();
        const { name, zoneId, type, macAddress, isActive } = req.body;

        const newSensor = {
            name,
            zoneId: new ObjectId(zoneId),
            type,
            macAddress,
            installedAt: new Date(),
            isActive: isActive !== undefined ? isActive : true
        };

        const result = await db.collection('sensors').insertOne(newSensor);
        res.status(201).json({ sensor_id: result.insertedId, ...newSensor });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Оновити статус сенсора
router.patch('/:sensor_id', async (req, res) => {
    try {
        const db = getDB();
        const sensorId = new ObjectId(req.params.sensor_id);

        const result = await db.collection('sensors').findOneAndUpdate(
            { _id: sensorId },
            { $set: req.body },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            return res.status(404).json({ error: "Сенсор не знайдено" });
        }

        res.json(result.value);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module
    .exports = router;