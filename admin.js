// Load data when page opens
window.onload = function () {
    loadData();
};

function loadData() {
    fetch("http://localhost:3000/appointments")
        .then(res => res.json())
        .then(data => {

            const table = document.querySelector("#dataTable tbody");
            table.innerHTML = "";

            data.forEach(item => {

                const row = `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>${item.date}</td>
                        <td>
                            <button onclick="deleteData('${item._id}')">Delete</button>
                        </td>
                    </tr>
                `;

                table.innerHTML += row;
            });

        });
}

// Delete function
function deleteData(id) {
    fetch(`http://localhost:3000/appointment/${id}`, {
        method: "DELETE"
    })
        .then(() => {
            alert("Deleted");
            loadData();
        });
}
let currentId = null;

// Fill form when clicking Edit
function editData(id, name, email, date) {

    document.getElementById("editName").value = name;
    document.getElementById("editEmail").value = email;
    document.getElementById("editDate").value = date;

    currentId = id;
}

// Update data
function updateData() {

    const updatedData = {
        name: document.getElementById("editName").value,
        email: document.getElementById("editEmail").value,
        date: document.getElementById("editDate").value
    };

    fetch(`http://localhost:3000/appointment/${currentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
    })
        .then(() => {
            alert("Updated successfully");
            loadData();
        });
}