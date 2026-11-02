# MyBlog – Full Stack Blog Application

A responsive and dynamic Full Stack Blog Application built using HTML, CSS, JavaScript, Node.js, Express.js and Supabase.

MyBlog allows users to create, publish, manage and explore blog posts through a simple and user-friendly interface.

## Features

### User Authentication
- User Registration and Login
- Supabase Authentication
- Secure Authentication using Access Tokens
- Protected Dashboard
- User Logout

### Blog Management
- Create and Publish Blogs
- View All Published Blogs
- View Individual Blog Details
- Edit Existing Blogs
- Delete Blogs
- Search Blogs
- Filter Blogs by Category

### User Profile
- View Account Information
- Update Profile Name
- Upload Profile Photo
- Store Profile Photos using Supabase Storage

### User Interface
- Modern Purple and Blue Theme
- Responsive Design
- Interactive Buttons and Animations
- Mobile-Friendly Layout

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Frontend Structure |
| CSS3 | Styling and Responsive Design |
| JavaScript | Frontend Functionality |
| Node.js | Backend Runtime |
| Express.js | Backend API |
| Supabase | Database, Authentication and Storage |
| Git & GitHub | Version Control |

## Project Structure

```text
Blog Application/
│
├── backend/
│   ├── server.js
│   ├── supabaseClient.js
│   ├── package.json
│   └── .gitignore
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── images/
├── assets/
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── blog-details.html
├── profile.html
│
└── README.md
```

## Database

This project uses Supabase for database management.

**Blogs Table:**
- id
- user_id
- title
- content
- category
- created_at

**Supabase Services:**
- Supabase Authentication
- Supabase Database
- Supabase Storage

Row Level Security (RLS) policies are used to control access to user data and profile photo uploads.

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vvilen83-creator/Blog-Application.git
```

### 2. Open Project Folder

```bash
cd Blog-Application
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend folder:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_secret_key
```

Use your own Supabase credentials. Never upload your `.env` file or secret key to GitHub.

### 5. Start Backend Server

```bash
npm start
```

Backend server runs at:

```text
http://localhost:3000
```

### 6. Run Frontend

Open `index.html` using VS Code Live Server.

Frontend runs at:

```text
http://127.0.0.1:5500
```

## Future Improvements

- Deploy Application Online
- Add Password Reset Functionality
- Add Blog Comments and Likes
- Add Pagination
- Improve Blog Editor

## Author

**Biraja Prasanna Mishra**

MCA Student | Aspiring Cyber Security Professional

## GitHub Repository

https://github.com/vvilen83-creator/Blog-Application

---

*MyBlog – Write, Share and Explore Ideas.*
