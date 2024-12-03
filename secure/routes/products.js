const express = require("express");
const Product = require("../models/product");
const path = require('path');
const axios = require("axios");
const fs = require('fs');
const Joi = require("joi");
const validator = require('validator');
const isBase64 = require('is-base64');



// const auth = require("../middleware/auth");
const router = express.Router();

const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().positive().required(),
    imageUrl: Joi.string().uri().required(), // Valider que c'est une URL valide
});



// Get all products
router.get("/", async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
});

const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};


router.post('/', async (req, res) => {
    // const { name, description, price, imageUrl } = req.body;
    const { name, description, price, imageUrl } = req.body;

    // Validation des données utilisateur
    const { error } = productSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const sanitizedData = {
            name: escapeHtml(name),
            description: escapeHtml(description),
            price,
            imageUrl, // Optionally validate the URL with a library
        };

        const newProduct = await Product.create(sanitizedData);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error processing product:", error);
        res.status(500).json({ error: "Error adding product" });
    }
});

// Admin: Edit a product
router.put('/products/:id', async (req, res) => {
    // if (req.user.role !== 'admin') {
    //     return res.status(403).json({ message: 'You do not have permission to edit products' });
    // }

    const { id } = req.params;
    const { name, description, price, imageUrl } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.name = name;
        product.description = description;
        product.price = price;
        product.imageUrl = imageUrl;

        await product.save();

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
});


router.delete('/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // Find the product by id
        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete the product
        await product.destroy();

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    try {
        const { name, description, price, imageUrl } = req.body;
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.name = name;
        product.description = description;
        product.price = price;
        product.imageUrl = imageUrl;
        await product.save();

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
});

module.exports = router;
