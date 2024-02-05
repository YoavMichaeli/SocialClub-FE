import axios from "axios";
import config from "../config";
import { HttpStatusCode } from "axios";
import Cookies from "universal-cookie";

export class UserUnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = "UserUnauthorizedError";
    this.statusCode = statusCode; // You can customize the HTTP status code as needed
  }
}

export const newUserSignUp = async (formData: FormData) => {
  try {
    const cookie = new Cookies();
    const token = cookie.get('access_token');
    await axios.post(config.SERVER_URL + "/account/new", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`
      },
    });
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  }
};


export const newUserGoogleSignUp = async (userAccessToken: string) => {
    try {
      const response = await axios.post(config.SERVER_URL + "/account/newGoogleUser", {
        token: userAccessToken
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userAccessToken}`
        },
      });

      const { accessToken, refreshToken } = response.data;
      // Set cookies for access and refresh tokens
      document.cookie = `access_token=${accessToken}; path=/;`;
      document.cookie = `refresh_token=${refreshToken}; path=/;`;
      
    } catch (error: any) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    }
  };

export const loginUser = async (formData: FormData) => {
  try {
    const formDataObject: any = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    const response = await axios.post(config.SERVER_URL + "/account/getin", formDataObject, {
      headers: {
        "Content-Type": "application/json"
      },
    });
    const { accessToken, refreshToken } = response.data;
    // Set cookies for access and refresh tokens
    document.cookie = `access_token=${accessToken}; path=/;`;
    document.cookie = `refresh_token=${refreshToken}; path=/;`;

  } catch (error: any) {
    if (error.response.status === HttpStatusCode.Unauthorized) {
      throw new UserUnauthorizedError("Unauthorized, bad username or password!");
    } else if (error.response.status < HttpStatusCode.Ok || error.response.status >= HttpStatusCode.MultipleChoices) {
      throw new Error("Unknown error occured while trying to authorized user");
    }
  }
};


export const logoutUser = async (refresh_token: string) => {
    try {
      await axios.get(config.SERVER_URL + "/account/out", {
        headers: {
            Authorization: `Bearer ${refresh_token}`,
        },
      });
    } catch (error: any) {
      if (error.response.status === HttpStatusCode.Unauthorized) {
        throw new UserUnauthorizedError("Something is not valid with the given refresh token, user unauthorized");
      } else if (error.response.status < HttpStatusCode.Ok || error.response.status >= HttpStatusCode.MultipleChoices) {
        throw new Error("Unknown error occured while trying to authorized user");
      }
    }
  };


export const checkAccessTokenValidity = async (token: string) => {
    try {
      await axios.get(config.SERVER_URL + "/account", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      if (error.response.status === HttpStatusCode.Unauthorized) {
        return false;
      } else if (error.response.status === HttpStatusCode.NotFound) {
        return true;
      }
    }
  };


export const getNewAccessTokenAttempt = async (refresh_token: string) => {
    try {
        const response = await axios.get(config.SERVER_URL + "/account/refresh",  {
            headers: {
                Authorization: `Bearer ${refresh_token}`,
            },
        });
        const {accessToken, refreshToken} = response.data;
        // Set cookies for access and refresh tokens
        document.cookie = `access_token=${accessToken}; path=/;`;
        document.cookie = `refresh_token=${refreshToken}; path=/;`;
    
      } catch (error: any) {
        if (error.response.status === HttpStatusCode.Unauthorized) {
          throw new UserUnauthorizedError("Something is not valid with the given refresh token, user unauthorized");
        } else if (error.response.status < HttpStatusCode.Ok || error.response.status >= HttpStatusCode.MultipleChoices) {
          throw new Error("Unknown error occured while trying to authorized user");
        }
      }
};
