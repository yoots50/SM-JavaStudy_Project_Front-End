import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.removeItem("nickname");
    navigate("/");
  };
  return (
    <div className={styles.header}>
      <div className={styles.navbar}>
        <div
          className={styles.logo}
          onClick={() => {
            navigate("/");
          }}
        >
          <img src="../img/logo.svg" />
          <h1 className={styles.site_name}>SM-Chat</h1>
        </div>
        {localStorage.getItem("nickname") === null ? null : (
          <div className={styles.container}>
            <h1 className={styles.nickname}>환영합니다. {localStorage.getItem("nickname")}님.</h1>
            <button className={styles.logout} onClick={handleClick}>로그아웃</button>
          </div>
        )}
      </div>
    </div>
  );
}
