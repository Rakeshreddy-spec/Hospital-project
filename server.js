const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// In-memory database with a "doctor" field
let appointments = [
    { name: "John Doe", email: "john@example.com", date: "2026-05-12", department: "Cardiology", doctor: "Smith" }
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'public', 'index.html'));
});

// Create
app.post('/submit-appointment', (req, res) => {
    const { name, email, date, department, doctor } = req.body;
    appointments.push({ name, email, date, department, doctor: doctor || "Pending" });
    res.send("<script>alert('Booked!'); window.location.href='/';</script>");
});

// Read
app.get('/api/appointments', (req, res) => res.json(appointments));

// Update (Edit Doctor)
app.put('/api/appointments/:id', (req, res) => {
    const id = req.params.id;
    if (appointments[id]) {
        appointments[id].doctor = req.body.doctor;
        res.json({ success: true });
    } else {
        res.status(404).send("Not found");
    }
});

// Delete
app.delete('/api/appointments/:id', (req, res) => {
    const id = req.params.id;
    appointments.splice(id, 1);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server live on ${PORT}`));
