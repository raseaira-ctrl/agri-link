const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    createUser,
    findUserByEmail
} = require("../models/userModel");

function createToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
}

function setTokenCookie(res, token) {
    res.cookie("agriToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000
    });
}

async function register(req, res) {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Please complete all required fields."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters."
            });
        }

        if (!["buyer", "seller"].includes(role)) {
            return res.status(400).json({
                message: "Invalid account type."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await findUserByEmail(normalizedEmail);

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await createUser({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role,
            sellerApproved: role === "buyer",
            createdAt: new Date()
        });

        res.status(201).json({
            message: role === "seller"
                ? "Seller account created. Waiting for approval."
                : "Buyer account successfully created.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerApproved: user.sellerApproved
            }
        });

    } catch (error) {
        console.error("Register error:", error.message);

        res.status(500).json({
            message: "Unable to register account."
        });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const user = await findUserByEmail(
            email.trim().toLowerCase()
        );

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = createToken(user);

        setTokenCookie(res, token);

        res.json({
            message: "Login successful!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                sellerApproved: user.sellerApproved
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Unable to login."
        });
    }
}

function logout(req, res) {
    res.clearCookie("agriToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
    });

    res.json({
        message: "Successfully logged out."
    });
}

module.exports = {
    register,
    login,
    logout
};