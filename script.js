
alert("JavaScript Connected Successfully!");

// REGISTER FUNCTION
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;

        const user = {
            name: name,
            email: email,
            password: password
        };

        localStorage.setItem("user", JSON.stringify(user));

        alert("Registration Successful!");

        window.location.href = "login.html";
    });
}


// LOGIN FUNCTION
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const user = JSON.parse(localStorage.getItem("user"));

        if (user && user.email === email &&
            user.password === password) {

            localStorage.setItem("loggedIn", "true");

            alert("Login Successful!");

            window.location.href = "dashboard.html";

        } else {
            alert("Invalid Email or Password!");
        }
    });
}


// CREATE BLOG FUNCTION
const blogForm = document.getElementById("blogForm");

if (blogForm) {
    blogForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const title = document.getElementById("blogTitle").value;
        const content = document.getElementById("blogContent").value;

        let blogs = JSON.parse(localStorage.getItem("blogs")) || [];

        blogs.push({
            title: title,
            content: content
        });

        localStorage.setItem("blogs", JSON.stringify(blogs));

        alert("Blog Published Successfully!");

        window.location.href = "dashboard.html";
    });
}


// DISPLAY BLOGS ON DASHBOARD
const dashboard = document.querySelector(".dashboard");

if (dashboard) {
    const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

    const container = document.createElement("div");
    container.className = "blog-container";

    blogs.forEach(function(blog) {
        const card = document.createElement("div");
        card.className = "blog-card";

        const heading = document.createElement("h3");
        heading.textContent = blog.title;

        const paragraph = document.createElement("p");
        paragraph.textContent = blog.content;

        card.appendChild(heading);
        card.appendChild(paragraph);

        container.appendChild(card);
    });

    dashboard.appendChild(container);
}
