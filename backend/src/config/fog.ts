import axios from "axios";

const fog = axios.create({
  baseURL: process.env.FOG_URL?.toString() ?? "",
});

export default fog;
