const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// In-memory list (Note: This clears if the server restarts on Render)
let appointments = [
    { name: "Initial Test", email: "test@citycare.com", date: "2026-04-01", department: "Cardiology", doctor: "Pending" }
];

// --- ROUTES ---

// Handle Staff Login (Fixes "Cannot POST /login")
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Simple check - you can change these
    if (username === 'admin' && password === 'admin123') {
        res.redirect('/admin.html');
    } else {
        res.send("<script>alert('Invalid Credentials'); window.location.href='/login.html';</script>");
    }
});

// Handle Appointment Booking
app.post('/submit-appointment', (req, res) => {
    const { name, email, date, department } = req.body;
    appointments.push({ 
        name, 
        email, 
        date, 
        department, 
        doctor: "Pending" 
    });
    res.send("<script>alert('Booking Successful!'); window.location.href='/';</script>");
});

// API for the Staff Portal to get data
app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

// Delete Appointment
app.delete('/api/appointments/:index', (req, res) => {
    const index = req.params.index;
    appointments.splice(index, 1);
    res.json({ success: true });
});

// Update Doctor
app.put('/api/appointments/:index', (req, res) => {
    const index = req.params.index;
    if (appointments[index]) {
        appointments[index].doctor = req.body.doctor;
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "Not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
