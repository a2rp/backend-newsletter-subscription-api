const Subscriber = require("../models/subscriber.model");

const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        let subscriber = await Subscriber.findOne({ email });

        if (subscriber) {
            subscriber.subscribed = true;
            await subscriber.save();

            return res.status(200).json({
                message: "Subscribed successfully",
            });
        }

        await Subscriber.create({ email });

        return res.status(201).json({
            message: "Subscribed successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Subscription failed",
            error: error.message,
        });
    }
};

const unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
            });
        }

        const subscriber = await Subscriber.findOne({ email });

        if (!subscriber) {
            return res.status(404).json({
                message: "Subscriber not found",
            });
        }

        subscriber.subscribed = false;
        await subscriber.save();

        return res.status(200).json({
            message: "Unsubscribed successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unsubscribe failed",
            error: error.message,
        });
    }
};

const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Subscriber.find({ subscribed: true }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            message: "Subscribers fetched successfully",
            subscribers,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to fetch subscribers",
            error: error.message,
        });
    }
};

module.exports = {
    subscribe,
    unsubscribe,
    getSubscribers,
};
