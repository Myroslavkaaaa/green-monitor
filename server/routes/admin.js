const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { getDB } = require('../models/db');

// Отримати журнал дій
router.get('/actions', async (req, res) => {
    try {
        const db = getDB();
        const actions = await db.collection('admin_actions')
            .find({})
            .sort({ actionTime: -1 })
            .toArray();
        res.json(actions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Додати дію
router.post('/actions', async (req, res) => {
    try {
        const db = getDB();
        const { adminId, actionType, description } = req.body;

        const newAction = {
            adminId: new ObjectId(adminId),
            actionType,
            description,
            actionTime: new Date()
        };

        const result = await db.collection('admin_actions').insertOne(newAction);
        res.status(201).json({ action_id: result.insertedId, ...newAction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отримати всі зони (адмін)
router.get('/zones', async (req, res) => {
    try {
        const db = getDB();
        const zones = await db.collection('zones').find({}).toArray();
        res.json(zones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отримати всіх користувачів (адмін)
router.get('/users', async (req, res) => {
    try {
        const db = getDB();
        const users = await db.collection('users')
            .find({}, { projection: { password: 0 } })
            .toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module
    .exports = router;