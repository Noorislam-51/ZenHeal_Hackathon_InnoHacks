# ZenHeal — Telemedicine Platform (In Development)

ZenHeal is a **prototype** for a comprehensive, role-based telemedicine platform designed to bridge the healthcare gap for rural populations. It is **currently in active development**, with the goal of connecting Patients and Health Workers with Doctors and Pharmacies through a seamless digital ecosystem.

The core architecture is established, and the project's roadmap includes full teleconsultation, a complete digital prescription workflow, and robust offline support.

## Status: Work In-Progress

This project is actively being built. The foundational elements are in place, and development is focused on implementing the core complex features.

### ✅ Implemented & Core Functionality

* **Core Backend:** Node.js/Express server is operational.
* **Database Integration:** Connection to MongoDB (local and Atlas) is established.
* **Templating:** Server-side rendering with EJS is in use for role-based views.
* **Role-Based UI:** The landing page and role-selection UI (Patient, Doctor, Pharmacy, Admin) are complete.
* **Basic Routing:** Initial API and page routes (e.g., `/doctor/patients`, `/patient/create-appointment`) are in place.
* **Basic Dashboards:** Skeleton dashboards for each role have been created.

### 🚀 Planned Features & Roadmap

The following key features are either planned or in the process of being fully implemented:

* **Full Teleconsultation:** Implementing real-time video and chat consultations (evaluating WebRTC or third-party SDKs).
* **Complete Digital Prescription Flow:** Finalizing the end-to-end flow from doctor diagnosis to pharmacy fulfillment.
* **Offline-First Support:** Developing robust offline data saving (using Local Storage/IndexedDB) and automatic synchronization for health workers in low-connectivity areas.
* **Full Multilingual Support:** Integrating an i18n library to support English, Hindi, and Tamil across all user-facing views.
* **Advanced Analytics & Reporting:** Building out the admin dashboard with comprehensive reports on consultations, medicines, and patient outcomes.

## 🛠️ Proposed Tech Stack

This is the planned technology stack for the completed project.

### Backend

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (configured for local Compass and cloud-based Atlas)
* **ODM:** Mongoose
* **Templating Engine:** EJS (Embedded JavaScript) for server-side rendering.

### Frontend

* **Core:** HTML5, CSS3, JavaScript (ES6+)
* **Styling:** Bootstrap
* **API Client:** Axios for asynchronous HTTP requests.

### Development & Tooling

* **Live Reload:** `nodemon`
* **Environment Variables:** `dotenv`
* **Version Control:** Git

## 🚦 Getting Started (Current Build)

Follow these instructions to get the **current development version** of the project running locally.

### Prerequisites

* [Node.js](https://nodejs.org/) (which includes npm)
* [MongoDB](https://www.mongodb.com/try/download/community) (local instance) or a MongoDB Atlas URI
* [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/zenheal.git](https://github.com/your-username/zenheal.git)
    cd zenheal
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your MongoDB connection string:
    ```env
    MONGO_URI=your_mongodb_connection_string_here
    ```

4.  **Run the development server:**
    This command uses `nodemon` to automatically restart the server on file changes.
    ```bash
    npm run dev
    ```
    *(Assuming `dev` script is `nodemon app.js` or similar in `package.json`)*

5.  Open your browser and navigate to `http://localhost:3000` (or the port specified in your configuration).

## 🔀 Target Application Flow & Roles

The **target architecture** is designed around four primary roles, each with a unique dashboard and set of permissions.

### 1. Patient / Health Worker

* **Actions:** **Will** register new patients, start consultations on behalf of patients, and access medical records.
* **Flow:** This user (often a field health worker) **will** log in, select a patient, and initiate a consultation request, which **will** place them in a queue for an available doctor.

### 2. Doctor

* **Actions:** **Will** view patient waiting lists, accept consultation requests, perform video/chat sessions, and issue digital prescriptions.
* **Flow:** The doctor **will** log into their dashboard, see a list of pending appointments, accept a patient, and join the consultation. After diagnosis, they **will** create a digital prescription.

CSS

### 3. Pharmacy

* **Actions:** **Will** manage medicine stock, receive new prescriptions, and fulfill orders.
* **Flow:** The pharmacy dashboard **will** display incoming prescriptions. The pharmacist **will** be able to view details, dispense the medication, and mark the order as fulfilled.

### 4. Admin / Staff

* **Actions:** **Will** monitor system-wide activity, manage user accounts (doctors, pharmacies), and oversee operations.
* **Flow:** The admin **will** have a high-level view of all system metrics, user management panels, and analytics reports.

## 🗺️ API Endpoints (In-Progress)

This list includes key routes that are currently implemented or in development.

* `POST /patient/create-appointment`: Creates a new consultation request.
* `GET /doctor/patients`: Fetches the list of patients assigned to a doctor.
* `GET /doctor/appointments`: Retrieves the doctor's appointment schedule.
* `POST /doctor/patient_accept`: (EJS route) Renders the page for a doctor to accept a patient consultation.
