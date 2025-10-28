import React, { useState } from "react";
import { nicknameCheck } from "../api/server";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await nicknameCheck(value);
    console.log(result);
    if (result.name === "AxiosError") {
      setMsg("서버 에러 발생");
    } else {
      navigate("/chat");
      localStorage.setItem("nickname", result.nickname);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="nickName"
          type="text"
          required={true}
          value={value}
          onChange={handleChange}
        />
        <h1>{msg}</h1>
        <button>LogIn</button>
      </form>
    </div>
  );
}
