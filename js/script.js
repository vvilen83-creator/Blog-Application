alert("JavaScript Connected Successfully!");

// REGISTER FUNCTION
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;

        try {
            const response = await fetch("http://localhost:3000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Registration Successful!");
                window.location.href = "login.html";
            } else {
                alert(result.message);
            }

        } catch (error) {
            alert("Backend server is not running!");
            console.log(error);
        }
    });
}

// LOGIN FUNCTION
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem("loggedIn", "true");
                alert("Login Successful!");
                window.location.href = "dashboard.html";
            } else {
                alert(result.message);
            }

        } catch (error) {
            alert("Backend server is not running!");
            console.log(error);
        }
    });
}

// CREATE BLOG FUNCTION
const blogForm = document.getElementById("blogForm");

if (blogForm) {
    blogForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const title = document.getElementById("blogTitle").value;
        const content = document.getElementById("blogContent").value;

        try {
            const response = await fetch("http://localhost:3000/api/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title,
                    content: content,
                    author: "Biraja"
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Blog Published Successfully!");
                window.location.href = "dashboard.html";
            } else {
                alert(result.message);
            }

        } catch (error) {
            alert("Backend server is not running!");
            console.log(error);
        }
    });
}
