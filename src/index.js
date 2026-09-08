const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = require("./app");

const validateEnvironment = () => {
    const missing = ["MONGO_URI", "JWT_SECRET"].filter((key) => !process.env[key]);
    if (missing.length) throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    if (process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must contain at least 32 characters");
};

const startServer = async () => {
    try {
        validateEnvironment();
        await connectDB();
        const port = Number(process.env.PORT) || 1198;
        app.listen(port, () => console.log(`Server running on port ${port}`));
    } catch (error) {
        console.error(`Server startup failed: ${error.message}`);
        process.exitCode = 1;
    }
};

if (require.main === module) startServer();

module.exports = { app, startServer, validateEnvironment };
