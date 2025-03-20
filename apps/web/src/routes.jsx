import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
// import Profile from "./pages/Profile";

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/profile/:id" element={<Profile />} /> */}
    </Routes>
  );
};

export default RoutesComponent;
