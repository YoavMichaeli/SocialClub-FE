import { useGoogleLogin } from "@react-oauth/google";
import React, { FormEvent, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/auth";
import { loginUser, newUserGoogleSignUp, UserUnauthorizedError } from "../../services/AuthService";

import "./Login.css";

interface User {
  access_token: string
};

const Login = () => {
  useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);

  const [user, setUser] = useState<any>(null);

  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  const handleGoogleLogin = async (user: User) => {
    console.log(user.access_token);
    await newUserGoogleSignUp(user.access_token);
    setUser(null);
    navigate('/feed');
  };

  useEffect(() => {
    if (user) {
        handleGoogleLogin(user);
    }
  }, [user]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const formDataObject: any = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    const showPopUp = (message: string) => {
      setErrorMessage(message);
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000);
    };

    // Validate the form fields
    const isFormValid = Object.values(formDataObject).every((value: any) => value.trim() !== "");

    if (isFormValid) {
      try {
        await loginUser(formData);
        navigate("/feed");
      } catch (error: any) {
        if (error instanceof UserUnauthorizedError) {
          showPopUp(error.message);
        } else {
          showPopUp(error.message);
        }
      }
    } else {
      showPopUp("Please fill in username AND password fields");
    }
  };

  return (
    <div>
      <div id="loginContainer" className="ui middle aligned center aligned grid">
        <div className="column">
          <h2 className="ui teal image header">
            <div className="content">SocialClub</div>
          </h2>
          <form className="ui large form" onSubmit={handleFormSubmit}>
            <div className="ui stacked segment">
              <div className="field">
                <div className="ui left icon input">
                  <i className="user icon"></i>
                  <input type="text" name="username" placeholder="Username" />
                </div>
              </div>
              <div className="field">
                <div className="ui left icon input">
                  <i className="lock icon"></i>
                  <input type="password" name="password" placeholder="Password" />
                </div>
              </div>
              <button type="submit" className="ui fluid large teal submit button">
                Login
              </button>
            </div>

            <div className="ui error message"></div>
          </form>
          <div className="ui message">
            Don't have Social Club account?{" "}
            <NavLink className="item" to="/signUp">
              {" "}
              <a className="authALink"> Sign Up! </a>{" "}
            </NavLink>
          </div>
          <button className="fluid ui button " onClick={() => login()}>
            Sign in with Google 🚀{" "}
          </button>
        </div>
      </div>
      {showErrorPopup && (
        <div className="ui negative message" style={{ opacity: 1, transition: "opacity 5s ease-out" }}>
          <div className="header">{errorMessage}</div>
        </div>
      )}
    </div>
  );
};

export default Login;
