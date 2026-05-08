async function signup() {
    const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    });

    alert("Signup successful");
}

async function login() {
    const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        })
    });

    const data = await res.json();

    if (data.user_id) {
        localStorage.setItem("user_id", data.user_id);
        window.location.href = "index.html";
    } else {
        alert("Invalid login");
    }
}