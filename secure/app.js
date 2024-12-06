const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const sequelize = require("./utils/database");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");

// Import Models
const User = require("./models/user");
const Product = require("./models/product");

// Express App Setup
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser()); // Nécessaire pour la gestion des cookies

// Middleware CSRF
const csrfProtection = csurf({ cookie: true });

// Routes
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const pageRoutes = require('./routes/pages');
const csrfRoutes = require('./routes/csrf');

// Ajouter le middleware CSRF globalement ou pour des routes spécifiques
app.use("/auth/register", csrfProtection);
app.use("/products/", csrfProtection);

// Middleware pour injecter le token CSRF dans les réponses
app.use((req, res, next) => {
    if (req.csrfToken) {
        // Ajouter le token CSRF pour que le frontend puisse l'utiliser
        res.locals.csrfToken = req.csrfToken();
    }
    next();
});

// Ajouter un middleware pour gérer les erreurs CSRF
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).json({ error: "Invalid CSRF token" });
    }
    if (req.csrfToken) {
        console.log("Received token:", req.get('CSRF-Token'));  // Voir le token reçu
        console.log("Expected token:", req.csrfToken()); 
        res.locals.csrfToken = req.csrfToken(); // Injecte le token dans les templates
    }
    next(err);
});

// Définir les routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use('/pages', pageRoutes);
app.use('/', csrfRoutes);

// Database Synchronization and Server Start
sequelize
    .sync()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server running at http://localhost:3000");
        });
    })
    .catch((err) => console.error("Database sync failed:", err));
