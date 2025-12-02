import React, { use, useEffect, useState } from "react";
import { nicknameCheck } from "../api/server";
import { useLocation, useNavigate } from "react-router-dom";

import styles from "./Home.module.css";

export default function Home() {
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (localStorage.getItem("nickname") !== null) {
      navigate("/chat");
      return;
    }
    const result = await nicknameCheck(value);
    if (result.name === "AxiosError") {
      setMsg("서버와의 연결 시간이 초과되었습니다. 다시 시도해주세요.");
    } else {
      localStorage.setItem("nickname", result.nickname);
      navigate("/chat");
    }
  };
  const location = useLocation();
  return (
    <div className={styles.contents}>
      <div className={`${styles.banner} ${styles.fade_in}`}>
        <img src="../img/sm-bg.jpg" className={styles.bg} alt=""/>
        <h2 className={styles.title}>SM-Chat</h2>
        <h3 className={styles.subtitle}>
          상명대학교 객체지향프로그래밍 팀 프로젝트
        </h3>
      </div>
      <button
        onClick={() => {
          localStorage.setItem("nickname", "DEV");
          navigate("/chat");
        }}
      >
        DEV {/* TEST용 버튼, 릴리즈 시 삭제할 것 */}
      </button>
      <form onSubmit={handleSubmit}>
        <div className={styles.input_area}>
          {localStorage.getItem("nickname") === null ? (
            <input
              placeholder="여기에 닉네임 입력"
              type="text"
              required={true}
              value={value}
              onChange={handleChange}
              className={styles.basic_input}
            />
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
