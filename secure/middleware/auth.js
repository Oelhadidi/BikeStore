const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret_key = process.env.SECRET_KEY; // Same as in login route

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Access denied, token missing!' });
    }

    try {
        const decoded = jwt.verify(token, secret_key);
        req.user = decoded; // Add decoded data to the request object
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token!' });
    }
};
