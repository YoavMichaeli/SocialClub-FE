import { PostComment } from "./../components/Modal/CommentModal/CommentModal";
import axios from "axios";
import Cookies from "universal-cookie";
import { Post } from "../components/Post/Feed/Feed";
import config from "../config";

export const getUsersPosts = async (): Promise<Array<Post>> => {
  try {
    const cookie = new Cookies();
    const accessToken = cookie.get("access_token");
    const response = await axios.get(config.SERVER_URL + "/user/getAllUsersPosts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.posts;
  } catch (error: any) {
    console.log(`an error has occured: ${error}`);
    throw Error(error);
  }
};

export const getUserPosts = async (): Promise<Array<Post>> => {
  try {
    const cookie = new Cookies();
    const accessToken = cookie.get("access_token");
    const response = await axios.get(config.SERVER_URL + "/user/myposts", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.posts;
  } catch (error: any) {
    console.log(`an error has occured: ${error}`);
    throw Error(error);
  }
};

export const deleteUserPost = async (postId: string) => {
  try {
    const cookie = new Cookies();
    const accessToken = cookie.get("access_token");
    await axios.delete(config.SERVER_URL + `/me/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    console.log(`an error has occured: ${error}`);
    throw Error(error);
  }
};


export const getUser = async () => {
    try {
      const cookie = new Cookies();
      const accessToken = cookie.get("access_token");
      const response = await axios.get(config.SERVER_URL + `/user/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data.user;
    } catch (error: any) {
      console.log(`an error has occured: ${error}`);
      throw Error(error);
    }
  };

export const updateUserPost = async (
  postId: string,
  newCaption: string = "",
  newComment?: PostComment,
  authorId?: string
) => {
  try {
    const cookie = new Cookies();
    const accessToken = cookie.get("access_token");
    await axios.patch(
      config.SERVER_URL + `/me/post/${postId}`,
      {
        newCaption: newCaption,
        newComment: newComment,
        postAuthor: authorId
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.log(`an error has occured: ${error}`);
    throw Error(error);
  }
};


export const updateUserProfile = async (
    formData: any
  ) => {
    try {
      const cookie = new Cookies();
      const accessToken = cookie.get("access_token");
      await axios.patch(
        config.SERVER_URL + '/user/profile',
        formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            }
        }
      );
    } catch (error: any) {
      console.log(`an error has occured: ${error}`);
      throw Error(error);
    }
  };
  
