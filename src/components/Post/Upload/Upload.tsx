import axios from "axios";
import React, { useState } from "react";
import config from "../../../config";
import Cookies from "universal-cookie";

import './Upload.css';
import { useNavigate } from "react-router-dom";

const SingleFileUploader = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setStatus("initial");
      setFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setCaption(e.target.value);
  }

  const handleUpload = async () => {
    if (file) {
      setStatus("uploading");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);

      try {
        const cookie = new Cookies();
        const accessToken = cookie.get('access_token');
        const result = await axios.post(config.SERVER_URL + "/me/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          }
        });

        await result.data;

        setStatus("success");
        setTimeout(() =>{
          navigate('/feed');
        },1500);

      } catch (error) {
        console.error(error);
        setStatus("fail");
      }
    }
  };

  return (
    <>
    
    <div id='wideContainer' className="ui middle aligned center aligned grid">
  <div id='mainContainer' className="ui form container">
    <div className="one field">

      <div className="field">
        <label id='captionTitle'>Post Caption</label>
        <input onChange={handleInputChange} placeholder="Caption" type="text"/>
      </div>
    </div>

    <div className="input-group">
      
        <br/>
        <input id="file" type="file" onChange={handleFileChange} />
      </div>
      <br/>
    <button onClick={handleUpload} className="ui button large teal"> 
         <i className="file icon"></i>
         Upload Your Post
          </button>
  </div>
</div>

      

      <Result status={status} />
    </>
  );
};

const Result = ({ status }: { status: string }) => {
  if (status === "success") {
    return <p className="ui green label">✅ File uploaded successfully!</p>;
  } else if (status === "fail") {
    return <p className="ui red label">❌ File upload failed!</p>;
  } else if (status === "uploading") {
    return <p className="ui yellow label">⏳ Uploading selected file...</p>;
  } else {
    return null;
  }
};

export default SingleFileUploader;