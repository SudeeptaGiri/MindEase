# MindEase - Installation Guide

## Prerequisites
Ensure you have the following installed on your system:
- **Git**
- **MySQL**
- **Java (JDK 17 or later)**
- **Maven**
- **Node.js & npm**

## Installation Steps

### 1. Clone the Repository
```sh
git clone https://github.com/SudeeptaGiri/MindEase.git
cd MindEase
```

### 2. Set Up MySQL Database
1. Open MySQL and log in with your credentials.
2. Create a new database using the following command:
   ```sql
   CREATE DATABASE mental_health_db;
   ```
3. Update the database credentials in the backend configuration (`application.properties` or `application.yml`).

### 3. Start the Backend
Navigate to the backend directory and run the Spring Boot application:
```sh
cd backend
mvn spring-boot:run
```

### 4. Start the Frontend
Open a new terminal and navigate to the frontend directory:
```sh
cd frontend
npm install
npm run dev
```

## Access the Application
Once both the backend and frontend are running, you can access the application via:
- **Frontend:** `http://localhost:5173/` (or the port specified in your frontend config)
- **Backend API:** `http://localhost:8080/` (or the port specified in your backend config)

## Troubleshooting
- If the backend does not start, ensure MySQL is running and the credentials are correct.
- If the frontend does not start, check if all dependencies are installed by running `npm install`.
- For any database-related issues, verify that `mental_health_db` is created properly in MySQL.



