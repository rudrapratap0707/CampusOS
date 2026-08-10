import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { AcademicProvider } from "../context/AcademicContext";

export function Providers() {
  return (
    <AcademicProvider>
      <RouterProvider router={router} />
    </AcademicProvider>
  );
}

