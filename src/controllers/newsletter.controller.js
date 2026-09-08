const Subscriber = require("../models/subscriber.model");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normalizeEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");
const validateEmail = (email) => email && emailPattern.test(email);
const publicSubscriber = (subscriber) => ({
    _id: subscriber._id,
    email: subscriber.email,
    subscribed: subscriber.subscribed,
    createdAt: subscriber.createdAt,
    updatedAt: subscriber.updatedAt,
});

const subscribe = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        if (!validateEmail(email)) return res.status(422).json({ message: "A valid email is required" });
        const subscriber = await Subscriber.findOneAndUpdate(
            { email },
            { $set: { email, subscribed: true } },
            { new: true, upsert: true, setDefaultsOnInsert: true },
        );
        return res.status(200).json({ message: "Subscribed successfully", subscriber: publicSubscriber(subscriber) });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: "Email is already subscribed" });
        console.error("Subscription failed:", error.message);
        return res.status(500).json({ message: "Subscription failed" });
    }
};

const unsubscribe = async (req, res) => {
    try {
        const email = normalizeEmail(req.body.email);
        if (!validateEmail(email)) return res.status(422).json({ message: "A valid email is required" });
        const subscriber = await Subscriber.findOneAndUpdate({ email }, { $set: { subscribed: false } }, { new: true });
        if (!subscriber) return res.status(404).json({ message: "Subscriber not found" });
        return res.status(200).json({ message: "Unsubscribed successfully" });
    } catch (error) {
        console.error("Unsubscribe failed:", error.message);
        return res.status(500).json({ message: "Unsubscribe failed" });
    }
};

const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find({ subscribed: true }).sort({ createdAt: -1 }).lean();
        return res.status(200).json({ message: "Subscribers fetched successfully", subscribers: subscribers.map(publicSubscriber) });
    } catch (error) {
        console.error("Subscriber listing failed:", error.message);
        return res.status(500).json({ message: "Failed to fetch subscribers" });
    }
};

module.exports = { subscribe, unsubscribe, getSubscribers };
