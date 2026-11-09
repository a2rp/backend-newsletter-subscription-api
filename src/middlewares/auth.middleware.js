const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Admin = require("../models/admin.model");

const protectAdmin = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
        } catch {
            return res.status(401).json({ message: "Authentication required" });
        }

        if (!decoded || typeof decoded.adminId !== "string" || !mongoose.isValidObjectId(decoded.adminId)) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const admin = await Admin.findById(decoded.adminId).select("-password");

        if (!admin) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        return next(error);
    }
};

module.exports = protectAdmin;
