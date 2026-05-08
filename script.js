let userId = localStorage.getItem("user_id");
let latestPDF = "";

// Logout
function logout() {
    localStorage.removeItem("user_id");
    window.location.href = "login.html";
}

// Generate document
async function generateDoc() {

    if (!userId) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    const output = document.getElementById("output");
    const loader = document.getElementById("loaderOverlay");

    loader.classList.remove("hidden");
    output.innerText = "";

    const data = {
        user_id: userId,
        doc_type: document.getElementById("doc_type").value,
        language: document.getElementById("language").value,
        owner_name: document.getElementById("owner").value,
        tenant_name: document.getElementById("tenant").value,
        property_address: document.getElementById("address").value,
        rent_amount: document.getElementById("rent").value,
        duration: document.getElementById("duration").value,
        date: "1 May 2026",
        notice_period: "30"
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/generate", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.error) {
            output.innerText = "❌ " + result.error;
        } else {
            output.innerText = result.generated_document;
            latestPDF = result.pdf_file;
        }

    } catch (error) {
        output.innerText = "❌ Server error.";
    }

    loader.classList.add("hidden");
}

// Download PDF
function downloadPDF() {
    if (!latestPDF) {
        alert("Generate document first!");
        return;
    }

    window.open("http://127.0.0.1:5000/download/" + latestPDF);
}