const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { rateLimit } = require("express-rate-limit");

dotenv.config();

const authRoutes = require("./routes/auth.routes");
const newsletterRoutes = require("./routes/newsletter.routes");

const allowedOrigins = (
    process.env.CLIENT_ORIGINS ||
    (process.env.NODE_ENV === "production" ? "" : "http://localhost:5173")
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
}));

app.use((req, res, next) => {
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        if (body && typeof body === "object" && !Array.isArray(body)) body = { apiUrl: req.originalUrl.split("?")[0], ...body };
        return originalJson(body);
    };
    res.on("finish", () => console.log(`[API] ${req.method} ${req.path} -> ${res.statusCode}`));
    next();
});

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: "draft-8", legacyHeaders: false, message: { message: "Too many authentication requests. Try again later." } });
const newsletterLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: "draft-8", legacyHeaders: false, message: { message: "Too many newsletter requests. Try again later." } });

app.get("/", (req, res) => res.status(200).json({ message: "Newsletter Subscription API is running" }));
app.get("/health", (req, res) => res.status(200).json({ status: "ok", database: "configured" }));
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/newsletter", newsletterLimiter, newsletterRoutes);
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.message === "Origin is not allowed by CORS") return res.status(403).json({ message: "Origin is not allowed" });
    if (error.type === "entity.too.large") return res.status(413).json({ message: "Request body is too large" });
    if (error.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON request body" });
    console.error("Unhandled request error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
