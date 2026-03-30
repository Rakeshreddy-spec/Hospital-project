function submitData() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const date = document.getElementById("date").value;

    if (!name || !email || !date) {
        alert("Please fill all fields");
        return;
    }

    const appointmentData = { name, email, date };

    fetch("https://hospital-project-krnn.onrender.com/appointment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(appointmentData)
    })
        .then(res => res.json())
        .then(data => {
            alert("✅ Appointment Booked Successfully!");
            document.getElementById("appointmentForm").reset();
        })
        .catch(err => {
            console.error("Error:", err);
            alert("❌ Failed to book appointment.");
        });
}