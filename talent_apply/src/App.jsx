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
          <Route path="/auth" element={<Login />} />
          {/* <Route path="/signin" element={<SignIn />} /> */}


          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          />

          {/* Redirect to landing page for other paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
