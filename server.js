require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const { connectDB, getDB } = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use(express.static(__dirname, { index: false }));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

async function startServer() {
    try {
        await connectDB();

        app.locals.db = getDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(
                `AGRI-LINK running on port ${PORT}`
            );
        });

    } catch (error) {
        console.error(
            "Server startup failed:",
            error.message
        );

        process.exit(1);
    }
}

startServer();
