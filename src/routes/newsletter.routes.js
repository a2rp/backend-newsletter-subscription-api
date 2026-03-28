const express = require("express");
const {
    subscribe,
    unsubscribe,
    getSubscribers,
} = require("../controllers/newsletter.controller");
const protectAdmin = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
router.get("/subscribers", protectAdmin, getSubscribers);

module.exports = router;
