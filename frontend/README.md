# Volunteer Organization & Support Platform

This platform is a **Full-Stack** web application designed to digitalize coordination between NGOs, volunteers, and people in need during disasters and crises. It aims to ensure that aid reaches the right location as quickly as possible through real-time data tracking.

## Key Features

* **Real-Time Map Tracking:** Integrated with Leaflet API to provide live, location-based visualization of emergency alerts and volunteer activity.
* **Hybrid Authentication:** Seamless synchronization between Firebase Auth and MongoDB for secure user management and session control.
* **Smart Notification System:** Utilizes Firebase Cloud Messaging (FCM) to deliver critical announcements and emergency calls instantly to users.
* **AI-Powered Recommendations:** Optimized volunteer activity suggestions based on user skills and past contribution history.
* **Advanced Admin Dashboard:** Centralized management for organization verification, event approvals, and role-based user authorization.

## Technical Stack

### Frontend
* **Core:** React.js (v18+)
* **UI & UX:** Material-UI (MUI), Responsive Design & Modern CSS Glassmorphism
* **State Management:** Context API (Auth, Notification, Events)
* **Maps:** React-Leaflet & OpenStreetMap API
* **Networking:** Axios (with Interceptor architecture for centralized token and error handling)

### Backend & Cloud
* **Server:** Node.js & Express.js
* **Database:** MongoDB & Mongoose ODM
* **Auth & Messaging:** Firebase (Authentication & Cloud Messaging)

## Project Structure

```text
src/
├── components/   # Modern & Reusable UI components (Navbar, MapPreview, Footer, etc.)
├── context/      # Auth and Global state management (Identity, Notifications)
├── hooks/        # Custom React Hooks (useForm, useNotification, useToast)
├── pages/        # Page components (AdminDashboard, Profile, EmergencySupport, etc.)
├── services/     # API service layer (Centralized Axios configuration)
├── utils/        # Validation logic and helper functions (Validation.js)
└── routes/       # RBAC (Role Based Access Control) supported routing

## Installation & Setup
Follow these steps to get the project up and running locally:
1. Clone the Repository
git clone [https://github.com/yourusername/volunteer-platform.git](https://github.com/yourusername/volunteer-platform.git)
cd volunteer-platform

2.Install Dependencies
npm install

3. Environment Variables
Create a .env file in the root directory and add your Firebase and API configuration.
Note: Ensure all variables are prefixed with REACT_APP_

REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_VAPID_KEY=your_fcm_vapid_key

4. Run the Application
npm start

*The app will be available at http://localhost:3000

- Architectural Decisions
Modularity: Each component and hook is built according to the "Single Responsibility" principle, ensuring high maintainability and scalability.

Security: Implemented ProtectedRoute logic to prevent unauthorized access and established a role-based redirection system (RBAC).

User Experience: Integrated fluid loading states (Spinners), animated notifications (Toasts), and modern map layers to provide a professional user interface.

Developed as a graduation project at Dokuz Eylül University, Computer Programming Department.