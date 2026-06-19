const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MQTT connect
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

client.on("connect", () => {
    console.log("MQTT Connected ✔");
});

// 🔥 HEALTH CHECK ROUTE
app.get("/", (req, res) => {
    res.send("ApusFly MQTT Bridge is running ✔");
});

// publish endpoint (UPDATED WITH DEBUG)
app.post("/publish", (req, res) => {

    console.log("🔥 /publish HIT");
    console.log("BODY RECEIVED:", req.body);

    try {
        const { topic, message } = req.body;

        if (!topic || !message) {
            console.log("❌ Missing topic or message");

            return res.status(400).json({
                success: false,
                error: "Missing topic or message"
            });
        }

        client.publish(topic, message, { qos: 0 }, (err) => {
            if (err) {
                console.log("❌ MQTT error:", err);

                return res.status(500).json({
                    success: false,
                    error: "MQTT publish failed"
                });
            }

            console.log("📡 MQTT SENT:", message);

            return res.json({
                success: true
            });
        });

    } catch (err) {
        console.log("❌ SERVER ERROR:", err);

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// 🚨 RENDER FIX
const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
    console.log("MQTT Bridge running on port", PORT);
});