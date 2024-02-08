import React from "react";
import Cookies from "universal-cookie";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import "./NavBar.css";
import { logoutUser } from "../../services/AuthService";
// import useAuth from "../../hooks/auth";

const NavBar = () => {
  // useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handlelogOut = async () => {
    const cookie = new Cookies();
    const refresh_token = cookie.get("refresh_token");
    try {
      await logoutUser(refresh_token);
      cookie.remove("access_token");
      cookie.remove("refresh_token");
      navigate("/");
    } catch (error: any) {
      console.log(`Logging out has failed, error: ${error.message}`);
    }
  };

  return (
    <div>
      {location.pathname !== "/" && location.pathname !== '/signUp'? (
        <div id="navbar" className="ui inverted teal menu">
          <div className="item">
            <NavLink className="ui inverted teal segment large" to="/feed">
              {" "}
              <a> SocialClub </a>{" "}
            </NavLink>
          </div>
          <NavLink className="item" to="/feed">
            {" "}
            <a> Feed </a>{" "}
          </NavLink>
          <NavLink className="item" to="/newPost">
            {" "}
            <a> New Post </a>{" "}
          </NavLink>
          <NavLink className="item" to="/profile">
            {" "}
            <a> Profile </a>{" "}
          </NavLink>
          <NavLink className="item" to="/explore">
            <a> Explore </a>{" "}
          </NavLink>
          <button onClick={handlelogOut} className="ui item right floated button">
            Log Out
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default NavBar;
