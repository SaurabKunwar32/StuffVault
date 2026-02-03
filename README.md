# StuffVault

A full-stack **cloud storage application** that allows users to upload, manage, and share their files securely.

The **client** is built with **React**, **Vite**, and **TailwindCSS**, while the **server** uses **Node.js**, **Express**, **MongoDB**, and **Redis**.

The application stores files using **AWS S3** for seamless file transfers.

---

## Table of Contents

- [Features](#features)
  - [Authentication and Security](#authentication-and-security)
  - [File Management](#file-management)
  - [Cloud Storage and Import](#cloud-storage-and-import)
  - [Settings and Customization](#settings-and-customization)
  - [Admin Dashboard](#admin-dashboard)

- [Project Structure](#project-structure)
  - [Client (Frontend - React + Vite + Tailwind)](#client-frontend---react--vite--tailwind)
  - [Server (Backend - Node + Express + MongoDB)](#server-backend---node--express--mongodb)

- [Screenshot Overview](#screenshot-overview)
  - [Login and Register](#login-and-register)
  - [HomePage](#homepage)
  - [Settings](#settings)

- [Tech Stack](#tech-stack)



---

## Features

### Authentication and Security

- User registration and login with email and password.
- OAuth Login for **Google and GitHub**.
- OTP-based verification for secure account setup.
- Passwords stored in hashed format (bcrypt).
- Token stored in cookies (Signed Cookies).
- CORS, Helmet, and sanitization for enhanced security.
- Rate Limiting and Throttling.

### File Management

- Upload any file (PDF, Images, Videos, Docs, etc.) with progress tracking.
- **Cloud storage with AWS S3** for scalable and reliable file storage.
- Supports **Grid and List views** for file navigation.
- View file details (size, type, created date, modified date).
- Rename, delete and recover files.

### Cloud Storage and Import

- **AWS S3 Integration** for secure cloud file storage.
- **CloudFront CDN** for fast file delivery and optimized performance.

### Settings and Customization

- Update profile info.
- Statistic of used/available Storage.
- Change password.
- Manage connected devices/sessions.

### Admin Dashboard

- User Overview - Track total, active, online, and deleted users.
- User Management - View, filter, edit roles, force logout, and delete users.
- Deletion System - Soft Delete (recoverable) and Hard Delete (permanent) with confirmation.
- Role and Permissions - Roles like User, Manager, Admin, Owner with badges.
- File Management - Access directories/files with navigation.
- Real-Time Tracking - Monitor online users and refresh instantly.

## Project Structure

### Client (Frontend - React + Vite + Tailwind)

```bash
Client/
├── node_modules/
├── public/
│   └── vite.svg
├── src/
│   ├── apis/
│   │   ├── authApi.js
│   │   ├── axiosInstances.js
│   │   ├── directoryApi.js
│   │   ├── fileApi.js
│   │   ├── loginWithGithub.js
│   │   ├── loginWithGoogle.js
│   │   └── userApi.js
│   ├── assets/
│   │   ├── react.svg
│   │   └── ui.png
│   ├── Component/
│   │   ├── Views/
│   │   │   ├── GridView.jsx
│   │   │   └── ListView.jsx
│   │   ├── ActionBar.jsx
│   │   ├── ContextMenu.jsx
│   │   ├── DirectoryItem.jsx
│   │   ├── DirectoryList.jsx
│   │   ├── Header.jsx
│   │   ├── InvalidRoute.jsx
│   │   ├── LandingPage.jsx
│   │   ├── MainView.jsx        # main page after App.jsx
│   │   ├── Settings.jsx
│   │   ├── Sidebar.jsx
│   │   ├── UploadToast.jsx
│   │   └── UsersPage.jsx
│   ├── context/
│   │   └── DirectoryContext.js
│   ├── Forms/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── VerifyOtp.jsx
│   ├── LandingPages/
│   │   ├── Footer.jsx
│   │   ├── HowItWorks.jsx
│   │   ├── LandingSectionCTA.jsx
│   │   ├── LandingSectionOne.jsx
│   │   └── LandingSectionTwo.jsx
│   ├── LegalPages/
│   │   ├── Privacy.jsx
│   │   └── Terms.jsx
│   ├── Models/
│   │   ├── ConfirmActionModal.jsx
│   │   ├── DeleteModel.jsx
│   │   ├── DetailsPopupModel.jsx
│   │   ├── DirectoryModel.jsx
│   │   └── RenameModal.jsx
│   ├── Routes/
│   │   ├── ProtectedRoute.jsx
│   │   ├── PublicRoute.jsx
│   │   └── RoleRoute.jsx
│   ├── Subscription/
│   │   ├── SubscriptionCards.jsx
│   │   ├── SubscriptionPlans.jsx
│   │   └── success.jsx
│   ├── App.jsx
│   ├── AppRoutes.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js

```

### Server (Backend - Node + Express + MongoDB + AWS)

```bash
server/
├── config/
│   ├── db.js                    # Database connection setup
│   ├── redis.js                 # Redis client configuration
│   └── setup.js                 # Application-level setup/config
├── controllers/
│   ├── authController.js        # Authentication logic
│   ├── directoryController.js   # Directory-related operations
│   ├── fileController.js        # File upload/download logic
│   └── userController.js        # User-related operations
├── middlewares/
│   ├── auth.js                  # Authentication middleware
│   └── validatedMiddleware.js   # Request validation handler
├── models/
│   ├── directoryModel.js        # Directory schema/model
│   ├── fileModel.js             # File schema/model
│   ├── otpModel.js              # OTP schema/model
│   ├── sessionModel.js          # Session schema/model
│   └── userModel.js             # User schema/model
├── node_modules/
├── routes/
│   ├── authRoutes.js            # Auth route definitions
│   ├── directoryRoutes.js       # Directory route definitions
│   ├── fileRoutes.js            # File route definitions
│   └── userRoutes.js            # User route definitions
├── services/
│   ├── cloudFont.js             # Cloud storage integration
│   ├── googleAuthService.js     # Google OAuth service
│   ├── s3.js                    # AWS S3 service wrapper
│   └── sendOtpService.js        # OTP delivery service
├── utils/
│   ├── logicalPath.js           # Path resolution helpers
│   ├── RateLimiter.js           # Rate limiting utility
│   ├── sanitize.js              # Input sanitization helpers
│   ├── throttler.js             # Request throttling utility
│   └── updateDirectoriesSize.js # Directory size recalculation
├── validators/
│   └── authSchema.js            # Request validation schemas
├── .env
├── .gitignore
├── app.js                       # Express app entry point
├── package-lock.json
└── package.json

```

## Screenshot Overview

### Login and Register

<p align="center">
  <img src="assests/login.png" alt="Login" width="45%" />
  <img src="assests/register.png" alt="Register" width="45%" />
  <img src="assests/verify.png" alt="OTP" width="45%" />
</p>

---

### HomePage

<p align="center">
  <img src="assests/home.png" alt="List View" width="45%" />
  <img src="assests/home1.png" alt="Grid View" width="45%" />
  <img src="assests/logouts.png" alt="Logout  Buttons" width="45%" />
  <img src="assests/Details.png" alt="Detail Modal" width="45%" />
  <img src="assests/newDir.png" alt="New Directory" width="45%" />
</p>

---

### Settings

<p align="center">
  <img src="assests/setting.png" alt="Settings 1" width="45%" />
  <!-- <img src="docs/ScreenShots/Settings/Settings-2.png" alt="Settings 2" width="45%" />
  <img src="docs/ScreenShots/Settings/Settings-3.png" alt="Settings 3" width="45%" />
  <img src="docs/ScreenShots/Settings/Settings-4.png" alt="Settings 4" width="45%" /> -->
</p>

---

### Admin Dashboard

<p align="center">
  <img src="assests/dashboard.png" alt="Dashboard" width="45%" />
  <!-- <img src="docs/ScreenShots/Admin/Online-User.png" alt="Online Users" width="45%" />
  <img src="docs/ScreenShots/Admin/Hard-Soft Delete.png" alt="Hard-soft-delete" width="45%" /> -->
  <!-- <img src="docs/ScreenShots/Admin/Single User view.png" alt="View Directory" width="45%" /> -->
</p>

---

## Tech Stack

- **Frontend**: React, TailwindCSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Redis
- **Cloud Storage**: AWS S3, CloudFront CDN
- **External APIs**: Google OAuth2
- **Authentication**: Bcrypt + OTP + OAuth (Google/GitHub)

---


