const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// In-memory database
let appointments = [
    { name: "System Check", email: "admin@citycare.com", date: "2026-03-31", department: "Neurology", doctor: "Internal" }
];

// Handle Appointment Submission
app.post('/submit-appointment', (req, res) => {
    const { name, email, date, department } = req.body;
    
    // We add 'doctor' as 'Pending' initially so the admin can edit it later
    appointments.push({ 
        name, 
        email, 
        date, 
        department, 
        doctor: "Pending" 
    });

    res.send(`<script>alert('Appointment Successful!'); window.location.href='/';</script>`);
});

// API for Admin to GET all data
app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

// API for Admin to UPDATE (Edit Doctor)
app.put('/api/appointments/:id', (req, res) => {
    const id = req.params.id;
    if (appointments[id]) {
        appointments[id].doctor = req.body.doctor;
        res.json({ success: true });
    } else {
        res.status(404).send("Appointment not found");
    }
});

// API for Admin to DELETE
app.delete('/api/appointments/:id', (req, res) => {
    const id = req.params.id;
    appointments.splice(id, 1);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
