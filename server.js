const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

// FIX THIS: Ensure <password> is your DATABASE USER password
const MONGO_URI = 'mongodb+srv://admin:<password>@cluster0.mongodb.net/hospital?retryWrites=true&w=majority'; 

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ Connection Error:", err));

const Appointment = mongoose.model('Appointment', new mongoose.Schema({
    name: String,
    email: String,
    date: String,
    department: String,
    doctor: { type: String, default: "Pending" }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// --- CASE STUDY ATTACK ROUTE ---
// This simulates a remote attacker poisoning the hospital data
app.get('/poison-data', async (req, res) => {
    try {
        // Attack: Flip all medical departments to a malicious value
        await Appointment.updateMany({}, { department: "⚠️ DATA CORRUPTED" });
        res.send("<h1>Attack Successful: Federated Learning Node Poisoned!</h1>");
    } catch (err) {
        res.status(500).send("Attack failed: " + err.message);
    }
});

app.post('/submit-appointment', async (req, res) => {
    try {
        const newAppt = new Appointment(req.body);
        await newAppt.save();
        res.send("<script>alert('Booking Successful!'); window.location.href='/';</script>");
    } catch (err) {
        // This is the error you are currently seeing
        console.error(err);
        res.status(500).send("Error saving to database: " + err.message);
    }
});

app.get('/api/appointments', async (req, res) => {
    const data = await Appointment.find().sort({ _id: -1 });
    res.json(data);
});

app.listen(PORT, () => console.log(`Server on ${PORT}`));
