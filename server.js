const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;
const MONGO_URI = 'YOUR_MONGODB_CONNECTION_STRING'; // PASTE YOUR LINK HERE

// 1. Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 2. Define the Schema (How the data looks)
const AppointmentSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: String,
    department: String,
    doctor: { type: String, default: "Pending" }
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

// 3. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// 4. Routes

// Staff Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        res.redirect('/admin.html');
    } else {
        res.send("<script>alert('Invalid Credentials'); window.location.href='/login.html';</script>");
    }
});

// Create Appointment (Save to MongoDB)
app.post('/submit-appointment', async (req, res) => {
    try {
        const newAppt = new Appointment(req.body);
        await newAppt.save();
        res.send("<script>alert('Booking Successful!'); window.location.href='/';</script>");
    } catch (err) {
        res.status(500).send("Error saving to database");
    }
});

// Read Appointments (Get from MongoDB)
app.get('/api/appointments', async (req, res) => {
    const data = await Appointment.find();
    res.json(data);
});

// Update Doctor
app.put('/api/appointments/:id', async (req, res) => {
    await Appointment.findByIdAndUpdate(req.params.id, { doctor: req.body.doctor });
    res.json({ success: true });
});

// Delete Appointment
app.delete('/api/appointments/:id', async (req, res) => {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Hospital Server active on ${PORT}`));
