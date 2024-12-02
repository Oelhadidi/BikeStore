const express = require("express");
const Product = require("../models/product");
const router = express.Router();

// Middleware pour vérifier le token CSRF
const csrfProtection = require("csurf")({ cookie: true });

// Get all products (aucune modification des données, pas besoin de CSRF ici)
router.get("/", async (req, res) => {
    const products = await Product.findAll();
    res.json(products);
});

// Get product by ID (aucune modification des données, pas besoin de CSRF ici)
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

// Ajouter un produit (protégé par CSRF)
router.post("/", csrfProtection, async (req, res) => {
    const { name, description, price, imageUrl } = req.body;

    try {
        const newProduct = await Product.create({ name, description, price, imageUrl });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Error adding product" });
    }
});

// Modifier un produit (protégé par CSRF)
router.put("/:id", csrfProtection, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, imageUrl } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.name = name;
        product.description = description;
        product.price = price;
        product.imageUrl = imageUrl;

        await product.save();
        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
});

// Supprimer un produit (protégé par CSRF)
router.delete("/:id", csrfProtection, async (req, res) => {
    const productId = req.params.id;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.destroy();
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
});

module.exports = router;
