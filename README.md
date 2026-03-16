#  Volunteer Platform (Gönüllü Platformu)

A comprehensive, full-stack disaster management and social solidarity platform designed to coordinate volunteers, NGOs, and those in need through AI-driven insights and real-time geospatial mapping.

##  Vision
In times of crisis or community need, coordination is key. This platform digitizes the bridge between goodwill and urgent requirements, ensuring that resources (human or material) reach the right location at the right time.

##  Key Features

* ** AI-Powered Suggestions:** Integrates custom logic to provide users with intelligent volunteer activity recommendations based on their real-time geolocation and interests.
* ** Dynamic Geospatial Mapping:** Leverages **MongoDB 2dsphere indexing** to pin activities on a live map, allowing users to visualize nearby support hubs within a specific kilometer radius.
* ** Smart Transportation Module:** A dedicated coordination hub for "I have a vehicle" or "I need a ride" listings, optimized for logistics during regional activities or emergencies.
* ** Enterprise-Grade Authentication:** Secure login system using **JSON Web Tokens (JWT)** and **Bcrypt** password hashing, featuring role-based access control (Admin, NGO, Volunteer).
* ** Real-time Emergency Postings:** Agile form management for rapid support requests, allowing NGOs to approve, manage, and conclude help signals efficiently.

##  Technical Stack

**Frontend:**
* **React.js** (Hooks, Context API for Global State Management)
* **Material-UI (MUI)** (Modern, Responsive UI/UX)
* **Axios** (API Interceptors & Centralized Request Management)

**Backend:**
* **Node.js & Express.js** (Scalable RESTful API Design)
* **MongoDB & Mongoose** (Complex Schema design & Geospatial Querying)
* **Firebase Admin SDK** (Real-time data synchronization)

**Security & DevOps:**
* JWT-based Authorization Middleware
* Environment Variable Management (Dotenv)
* Git-flow Version Control

##  Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/irembadak/gonullu-platform.git](https://github.com/irembadak/gonullu-platform.git)
    ```
2.  **Server Setup:**
    ```bash
    cd backend
    npm install
    npm start
    ```
3.  **Client Setup:**
    ```bash
    cd frontend
    npm install
    npm start
    ```

##  Project Architecture
The project follows a modular **Model-View-Controller (MVC)** pattern on the backend to ensure code maintainability and scalability, while the frontend utilizes a component-based architecture with centralized API services.

---
*Developed with a focus on social impact and modern software engineering principles.*
