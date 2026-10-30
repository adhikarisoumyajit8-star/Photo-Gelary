const express = require('express');
const mongoose = require('mongoose');
const mockDb = require('../config/mockDb');
const { requireAuth } = require('../middleware/auth');
const { hashPassword, verifyPassword, createToken } = require('../utils/auth');

const router = express.Router();
const User = require('../models/User');
const isMongoDBConnected = () => mongoose.connection.readyState === 1;
const normalizeUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
});

router.post('/register', async (req, res) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      return res.status(400).json({ message: 'Enter your name, a valid email, and a password with at least 8 characters' });
    }

    const existingUser = isMongoDBConnected()
      ? await User.findOne({ email })
      : mockDb.findUserByEmail(email);
    if (existingUser) return res.status(409).json({ message: 'An account with this email already exists' });

    const userData = { name, email, passwordHash: await hashPassword(password), role: 'user' };
    const user = isMongoDBConnected() ? await User.create(userData) : mockDb.createUser(userData);
    const safeUser = normalizeUser(user);
    res.status(201).json({ token: createToken(safeUser), user: safeUser });
  } catch (error) {
    res.status(500).json({ message: 'Could not create account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    const requestedRole = req.body.role;
    if (requestedRole && !['user', 'admin'].includes(requestedRole)) {
      return res.status(400).json({ message: 'Choose a valid account type' });
    }
    const user = isMongoDBConnected()
      ? await User.findOne({ email })
      : mockDb.findUserByEmail(email);

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }
    if (requestedRole && user.role !== requestedRole) {
      return res.status(403).json({ message: `This account does not have ${requestedRole} access` });
    }

    const safeUser = normalizeUser(user);
    res.json({ token: createToken(safeUser), user: safeUser });
  } catch (error) {
    res.status(500).json({ message: 'Could not sign in' });
  }
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: { id: req.user.id, name: req.user.name, email: req.user.email, role: req.user.role } });
});

const ensureAdminAccount = async () => {
  const email = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  if (!email && !password) return;
  if (!email || password.length < 8) {
    throw new Error('Set both ADMIN_EMAIL and ADMIN_PASSWORD (at least 8 characters) to enable the admin account');
  }

  const existingUser = isMongoDBConnected()
    ? await User.findOne({ email })
    : mockDb.findUserByEmail(email);

  if (existingUser) {
    if (isMongoDBConnected()) {
      existingUser.role = 'admin';
      existingUser.passwordHash = await hashPassword(password);
      await existingUser.save();
    } else {
      mockDb.updateUser(email, { role: 'admin', passwordHash: await hashPassword(password) });
    }
    return;
  }

  const adminData = { name: 'Administrator', email, passwordHash: await hashPassword(password), role: 'admin' };
  if (isMongoDBConnected()) await User.create(adminData);
  else mockDb.createUser(adminData);
};

module.exports = { router, ensureAdminAccount };