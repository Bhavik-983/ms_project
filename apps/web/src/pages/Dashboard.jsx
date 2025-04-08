import axios from 'axios';
import React, { useEffect } from 'react';

function Dashboard() {
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get("http://localhost:8000/user/verify/user", {
        withCredentials: true, // ⬅️ VERY important for sending cookies
      });

      console.log("User Info:", response.data); // Full user object from JWT
    };
  
    fetchUser();
  }, []);

  return (
    <div>
      Welcome to the dashboard
    </div>
  );
}

export default Dashboard;
