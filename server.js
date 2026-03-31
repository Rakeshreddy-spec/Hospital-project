const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

// REPLACING WITH YOUR ACTUAL CONNECTION STRING
const MONGO_URI = 'mongodb+srv://admin:<password>@cluster0.mongodb.net/hospital?retryWrites=true&w=majority'; 

// Database Connection
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Appointment Schema
const AppointmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: String,
    department: String,
    doctor: { type: String, default: "Pending" }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        res.redirect('/admin.html');
    } else {
        res.send("<script>alert('Invalid Credentials'); window.location.href='/login.html';</script>");
    }
});

app.post('/submit-appointment', async (req, res) => {
    try {
        const newAppt = new Appointment(req.body);
        await newAppt.save();
        res.send("<script>alert('Booking Successful!'); window.location.href='/';</script>");
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).send("Error saving to database");
    }
});

app.get('/api/appointments', async (req, res) => {
    try {
        const data = await Appointment.find().sort({ _id: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.put('/api/appointments/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndUpdate(req.params.id, { doctor: req.body.doctor });
        res.json({ success: true });
    } catch (err) {
        res.status(500).send("Update failed");
    }
});

app.delete('/api/appointments/:id', async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).send("Delete failed");
    }
});

app.listen(PORT, () => console.log(`🚀 Server active on port ${PORT}`));
