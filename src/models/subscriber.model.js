const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
        subscribed: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

module.exports = Subscriber;
