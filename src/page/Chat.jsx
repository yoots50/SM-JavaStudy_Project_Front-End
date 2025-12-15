import { useEffect, useRef, useState } from "react";
import styles from "./Chat.module.css";
import {
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
} from "../api/server";

export default function Chat() {
  const [chats, setChats] = useState([]); // 유저가 입력할 채팅 내용
  const [value, setValue] = useState(""); // 입력창의 값
  const [users, setUsers] = useState([]); // 접속한 유저 리스트
  const stompClientRef = useRef(null); // stompClient를 담을 ref
  const nickname = localStorage.getItem("nickname"); // 유저가 입력한 닉네임

  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 새로고침 방지
    sendMessage({ nickname, value });
    setValue(""); // 전송 후 입력창을 비우는 로직
  };

  const autoScrollToBottom = () => {
    const chatScroll = document.querySelector(`.${styles.chat}`);
    if (
      chatScroll.scrollTop >=
      chatScroll.scrollHeight - chatScroll.clientHeight
    )
      setTimeout(() => {
        chatScroll.scrollTop =
          chatScroll.scrollHeight - chatScroll.clientHeight;
      }, 1);
  };

  useEffect(() => {
    if (localStorage.getItem("nickname") === null) {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    connectWebSocket({
      setChats,
      setUsers,
      setstompClient: (client) => {
        stompClientRef.current = client;
      },
      autoScrollToBottom,
      chatScroll: document.querySelector(`.${styles.chat}`),
    });

    return () => {
      disconnectWebSocket({
        nickname,
      });
    };
  }, []);
  return (
    <form onSubmit={handleSubmit} className={styles.contents}>
      <div className={styles.container}>
        <div className={styles.blank}></div>
        <div className={styles.chat_area}>
          <img
            src="../img/chat-background.png"
            className={styles.chat_logo}
            alt=""
          />
          <div className={styles.chat}>
            {chats &&
              chats.map((chat) => <h1 className={styles.msg_box}>{chat}</h1>)}
          </div>
        </div>
        <div className={styles.users}>
          {users &&
            users.map((user) => <h1 className={styles.msg_box}>{user}</h1>)}
        </div>
      </div>
      <div className={styles.input_area}>
        <input
          placeholder="type message here"
          type="text"
          value={value}
          onChange={handleChange}
          className={styles.basic_input}
        />
        <button className={styles.enter_button}>send</button>
      </div>
      <div className={styles.users_under}>
        {users &&
          users.map((user) => <h1 className={styles.msg_box}>{user}</h1>)}
      </div>
    </form>
  );
}
