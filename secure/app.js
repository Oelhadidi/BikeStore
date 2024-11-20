const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sequelize = require("./utils/database");

// Import Models
const User = require("./models/user");
const Product = require("./models/product");

// Express App Setup
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const pageRoutes = require('./routes/pages');

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use('/pages', pageRoutes);

// Database Synchronization and Server Start
sequelize
    .sync()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server running at http://localhost:3000");
        });
    })
    .catch((err) => console.error("Database sync failed:", err));
