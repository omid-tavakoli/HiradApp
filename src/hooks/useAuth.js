import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import useApi from "./useApi";

const cookies = new Cookies(null, { path: "/" });

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { updateUser } = useUser();
  
  const navigate = useNavigate();
  
  const request = useApi();
  
  useEffect(() => {
    const storedUser = cookies.get("hirad");
    if (storedUser) {
      setUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);
  
  const getUserInfo = async (id, token) => {
    const { data } = await request.apiCall(
      "get",
      `User/GetUserInfo/${id || user?.userId}`,
      undefined,
      {
        Authorization: `Bearer ${token || user?.accessToken?.access_token}`,
      }
    );
    updateUser(data);

    return data?.data;
  };

  const userLogin = async (loginData) => {
    setUser(loginData);
    cookies.set("hirad", loginData, { path: "/" });

    try {
      getUserInfo(loginData?.userId, loginData?.accessToken?.access_token);
      setIsLoggedIn(true);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  const userLogout = () => {
    setUser(null);
    cookies.remove("hirad", { path: "/" });
    updateUser(null);
    setIsLoggedIn(false);
    navigate("/");
  };

  return {
    userLogin,
    userLogout,
    isLoggedIn,
    user,
    refreshUser: () => getUserInfo(),
  };
};

export default useAuth;
