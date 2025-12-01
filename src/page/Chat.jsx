import React, { use, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

import styles from "./Chat.module.css";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const navigate = useNavigate();
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
    // !!!!! 코드 작성하는 곳 !!!!!
    // 메세지를 서버로 전송하는 로직을 작성할 것
    // 전송할 때는 stompClientRef.current.send를 사용할 것
    // 전송할 때의 형식은 ChatDTO 형태로 보낼 것 {type, message, nickname}
    // type은 MESSAGE, message는 유저가 입력한 값, nickname은 유저의 닉네임
    // 예시)
    // const msgToSend = {type: "MESSAGE", message: value, nickname: nickname};
    // messageType는 MESSAGE로 할 것
    // send할 때는 JSON.stringify(msgToSend)를 사용할 것
    // send할 destination은 "/app/send/messages"로 할 것
    setValue(""); // 전송 후 입력창을 비우는 로직
  };

  useEffect(() => {
    if (localStorage.getItem("nickname") === null) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    // !!!!! 코드 작성하는 곳 !!!!!
    // useEffect안에 통해 서버와 연결하고 연결을 끊는 로직 작성
    // 서버와 연결할 시 messageType를 ENTER로 하는 ChatDTO 전송
    // 서버와 연결이 끊어질 시 messageType를 LEAVE로 하는 chatDTO 전송
    // stompClientRef.current를 통해 stompClient에 접근 가능
    // 서버와 연결할 땐 stompClientRef.current.connect({}, onConnected, onError);을 사용
    // 연결이 끊어질 땐 stompClientRef.current.disconnect();를 사용
    // onConnected 함수 안에서 "/topic/messages"와 "/topic/users"를 구독하고
    // 구독한 후 "/topic/messages"로부터 메세지를 받으면 chat 상태를 업데이트
    // "/topic/users"로부터 유저 리스트를 받으면 users 상태를 업데이트
    // onConnected 함수가 실행되면 서버로 ENTER 메시지를 전송
    // 구독은 stompClientRef.current.subscribe을 사용
    // 메시지를 전송할 때는 JSON.stringify(msgToSend)를 사용
    // 메시지를 받을 때는 JSON.parse(message.body)를 사용
    // disconnect 함수는 useEffect가 return할 때 작성
    // disconnect 함수를 쓰기 전 서버로 LEAVE 메시지를 전송
    // ENTER, LEAVE 메시지를 send할 destination은 "/app/send/users"로 할 것
  }, []);

  useEffect(() => {
    // !!!!! TEST 코드, 릴리즈 시 삭제할 것 !!!!
    setChats((prev) => {
      for (let i = 0; i < 10; i++) {
        prev.push("Hello world " + i);
      }
      return [...prev];
    });
    setUsers((prev) => {
      for (let i = 0; i < 5; i++) {
        prev.push("User " + i);
      }
      return [...prev];
    });
  }, []);

  return (
    <form onSubmit={handleSubmit} className={styles.contents}>
      <div className={styles.container}>
        <div className={styles.blank}></div>
        <div className={styles.chat_area}>
          <img src="../img/chat-background.png" className={styles.chat_logo} />
          <div className={styles.chat}>
            {chats &&
              chats.map((chat) => (
                <h1 className={styles.msg_box}>{chat}</h1>
              ))}{" "}
            {/* 채팅 내용 */}
          </div>
        </div>
        <div className={styles.users}>
          {users &&
            users.map((user) => (
              <h1 className={styles.msg_box}>{user}</h1>
            ))}{" "}
          {/* 접속한 유저 리스트 */}
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
            users.map((user) => (
              <h1 className={styles.msg_box}>{user}</h1>
            ))}{" "}
          {/* 접속한 유저 리스트 */}
        </div>
    </form>
  );
}
