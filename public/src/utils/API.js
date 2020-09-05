import axios from "axios";

const spider = axios.create({
  // baseURL: "https://spider.nitt.edu/bonafide/",
  baseURL: 'http://localhost:3001/',
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
