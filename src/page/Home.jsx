import React, { use, useEffect, useState } from "react";
import { auth, nicknameCheck } from "../api/server";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Home.module.css";

export default function Home() {
  const [formData, setformData] = useState({id:"", pw:""});
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (localStorage.getItem("nickname") !== null) {
      navigate("/chat");
      return;
    }
    console.log("value",formData);
    const result = await auth(formData);
    console.log(result);
    if (result.name === "AxiosError") {
      if (result.response === undefined) {
        setMsg("서버와의 연결 시간이 초과되었습니다. 다시 시도해주세요.");
      } else {
        setMsg(result.response.data);
      }
    } else {
      localStorage.setItem("nickname", result.username + " " + result.name);
      navigate("/chat");
    }
  };
  return (
    <div className={styles.contents}>
      <div className={`${styles.banner} ${styles.fade_in}`}>
        <img src="../img/sm-bg.jpg" className={styles.bg} alt="" />
        <h2 className={styles.title}>SM-Chat</h2>
        <h3 className={styles.subtitle}>
          상명대학교 객체지향프로그래밍 팀 프로젝트
        </h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.input_area}>
          {localStorage.getItem("nickname") === null ? (
            <div className={styles.input_box}>
              <input
                placeholder="id"
                type="text"
                required={true}
                value={formData.id}
                onChange={handleChange}
                className={styles.basic_input}
                name="id"
              />
              <input
                placeholder="pw"
                type = "password"
                required={true}
                value={formData.pw}
                onChange={handleChange}
                className={styles.basic_input}
                name="pw"
              />
            </div>
          ) : null}
          <button className={styles.enter_button}>접속</button>
        </div>
        <h4 className={`${styles.error_msg} ${styles.fade_in}`} key={msg}>
          {msg}
        </h4>
      </form>
    </div>
  );
}
