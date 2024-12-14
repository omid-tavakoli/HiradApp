import { useState, useEffect } from "react";
import axios from "axios";

import toast from "react-hot-toast";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/" });

const useApi = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL + "api/",
  });

  api.interceptors.request.use(
    (request) => {

      request.headers["Authorization"] = `Bearer ${
        cookies.get("hirad", { path: "/" })?.accessToken?.access_token
      }`;
      return request;
    },

    (error) => {
      console.error(error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const apiCall = async (method, url, data = null, headers) => {
    try {
      setLoading(true);
      const response = await api({
        method,
        url,
        data,
        headers,
      });
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error);
      if (error?.response?.data?.data?.GeneralError?.length) {
        toast.error(error?.response?.data?.data?.GeneralError[0]);
      }

      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { apiCall, loading, error };
};

export default useApi;
