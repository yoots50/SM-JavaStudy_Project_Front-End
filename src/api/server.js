import axios from "axios";

export async function nicknameCheck(nickname) {
  const URL = `http://${process.env.REACT_APP_SERVER_IP}:8080/user/nickname`;
  return await axios
    .post(URL, null, {params: {nickname}})
    .then((r) => r.data)
    .catch((e) => e);
}