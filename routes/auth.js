const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();
require('dotenv').config();

const secret_key = process.env.SECRET_KEY;



// Handle login POST
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, secret_key, { expiresIn: '1h' });
        const { id, username, email: userEmail, role: role } = user;

        // Send token and user data
        res.status(200).json({ message: 'Login successful', token, user: { id, username, email: userEmail , role: role } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});


// Handle Register POST
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const newUser = await User.create({ username, email, password });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token").send("Logged out");
});

// Edit User Profile
router.put('/user/:id/role', async (req, res) => {
    const { id } = req.params;  // Get user ID from URL
    const { role } = req.body;  // Get role from the request body

    // Validate the role
    if (role !== 'admin' && role !== 'user') {
        return res.status(400).json({ message: 'Invalid role. Only "admin" or "user" are allowed.' });
    }

    try {
        // Find the user by ID
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's role
        user.role = role;
        await user.save();

        // Respond with success message
        res.status(200).json({ message: `User role updated to ${role}`, user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error });
    }
});


module.exports = router;
