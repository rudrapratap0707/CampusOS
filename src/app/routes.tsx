import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import { Documentation } from "../pages/Documentation/Documentation";
import { Login } from "../pages/Login/Login";
import StudentLogin from "../pages/Login/StudentLogin";
import FacultyLogin from "../pages/Login/FacultyLogin";
import AdminLogin from "../pages/Login/AdminLogin";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />, // Generic login (agar dashboard ke baad test karna ho)
    },
    // 🔥 YAHAN HAIN TUMHARE ASLI 3-WAY LOGINS AUR PORTALS 🔥
    {
      path: "/login/student",
      element: <StudentLogin />, 
    },
    {
      path: "/login/faculty",
      element: <FacultyLogin />, 
    },
    {
      path: "/login/admin",
      element: <AdminLogin />, 
    },
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