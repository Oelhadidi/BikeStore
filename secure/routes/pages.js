const express = require('express');
const path = require('path');
const router = express.Router();

// Serve HTML pages
router.get('/login', (req, res) => res.sendFile(path.join(__dirname, '../public/pages/login.html')));
router.get('/register', (req, res) => res.sendFile(path.join(__dirname, '../public/pages/register.html')));
router.get('/products', (req, res) => res.sendFile(path.join(__dirname, '../public/pages/products.html')));
router.get('/edit-product/:id', (req, res) => res.sendFile(path.join(__dirname, '../public/pages/edit-product.html')));
router.get('/add-product', (req, res) => res.sendFile(path.join(__dirname, '../public/pages/add-product.html')));

module.exports = router;
