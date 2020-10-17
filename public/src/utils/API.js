import axios from "axios";
import { toast } from "react-toastify";

const spider = axios.create({
  baseURL: "/",
   baseURL: "http://spider.nitt.edu/bonafide",
   baseURL: "http://localhost:3001/",
});

spider.interceptors.request.use(
  (config) => {
    const jwtToken = JSON.parse(localStorage.getItem("bonafideNITT2020user"));
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken.jwt}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

spider.interceptors.response.use(
  (res) => {
    if (res.status === 200) {
      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    return res;
  },
  (err) => {
    // console.log("toast");
    // if (err.status === 400)
    toast.error(err.response.data.message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    // },
    // (err) => {
    if (err.response && err.response.status === 403) {
      localStorage.removeItem("bonafideNITT2020user");
      window.location.replace("/");
    }
    return Promise.reject(err);
  }
);

export default spider;
