// Main App component for EchoNotes
// Sets up React Router with routes
// Routes: / (Landing), /dashboard (Dashboard), /lecture (LecturePage)
// Uses AuthProvider and ProtectedRoute for auth
// Uses BrowserRouter for routing

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LecturePage from './pages/LecturePage';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/lecture" 
              element={
                <ProtectedRoute>
                  <LecturePage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}