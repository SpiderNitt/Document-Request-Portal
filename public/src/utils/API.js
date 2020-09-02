import axios from "axios";

export default axios.create({
  baseURL: "https://spider.nitt.edu/bonafide/",
  responseType: "json",
});
