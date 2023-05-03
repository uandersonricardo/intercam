import axios from "axios";

const fog = axios.create({
  baseURL: "http://localhost:5000",
});

export default fog;
