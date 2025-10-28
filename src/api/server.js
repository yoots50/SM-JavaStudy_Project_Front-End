import axios from "axios";

export async function nicknameCheck(nickname) {
  const URL = "http://localhost:8080/user/nickname";
  return await axios
    .post(URL, null, {params: {nickname}})
    .then((r) => r.data)
    .catch((e) => e);
}