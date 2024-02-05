import React, { FormEvent, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { newUserSignUp } from "../../services/AuthService";

import "./SignUp.css";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const formDataObject: any = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    // Validate the form fields
    const isFormValid = Object.values(formDataObject).every((value: any) => value.trim() !== "");

    if (isFormValid && file) {
      formData.append("file", file);
    
      newUserSignUp(formData).then(() => {
        console.log("User had signed up successfully");
      });

      navigate("/");
    } else {
      setShowErrorPopup(true);
      setTimeout(() => {
        setShowErrorPopup(false);
      }, 3000);
    }
  };

  return (
    <div>
      <div id="signUpGrid" className="ui aligned grid">
        <div className="column">
          <h2 className="ui teal image header">
            <div className="content">SocialClub</div>
          </h2>
          <form className="ui large form" onSubmit={handleFormSubmit}>
            <div className="ui stacked segment">
              <div className="field left labeled">
                <label id="title" className="ui ">
                  First Name
                </label>
                <input type="text" name="firstname" placeholder="First Name" />
              </div>
              <div className="field left labeled">
                <label id="title" className="ui ">
                  Last Name
                </label>
                <input type="text" name="lastname" placeholder="Last Name" />
              </div>
              <div className="field">
                <label id="title" className="ui">
                  Username
                </label>
                <input type="text" name="username" placeholder="Your Username" />
              </div>
              <div className="field">
                <label id="title" className="ui">
                  Password
                </label>
                <input type="password" name="password" placeholder="Your Password" />
              </div>

              <div className="field">
                 <label id="title" className="ui">
                  Image Profile
                </label>
                <input id="file" type="file" onChange={handleFileChange} />
              </div>

              <button type="submit" className="ui fluid large teal button">
                Sign Up
              </button>
            </div>

            <div className="ui error message"></div>
          </form>
          <div className="ui message">
            Already a part of it?
            <NavLink className="item" to="/">
              <a className="authALink"> Login Now! </a>
            </NavLink>
          </div>
        </div>
      </div>

      {showErrorPopup && (
        <div className="ui negative message" style={{ opacity: 1, transition: "opacity 5s ease-out" }}>
          <div className="header">Please fill in all fields before submitting the form</div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
