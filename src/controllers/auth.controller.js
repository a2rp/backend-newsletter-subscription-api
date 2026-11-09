const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const { cookieOptions, clearCookieOptions } = require("../utils/cookieOptions");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const generateToken = (adminId) => jwt.sign({ adminId }, process.env.JWT_SECRET, { expiresIn: "7d", algorithm: "HS256" });
const publicAdmin = (admin) => ({ _id: admin._id, name: admin.name, email: admin.email });

const validate = ({ name, email, password }, registration = false) => {
    if (registration && (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100)) {
        return "Name must contain at least 2 characters and no more than 100";
    }
    if (typeof email !== "string" || email.trim().length > 254 || !emailPattern.test(email.trim())) {
        return "A valid email is required";
    }
    if (typeof password !== "string" || [...password].length < 8 || Buffer.byteLength(password, "utf8") > 72) {
        return "Password must contain at least 8 characters and no more than 72 UTF-8 bytes";
    }
    return null;
};

const setAuthCookie = (res, admin) => res.cookie("token", generateToken(admin._id), cookieOptions);

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        const validationError = validate({ name, email, password }, true);
        if (validationError) return res.status(422).json({ message: validationError });
        if (process.env.ADMIN_REGISTRATION_SECRET && req.get("x-admin-registration-secret") !== process.env.ADMIN_REGISTRATION_SECRET) {
            return res.status(403).json({ message: "Admin registration is not permitted" });
        }
        if (await Admin.exists({})) {
            return res.status(409).json({ message: "Admin registration is closed after the initial setup" });
        }
        const normalizedEmail = email.trim().toLowerCase();
        if (await Admin.findOne({ email: normalizedEmail })) return res.status(409).json({ message: "Admin already exists" });
        const admin = await Admin.create({ name: name.trim(), email: normalizedEmail, password });
        setAuthCookie(res, admin);
        return res.status(201).json({ message: "Admin registered successfully", admin: publicAdmin(admin) });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: "Admin already exists" });
        console.error("Admin registration failed:", error);
        return res.status(500).json({ message: "Admin registration failed" });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        const validationError = validate({ email, password });
        if (validationError) return res.status(422).json({ message: validationError });
        const admin = await Admin.findOne({ email: email.trim().toLowerCase() }).select("+password");
        if (!admin || !(await admin.comparePassword(password))) return res.status(401).json({ message: "Invalid credentials" });
        setAuthCookie(res, admin);
        return res.status(200).json({ message: "Admin login successful", admin: publicAdmin(admin) });
    } catch (error) {
        console.error("Admin login failed:", error);
        return res.status(500).json({ message: "Admin login failed" });
    }
};

const logoutAdmin = (req, res) => {
    res.clearCookie("token", clearCookieOptions);
    return res.status(200).json({ message: "Admin logout successful" });
};

module.exports = { registerAdmin, loginAdmin, logoutAdmin };
