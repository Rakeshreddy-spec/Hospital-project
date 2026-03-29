function submitData() {

    console.log("Form Submitted");

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        date: document.getElementById("date").value
    };

    console.log("Sending Data:", data);

    fetch("http://localhost:3000/appointment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(response => {
            console.log("Server Response:", response);
            alert("Appointment Saved!");
        })
        .catch(err => console.error("Error:", err));
}

// animation
window.addEventListener("scroll", () => {
    document.querySelectorAll(".fade-in").forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 50) {
            el.classList.add("show");
        }
    });
});