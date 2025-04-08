import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import AuthCallback from "../pages/AuthCallback";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../pages/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Router>
     <Routes>
      <Route path="/login" element={<Signin />} />
      <Route path="/auth/google/callback" element={<AuthCallback />} />
      <Route path="/dashboard" element={
        // <ProtectedRoute>
          <Dashboard />
        // </ProtectedRoute>
      } />
      {/* Other routes */}
    </Routes>
    </Router>
  );
};

export default AppRoutes;
