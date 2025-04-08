import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleAuthRedirect = () => {
    console.log("dfahf;ha;hdkh;falkdla;hd");
    
    const navigate = useNavigate();

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");

            if (!code) {
                console.error("No authorization code found.");
                return navigate("/login"); // Redirect if there's no code
            }

            try {
                // Send auth code to backend to get access & refresh tokens
                const response = await fetch("http://localhost:8000/user/google/redirect", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code }),
                });

                const data = await response.json();

                if (data.accessToken && data.refreshToken) {
                    // Store tokens
                    localStorage.setItem("accessToken", data.accessToken);
                    localStorage.setItem("refreshToken", data.refreshToken);

                    console.log("Google login successful");
                    navigate("/dashboard"); // Redirect to the dashboard
                } else {
                    console.error("Authentication failed");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error during Google authentication:", error);
                navigate("/login");
            }
        };

        handleGoogleCallback();
    }, [navigate]);

    return <div>Logging in with Google...</div>;
};

export default GoogleAuthRedirect;
