import axios from "axios";

export async function auth(value) {
  const URL = `http://${process.env.REACT_APP_SERVER_IP}:8080/user/auth`;
  return await axios
    .post(URL, null, {params: value})
    .then((r) => r.data)
    .catch((e) => e);
}