import axios from "axios";
import { toast } from "react-toastify";

const spider = axios.create({
  baseURL: "https://spider.nitt.edu/bonafide/",
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// spider.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
// spider.defaults.headers.post["Access-Control-Allow-Methods"] =
//   "GET, PUT, POST, DELETE, OPTIONS";

spider.interceptors.request.use(
  (config) => {
    const jwtToken = JSON.parse(localStorage.getItem("bonafideNITT2020user"));
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
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
      if (res.data.message === "Requested Successfully") {
        toast.success("Request sent Successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (res.data.message === "Invalid username/password Combination") {
        toast.error("Invalid username/password Combination", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (res.data.message === "Approved successfully") {
        toast.success("Approved successfully", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (
        res.data.message ===
        "There was some error uploading the file. Try again later"
      ) {
        toast.error("IError upoading file, try again later!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (res.data.message === "Please upload a file") {
        toast.error("Upload file before submitting! (Error 400)", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
    return res;
  },
  (err) => {
    if (err.response && err.response.status === 403) {
      localStorage.removeItem("bonafideNITT2020user");
      window.location.replace("/");
    }
    return Promise.reject(err);
  }
);

export default spider;
