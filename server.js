const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

// IN-MEMORY DATABASE (Resets if server restarts)
let appointments = [
    { name: "Patient Alpha", email: "alpha@test.com", date: "2026-05-10", department: "Cardiology", doctor: "Dr. Smith" },
    { name: "Patient Beta", email: "beta@test.com", date: "2026-05-12", department: "Neurology", doctor: "Pending" }
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// --- THE ATTACK DEMONSTRATION ---
// Route to simulate "Data Poisoning" remotely
app.get('/poison-data-attack', (req, res) => {
    // We simulate a hacker altering the hospital's local training data
    appointments = appointments.map(appt => ({
        ...appt,
        department: "⚠️ DATA POISONED", // Label Flipping Attack
        doctor: "MALICIOUS_NODE"
    }));
    
    res.send(`
        <div style="background:red; color:white; padding:50px; font-family:sans-serif; text-align:center;">
            <h1>🚨 REMOTE ATTACK SUCCESSFUL 🚨</h1>
            <p>Hospital Local Data has been poisoned. Federated Learning model will now be corrupted.</p>
            <a href="/admin.html" style="color:yellow; font-weight:bold;">View Corrupted Staff Portal</a>
        </div>
    `);
});

// Normal Routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin123') {
        res.redirect('/admin.html');
    } else {
        res.send("<script>alert('Invalid'); window.location.href='/login.html';</script>");
    }
});

app.post('/submit-appointment', (req, res) => {
    appointments.push({ ...req.body, doctor: "Pending" });
    res.send("<script>alert('Booking Successful!'); window.location.href='/';</script>");
});

app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

app.listen(PORT, () => console.log(`Hospital Node running on ${PORT}`));
