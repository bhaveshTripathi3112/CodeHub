## CodeHub — The Modern Coding Platform for Developers

![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js\&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react\&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb\&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?logo=express\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css\&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens\&logoColor=white)

---
CodeHub is a full-stack web platform that allows users to practice coding, solve challenges, submit solutions, and track their progress — all in a modern, responsive interface.

It combines a powerful backend built with Node.js, Express, and MongoDB, and a React + Tailwind CSS frontend that provides an intuitive experience for developers.

---

## 🚀 Features
**👤 User Management**

- Secure Signup and Login with JWT Authentication

- Encrypted password handling using bcrypt.js

- Persistent user sessions

**💻 Code Playground**

- Real-time code editor with syntax highlighting

- Multi-language support (C++, Python, Java, JavaScript, etc.)

- Code execution and output visualization

**🧩 Problem Management**

- Browse coding challenges categorized by difficulty

- Submit solutions and view test case results

- View problem statements, constraints, and examples

**📊 User Dashboard**

- Track solved problems, accuracy, and performance stats

- Personalized profile page

**🧠 Admin Features**

- Add, edit, and remove coding problems

- Manage users and monitor submissions

---

## ⚙️ Tech Stack


**🧩 Frontend**

- React.js

- Tailwind CSS

- Axios

- React Router
- React Redux

- Monaco Editor (for in-browser coding)

**⚡ Backend**

- Node.js

- Express.js

- MongoDB + Mongoose

- JWT Authentication

- bcryptjs

---

## 📡 CodeHub API Endpoints

Below is a detailed list of all REST API endpoints available in CodeHub, categorized by their module.

**🧑‍💻 Authentication Routes (/user)**
| Method     | Endpoint               | Access     | Description                                       |
| ---------- | ---------------------- | ---------- | ------------------------------------------------- |
| **POST**   | `/user/register`       | Public     | Register a new user                               |
| **POST**   | `/user/admin/register` | Admin Only | Register a new admin user                         |
| **POST**   | `/user/login`          | Public     | Log in an existing user                           |
| **POST**   | `/user/logout`         | User Only  | Log out the current user (requires valid token)   |
| **GET**    | `/user/check`          | User Only  | Verify user authentication and fetch user details |
| **DELETE** | `/user/deleteProfile`  | User Only  | Delete the logged-in user’s account               |


**🧩 Problem Routes (/problem)**

| Method     | Endpoint                         | Access     | Description                                            |
| ---------- | -------------------------------- | ---------- | ------------------------------------------------------ |
| **POST**   | `/problem/create`                | Admin Only | Create a new coding problem                            |
| **PUT**    | `/problem/update/:id`            | Admin Only | Update problem details by ID                           |
| **DELETE** | `/problem/delete/:id`            | Admin Only | Delete a problem by ID                                 |
| **GET**    | `/problem/ProblemById/:id`       | User Only  | Fetch details of a specific problem by ID              |
| **GET**    | `/problem/getAllProblem`         | User Only  | Fetch all available coding problems                    |
| **GET**    | `/problem/problemSolvedByUser`   | User Only  | Fetch all problems solved by the logged-in user        |
| **GET**    | `/problem/submittedProblem/:pid` | User Only  | Fetch submission history of a specific problem by user |

**🧠 Submission Routes (/submit)**

| Method   | Endpoint             | Access    | Description                                                  |
| -------- | -------------------- | --------- | ------------------------------------------------------------ |
| **POST** | `/submit/run/:id`    | User Only | Run code against sample test cases without saving submission |
| **POST** | `/submit/submit/:id` | User Only | Submit final solution for a problem and store the result     |

**⚙️ Middleware**

| Middleware        | Description                                            |
| ----------------- | ------------------------------------------------------ |
| `userMiddleware`  | Validates the JWT token and authorizes logged-in users |
| `adminMiddleware` | Verifies that the logged-in user has admin privileges  |

---

## 🔧 Installation & Setup

1. **Clone the Repository**
```
git clone https://github.com/bhaveshTripathi3112/CodeHub.git

cd codehub
```

2️. **Setup Backend**
```
cd backend

npm install
```

3. **Create .env file in backend:**
```
PORT=***
MONGODB_URL= ***
JWT_KEY=***
NODE_ENVIRONMENT="development"
REDIS_PASSWORD=***
REDIS_HOST=***
REDIS_PORT=***
JUDGE0_KEY=***
```
4.**Run backend server:**
```
npm run dev
```

5.**Setup Frontend**
```
cd ../frontend
npm install
npm run dev
```

---
The app will run on:

Frontend → http://localhost:5173

Backend → http://localhost:5000

---
## Future Enhancements
- Leaderboard to compare ranks among other developers

- Add discussion section for problems

- AI-based solution recommendations

- Real-time collaborative coding

- User badges and achievements

- Dark/light theme toggle

---
## 🧑‍💻 Author

**👨‍💻 Bhavesh Tripathi**  
📧 [bhaveshtripathi3112@gmail.com](mailto:bhaveshtripathi3112@gmail.com)  
💼 [LinkedIn](https://www.linkedin.com/in/bhavesh-tripathi-a69483309)  
🐙 [GitHub](https://github.com/bhaveshTripathi3112)

<!-- 🔗 [Portfolio](https://your-portfolio-link.com) -->

---

## 💖 Support

If you like this project, please ⭐ star the repository on GitHub.