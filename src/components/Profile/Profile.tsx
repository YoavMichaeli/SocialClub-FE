import React, { useEffect, useState } from "react";
import config from "../../config";
import { getUser, updateUserProfile } from "../../services/UserService";

interface User {
  imageUrl: string;
  firstName: string;
  lastName: string;
}

const Profile = () => {
  const [userData, setUserData] = useState<User>({ imageUrl: "", firstName: "", lastName: "" });
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const fetchUserData = async () => {
    const user = await getUser();
    setUserData({ imageUrl: user.profile_pic, firstName: user.firstname, lastName: user.lastname });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);



    const formDataObject: any = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    if (file) {
        formData.append('file', file);
    }

    // Validate the form fields
    const isFormValid = Object.values(formDataObject).some((value: any) => value.trim() !== "") || file;

    if (isFormValid) {
      await updateUserProfile(formData);
      fetchUserData();
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
          <div><img id="cardImage" src={userData.imageUrl.startsWith('https') ? userData.imageUrl: config.SERVER_URL + userData.imageUrl} alt="Something else" /></div>
          <input id="file" type="file" onChange={handleFileChange} />
          <br />
          <br />
          <br />
          <form className="ui large form" onSubmit={handleFormSubmit}>
            <div className="ui stacked segment">
              <div className="field left labeled">
                <label id="title" className="ui ">
                  First Name
                </label>
                <input type="text" name="firstname" placeholder={userData.firstName} />
              </div>
              <div className="field left labeled">
                <label id="title" className="ui ">
                  Last Name
                </label>
                <input type="text" name="lastname" placeholder={userData.lastName} />
              </div>

              <button type="submit" className="ui fluid large teal button">
                Update Profile
              </button>
            </div>
            {showErrorPopup && (
              <div className="ui negative message" style={{ opacity: 1, transition: "opacity 5s ease-out" }}>
                <div className="header">Please fill in at least 1 of the fields to update your profile</div>
              </div>
            )}

            <div className="ui error message"></div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
