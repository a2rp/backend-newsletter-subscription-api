const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

const protectAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const admin = await Admin.findById(decoded.adminId).select("-password");

        if (!admin) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }
};

module.exports = protectAdmin;
