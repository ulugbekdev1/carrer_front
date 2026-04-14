import axios from "axios";
// const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE1MzU1MjI3LCJpYXQiOjE3MTUzNTIyMjcsImp0aSI6ImEzZjEwN2RiNzdiNDQ1ODQ4MTIwMGJjOTBkMjk1MDgzIiwidXNlcl9pZCI6MX0.qix4yck5cU7qXcvZhKKXTpQKNo8pEaexEpTnOa02u1s"
const baseUrl = "api_api";

const getAuthToken = () => {
  try {
    const register = JSON.parse(localStorage.getItem("register") || "null");
    return register?.access;
  } catch (error) {
    console.error("Error parsing register data:", error);
    return null;
  }
};

export const ApiServices = {
  async getData(url) {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }
    
    try {
      const response = await axios({
        method: "get",
        url: `${baseUrl}${url}`,
        headers: {
          "accept": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem("register");
        throw new Error("Authentication failed. Please login again.");
      }
      throw error;
    }
  },
  
  async postData(url, body) {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }
    
    try {
      const response = await axios({
        method: "POST",
        url: `${baseUrl}${url}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(body),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("register");
        throw new Error("Authentication failed. Please login again.");
      }
      throw error;
    }
  },
  
  async putData(url, body) {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }
    
    try {
      const response = await axios({
        method: "PUT",
        url: `${baseUrl}${url}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: JSON.stringify(body),
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("register");
        throw new Error("Authentication failed. Please login again.");
      }
      throw error;
    }
  },
  
  async delData(url) {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }
    
    try {
      const response = await axios({
        method: "DELETE",
        url: `${baseUrl}${url}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("register");
        throw new Error("Authentication failed. Please login again.");
      }
      throw error;
    }
  },
};
