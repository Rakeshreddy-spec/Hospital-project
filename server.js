const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ✅ FIX: Root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.log("❌ DB Error:", err));

// ================= SCHEMAS =================
const appointmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: String
});

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
const User = mongoose.model("User", userSchema);

// ================= APPOINTMENTS =================

// CREATE
app.post("/appointment", async (req, res) => {
    try {
        const data = new Appointment(req.body);
        await data.save();
        res.json({ message: "Saved" });
    } catch {
        res.status(500).json({ error: "Error saving" });
    }
});

// READ
app.get("/appointments", async (req, res) => {
    try {
        const data = await Appointment.find();
        res.json(data);
    } catch {
        res.status(500).json({ error: "Error fetching" });
    }
});

// DELETE
app.delete("/appointment/:id", async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.send("Deleted");
    } catch {
        res.status(500).json({ error: "Delete failed" });
    }
});

// ================= AUTH =================

// REGISTER
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hash
    });

    await user.save();

    res.send("User Registered");
});

// LOGIN
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) return res.json({ success: false });

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// ================= SERVER =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
});