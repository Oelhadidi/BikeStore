const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const csurf = require("csurf");
const router = express.Router();
const axios = require("axios");
require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

const csrfProtection = csurf({ cookie: true }); // CSRF middleware using cookies
const secret_key = process.env.SECRET_KEY;
const recaptcha_secret_key = process.env.RECAPTCHA_SECRET_KEY;

// Handle login POST (CSRF not required for login as it doesn't change state)
router.post('/login', async (req, res) => {
    const { email, password, recaptchaToken } = req.body;

    try {
        // Step 1: Validate reCAPTCHA token
        const recaptchaResponse = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: recaptcha_secret_key,
                    response: recaptchaToken,
                },
            }
        );

        console.log('reCAPTCHA Response:', recaptchaResponse.data);
        console.log("recaptchaToken : ", recaptchaToken);

        // Check if reCAPTCHA is valid and score is sufficient
        if (!recaptchaResponse.data.success || recaptchaResponse.data.score < 0.5) {
            return res.status(400).json({ message: 'reCAPTCHA validation failed. Suspicious activity detected.' });
        }

        // Step 2: Find user in the database by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials. User not found.' });
        }

        // Step 3: Compare provided password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials :p' });
        }

        // Step 4: Generate JWT if login succeeds
        const token = jwt.sign({ id: user.id, email: user.email }, secret_key, { expiresIn: '1h' });

        const { id, username, email: userEmail, role } = user;
        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { id, username, email: userEmail, role }
        });
    } catch (error) {
        console.error('Login Error:', error);
        return res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});


// Handle Register POST (CSRF protection added)
router.post('/register', csrfProtection, async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);// Hash the password before saving

        const newUser = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
});


// Edit User Profile (without CSRF protection to be able to use on Postman)
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
