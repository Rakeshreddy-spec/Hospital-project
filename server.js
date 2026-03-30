const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

// ✅ DATABASE CONNECTION HERE
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


// ================= APPOINTMENT APIs =================

// ➕ CREATE
app.post("/appointment", async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.json({ message: "Appointment saved successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error saving appointment" });
    }
});

// 📥 READ
app.get("/appointments", async (req, res) => {
    try {
        const data = await Appointment.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
});

// ✏️ UPDATE
app.put("/appointment/:id", async (req, res) => {
    try {
        const updated = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

// ❌ DELETE
app.delete("/appointment/:id", async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.send("Deleted");
    } catch (err) {
        res.status(500).json({ error: "Delete failed" });
    }
});


// ================= USER AUTH =================

// 🆕 REGISTER
app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            password: hashedPassword
        });

        await user.save();

        res.send("✅ User registered");
    } catch (err) {
        res.status(500).json({ error: "Registration failed" });
    }
});


// 🔐 LOGIN
app.post("/login", async (req, res) => {

    const { username, password } = req.body;

    console.log("Login input:", username, password);

    try {
        const user = await User.findOne({ username });

        console.log("User from DB:", user);

        if (!user) {
            return res.json({ success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }

    } catch (err) {
        res.status(500).json({ error: "Login error" });
    }
});
// ❌ (create-user block removed)
// ================= SERVER =================

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});