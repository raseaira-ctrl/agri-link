const jwt = require("jsonwebtoken");

const { findUserById } = require("../models/userModel");

async function protect(req, res, next) {
    try {
        const token = req.cookies.agriToken;

        if (!token) {
            return res.status(401).json({
                message: "Please login first."
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await findUserById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: "Account not found."
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired session."
        });
    }
}

function buyerOnly(req, res, next) {
    if (req.user.role !== "buyer") {
        return res.status(403).json({
            message: "Buyer access only."
        });
    }

    next();
}

function sellerOnly(req, res, next) {
    if (
        req.user.role !== "seller" ||
        req.user.sellerApproved !== true
    ) {
        return res.status(403).json({
            message: "Approved seller account required."
        });
    }

    next();
}

module.exports = {
    protect,
    buyerOnly,
    sellerOnly
};