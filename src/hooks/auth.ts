import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";

import { checkAccessTokenValidity, getNewAccessTokenAttempt, UserUnauthorizedError } from "../services/AuthService";

const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Assuming you have a function to check the validity of the access token
        const cookies = new Cookies();
        const accessToken = cookies.get("access_token");
        const refreshToken = cookies.get("refresh_token");
        if (!accessToken) {
          navigate("/");
        } else {
          const isValidToken = await checkAccessTokenValidity(accessToken);
          const currentRoute = location.pathname;
          if (!isValidToken) {
            try {
                await getNewAccessTokenAttempt(refreshToken);
                if (currentRoute === "/") {
                    navigate("/feed");
                  }
            } catch (error: any) {
                 navigate("/");
            }
          } else if (currentRoute === "/") {
            navigate("/feed");
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        // Handle errors as needed
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  return null; // This hook doesn't render any UI elements
};

export default useAuth;