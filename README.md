# Abdullah's Digital Workspace & Portfolio

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![AI Assisted](https://img.shields.io/badge/AI_Assisted-Gemini-8A2BE2?style=for-the-badge)

## Overview
Welcome to my personal digital workspace! This is a Full-Stack local web application designed to manage my coding projects, track my learning progress as a CS student, and showcase my "Masterpieces". 

Built with an architecture-first mindset, this project serves as both a functional task manager and a reverse-engineering playground for learning web development.

---

## Features

* **Glassmorphism UI**: A sleek, modern frosted-glass design interface.
* **Dark/Light Mode**: Seamless theme switching with persistent local storage.
* **Interactive Particles**: Dynamic background animations using `particles.js`.
* **Local Database**: Fully functional CRUD operations powered by a local Node.js/SQLite backend.
* **Smart Routing & Filtering**:
    * `index.html`: Dashboard for Active Projects (To-Do).
    * `hall-of-fame.html`: Archive for Completed Projects (with permanent deletion).
    * `big-projects.html`: Automatic showcase for projects marked as "Hard" difficulty (Masterpieces).

---

## Tech Stack

**Frontend:**
* HTML5
* CSS3 (Variables, Grid, Flexbox, Glassmorphism)
* Vanilla JavaScript (ES6+, Fetch API)
* [Particles.js](https://vincentgarreau.com/particles.js/)

**Backend:**
* Node.js
* Express.js (REST API)
* SQLite3 (Local lightweight database)

---

## How to Run Locally

Since this project uses a local Node.js server to read/write to the SQLite database, you need to start the server before opening the website.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### Installation & Execution
1. **Clone the repository** (or download the files):
   ```bash
   git clone <your-repo-link>
   cd <repository-folder>
   ```

2. **Install dependencies** (Express, SQLite3, CORS):
   ```bash
   npm install
   ```

3. **Start the local server**:
   ```bash
   node server.js
   ```
   *You should see a message saying: `Connected to the SQLite database successfully!`*

4. **Open the App**:
   Simply double-click `index.html` or open it in your web browser.

---

## Project Structure

```text
Workspace-Project/
├── index.html          # Main dashboard (Active Projects)
├── hall-of-fame.html   # Completed projects archive
├── big-projects.html   # Hard/Masterpiece projects showcase
├── style.css           # UI Styling & Dark/Light mode logic
├── script.js           # Frontend logic, API calls, and Particles init
├── server.js           # Node.js Express Server & API endpoints
├── projects.db         # SQLite database file (Auto-generated, Git-ignored)
├── package.json        # Node dependencies list
└── .gitignore          # Prevents node_modules & db from being uploaded
```

---

## Philosophy & Learning
This project was conceptualized by me (acting as the Software Architect/Project Manager) and generated using AI. It is designed to be a functional tool for my studies, but more importantly, a Reverse Engineering Sandbox. By breaking, modifying, and tweaking the generated code, I am actively learning the mechanics of HTML, CSS, JavaScript, and Server-Client communication.

---
*Created by Abdullah Mahmood - Software Engineer | CS Student*
