const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
const { getDB } = require('../models/db');

// Реєстрація користувача
router.post('/register', async (req, res) => {
    try {
        const db = getDB();
        const { name, email, password, phone, role } = req.body;

        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email вже зайнятий" });
        }

        const newUser = {
            name,
            email,
            password: `hashed_${password}`,
            phone,
            role: role || "viewer",
            createdAt: new Date()
        };

        const result = await db.collection('users').insertOne(newUser);

        res.status(201).json({
            user_id: result.insertedId,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Вхід у систему
router.post('/login', async (req, res) => {
    try {
        const db = getDB();
        const { email, password } = req.body;

        const user = await db.collection('users').findOne({
            email,
            password: `hashed_${password}`
        });

        if (!user) {
            return res.status(401).json({ error: "Невірний email або пароль" });
        }

        res.json({
            token: `JWT-TOKEN-FOR-USER-${user._id}`,
            user_id: user._id,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отримати користувача за ID
router.get('/:user_id', async (req, res) => {
    try {
        const db = getDB();
        const userId = new ObjectId(req.params.user_id);
        const user = await db.collection('users').findOne({ _id: userId });

        if (!user) {
            return res.status(404).json({ error: "Користувача не знайдено" });
        }

        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Отримати всіх користувачів
router.get('/', async (req, res) => {
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