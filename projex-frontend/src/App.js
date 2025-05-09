// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import WorkerDashboard from "./pages/WorkerDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import DirectorDashboard from "./pages/DirectorDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/worker" element={<WorkerDashboard />} />
        <Route path="/dashboard/manager" element={<ManagerDashboard />} />
        <Route path="/dashboard/director" element={<DirectorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
