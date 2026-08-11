import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import { Documentation } from "../pages/Documentation/Documentation";
import { Login } from "../pages/Login/Login";
import StudentLogin from "../pages/Login/StudentLogin";
import FacultyLogin from "../pages/Login/FacultyLogin";

// 🔥 NAYA: OTP Login page ko import karo
import { LoginAdmin } from "../pages/Login/LoginAdmin"; 

// 🔥 Dashboard page (iska naam tumne AdminLogin hi rehne diya tha)
import AdminLogin from "../pages/Login/AdminLogin"; 

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />, 
    },
    {
      path: "/login/student",
      element: <StudentLogin />, 
    },
    {
      path: "/login/faculty",
      element: <FacultyLogin />, 
    },
    
    // ==========================================
    // 🔥 ADMIN ROUTES FIXED 🔥
    // ==========================================
    
    // 1. Jab koi Admin Login par click karega, toh OTP page khulega
    {
      path: "/login/admin",
      element: <LoginAdmin />, 
    },
    // 2. OTP Verify hone ke baad ye route hit hoga (Dashboard)
    {
      path: "/admin/dashboard",
      element: <AdminLogin />, 
    },
    
    // ==========================================

    {
      path: "/documentation",
      element: <Documentation />,
    },
    // Catch-all route 
    {
      path: "*",
      element: <Home />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
    } as any,
  }
);