import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/AUTH/Login';
import Landing from './components/LandingPage/landing';
import ProtectedRoute from './components/Route/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Default route redirects to /auth */}
          <Route path="/" element={<Navigate to="/auth" replace />} />

          {/* Auth route for login */}
          <Route path="/auth" element={<Login />} />

          {/* Protected route for landing page */}
          <Route
            path="/landing"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown routes to /auth */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
