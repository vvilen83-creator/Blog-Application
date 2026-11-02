
const API_URL = "http://localhost:3000/api";

// GET USER ID FROM LOGIN TOKEN
function getUserId(token) {
    try {
        return JSON.parse(atob(token.split(".")[1])).sub;
    } catch (error) {
        return null;
    }
}

// REGISTER FUNCTION
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem("loggedIn", "true");
                localStorage.setItem("accessToken", result.session.access_token);

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

        const title = document.getElementById("blogTitle").value.trim();
        const content = document.getElementById("blogContent").value.trim();
        const category = document.getElementById("blogCategory").value;
        const token = localStorage.getItem("accessToken");

        if (!token) {
            alert("Please login first!");
            window.location.href = "login.html";
            return;
        }

        if (!title || !content || !category) {
            alert("Please fill all fields and select a category!");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/blogs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({ title, content, category })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Blog Published Successfully!");
                window.location.href = "dashboard.html";
            } else {
                alert(result.message);
            }
        } catch (error) {
            alert("Unable to publish blog!");
            console.log(error);
        }
    });
}

// LOAD MY BLOGS FUNCTION
const blogContainer = document.getElementById("blogContainer");

if (blogContainer) {
    loadMyBlogs();
}

async function loadMyBlogs() {
    const token = localStorage.getItem("accessToken");
    const userId = token ? getUserId(token) : null;

    if (!token || !userId) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/blogs`);
        const blogs = await response.json();

        if (!response.ok) {
            throw new Error(blogs.message || "Unable to load blogs");
        }

        blogContainer.innerHTML = "";

        const myBlogs = blogs.filter(blog => blog.user_id === userId);

        if (myBlogs.length === 0) {
            blogContainer.textContent = "You have not created any blogs yet.";
            return;
        }

        myBlogs.forEach(blog => {
            const card = document.createElement("div");
            card.className = "blog-card";

            const title = document.createElement("h3");
            title.textContent = blog.title;

            const category = document.createElement("p");
            category.textContent = "Category: " + (blog.category || "General");

            const content = document.createElement("p");
            content.textContent = blog.content;

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.addEventListener("click", () => editBlog(blog));

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteBlog(blog.id));

            card.appendChild(title);
            card.appendChild(category);
            card.appendChild(content);
            card.appendChild(editButton);
            card.appendChild(deleteButton);

            blogContainer.appendChild(card);
        });

    } catch (error) {
        console.log(error);
        blogContainer.textContent = "Error loading blogs. Please try again.";
    }
}

// EDIT BLOG FUNCTION
async function editBlog(blog) {
    const newTitle = prompt("Enter new blog title:", blog.title);
    if (newTitle === null) return;

    const newCategory = prompt(
        "Enter category (Technology, Education, Programming, Cyber Security, Lifestyle, Travel, Health, General):",
        blog.category || "General"
    );
    if (newCategory === null) return;

    const newContent = prompt("Enter new blog content:", blog.content);
    if (newContent === null) return;

    if (!newTitle.trim() || !newContent.trim() || !newCategory.trim()) {
        alert("All fields are required!");
        return;
    }

    const token = localStorage.getItem("accessToken");

    try {
        const response = await fetch(`${API_URL}/blogs/${blog.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                title: newTitle.trim(),
                content: newContent.trim(),
                category: newCategory.trim()
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Blog Updated Successfully!");
            loadMyBlogs();
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("Unable to update blog!");
        console.log(error);
    }
}

// DELETE BLOG FUNCTION
async function deleteBlog(id) {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    const token = localStorage.getItem("accessToken");

    try {
        const response = await fetch(`${API_URL}/blogs/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const result = await response.json();

        if (response.ok) {
            alert("Blog Deleted Successfully!");
            loadMyBlogs();
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert("Unable to delete blog!");
        console.log(error);
    }
}

// LOGOUT FUNCTION
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.addEventListener("click", function(e) {
        e.preventDefault();

        localStorage.removeItem("loggedIn");
        localStorage.removeItem("accessToken");

        alert("Logged out successfully!");
        window.location.href = "login.html";
    });
}
