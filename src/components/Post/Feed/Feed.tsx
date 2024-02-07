import React, { useEffect, useMemo, useState } from "react";
import config from "../../../config";
import { deleteUserPost, getUserPosts, getUsersPosts } from "../../../services/UserService";
import Cookies from "universal-cookie";

import "./Feed.css";
import CommentModal from "../../Modal/CommentModal";
import EditModal from "../../Modal/EditModal";
import DeleteModal from "../../Modal/DeleteModal";

export interface Post {
  _id: string;
  author: string;
  authorID: string;
  static_url: string;
  type: string;
  caption: string;
  comments: Array<Object>;
  createdAt: Array<Object>;
  lastEditedAt: Array<Object>;
}

const PostsFeed: React.FC = () => {
  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };

  const cookie = new Cookies();
  const token: string = cookie.get("access_token");
  const decoded_token: any = parseJwt(token);
  let currentUsername: any;

  if (decoded_token) {
    currentUsername = decoded_token.user;
  }

  const [images, setImages] = useState<Array<Post>>([]);

  const fetchUserPosts = async () => {
    try {
      const posts = await getUsersPosts();
      setImages(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const handleCheckboxChange = async (event: any) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      try {
        const posts = await getUserPosts();
        setImages(posts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    } else {
      fetchUserPosts();
    }
  };

  const displayImages = useMemo(() => {
    return images.map((image: any) => {
      return (
        <div key={image._id} id="cards" className="ui special cards">
          <div className="card">
            <div className="blurring dimmable image">
              <div className="ui dimmer">
                <div className="content">
                  <div className="center">
                    <div className="ui inverted button">Add Friend</div>
                  </div>
                </div>
              </div>
              {image.type == "png" || image.type == "jpg" || image.type == "jpeg" ? (
                <img id="cardImage" key={image._id} src={config.SERVER_URL + image.static_url} alt="Something else" />
              ) : (
                <video id="cardImage" src={config.SERVER_URL + image.static_url} controls></video>
              )}
            </div>
            <div className="content">
              <label className="header">{image.caption}</label>
              <div className="meta">
                <span className="date">Uploaded by {image.author}</span>
              </div>
            </div>
            <div className="extra content">
              {currentUsername === image.author ? (
                <span>
                  <DeleteModal postId={image._id}  fetchUserPosts={fetchUserPosts}/>
                  <EditModal postId={image._id} fetchUserPosts={fetchUserPosts} authorId={image.authorID}/>
                </span>
              ) : null}

              <CommentModal
                postAuthor={image.author}
                post_static_url={image.static_url}
                comments={image.comments}
                imageType={image.type}
                postId={image._id}
                fetchUserPosts={fetchUserPosts}
                authorId={image.authorID}
              />
              <label>
                <i className="users icon"></i>
                {image.comments.length} Comments
              </label>
            </div>
          </div>
        </div>
      );
    });
  }, [images]);

  return (
    <div>
      <div className="ui toggle checkbox header">
        <input onChange={handleCheckboxChange} type="checkbox" name="public" />
        <label>Only my posts</label>
      </div>
      <div className="imageList"> {displayImages} </div>
    </div>
  );
};

export default PostsFeed;
