const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { getDB } = require('../models/db');

// Отримати всі зони
router.get('/', async (req, res) => {
    try {
        const db = getDB();
        const zones = await db.collection('zones').find({}).toArray();
        res.json(zones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отримати зону за ID
router.get('/:zone_id', async (req, res) => {
    try {
        const db = getDB();
        const zoneId = new ObjectId(req.params.zone_id);
        const zone = await db.collection('zones').findOne({ _id: zoneId });

        if (!zone) {
            return res.status(404).json({ error: "Зону не знайдено" });
        }

        res.json(zone);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Створити нову зону
router.post('/', async (req, res) => {
    try {
        const db = getDB();
        const { name, cropType, areaM2, location, ownerId, optimalParams } = req.body;

        const newZone = {
            name,
            cropType,
            areaM2,
            location,
            ownerId: new ObjectId(ownerId),
            optimalParams
        };

        const result = await db.collection('zones').insertOne(newZone);
        res.status(201).json({ zone_id: result.insertedId, ...newZone });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Оновити зону
router.put('/:zone_id', async (req, res) => {
    try {
        const db = getDB();
        const zoneId = new ObjectId(req.params.zone_id);
        const updateData = { ...req.body };

        if (updateData.ownerId) {
            updateData.ownerId = new ObjectId(updateData.ownerId);
        }

        const result = await db.collection('zones').findOneAndUpdate(
            { _id: zoneId },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result.value) {
            return res.status(404).json({ error: "Зону не знайдено" });
        }

        res.json(result.value);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Видалити зону
router.delete('/:zone_id', async (req, res) => {
    try {
        const db = getDB();
        const zoneId = new ObjectId(req.params.zone_id);
        const result = await db.collection('zones').deleteOne({ _id: zoneId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Зону не знайдено" });
        }

        res.json({ message: "Зону видалено успішно" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module
    .exports = router;