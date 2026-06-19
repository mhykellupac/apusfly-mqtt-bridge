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

// publish endpoint
app.post("/publish", (req, res) => {
    try {
        const { topic, message } = req.body;

        client.publish(topic, message, { qos: 0 }, (err) => {
            if (err) {
                console.log("MQTT error:", err);
                return res.status(500).json({ success: false });
            }

            console.log("MQTT SENT:", message);

            return res.json({ success: true });
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

app.listen(3001, () => {
    console.log("MQTT Bridge running on port 3001");
});