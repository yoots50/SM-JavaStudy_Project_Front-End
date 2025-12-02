import { useEffect, useRef, useState } from "react";
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
    const msgToSend = {
      type: "MESSAGE",
      message: value,
      nickname: nickname,
      date: null,
    };
    stompClientRef.current.send(
      "/app/send/messages",
      {},
      JSON.stringify(msgToSend)
    );
    setValue(""); // 전송 후 입력창을 비우는 로직
  };

  useEffect(() => {
    if (localStorage.getItem("nickname") === null) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    const socket = new SockJS(
      `http://${process.env.REACT_APP_SERVER_IP}:8080/ws`
    );
    const client = over(socket);
    stompClientRef.current = client;

    const onConnected = () => {
      const stompClient = stompClientRef.current;
      const enterMsg = {
        type: "ENTER",
        message: `${nickname}님이 입장하셨습니다.`,
        nickname: nickname,
        date: null,
      };
      if (stompClient) {
        stompClient.subscribe("/topic/messages", (message) => {
          const received = JSON.parse(message.body);
          var chatMessage = "";
          if (received.type === "ENTER" || received.type === "LEAVE") {
            chatMessage = received.message;
          } else if (received.type === "MESSAGE") {
            chatMessage = `${received.nickname} : ${received.message}`;
          } else {
            chatMessage = "unknown message type";
          }

          setChats((prev) => [...prev, `${chatMessage}`]);
          console.log(received);
        });

        stompClient.subscribe("/topic/users", (message) => {
          const userList = JSON.parse(message.body);
          setUsers(userList);
        });

        client.send("/app/send/users", {}, JSON.stringify(enterMsg));
        client.send("/app/send/messages", {}, JSON.stringify(enterMsg));
      }
    };

    const onError = (error) => {
      console.error("WebSocket connection error:", error);
    };

    client.connect({}, onConnected, onError);

    return () => {
      if (stompClientRef.current) {
        const leaveMsg = {
          type: "LEAVE",
          message: `${nickname}님이 퇴장하셨습니다.`,
          nickname: nickname,
          date: null,
        };
        stompClientRef.current.send(
          "/app/send/users",
          {},
          JSON.stringify(leaveMsg)
        );
        stompClientRef.current.send(
          "/app/send/messages",
          {},
          JSON.stringify(leaveMsg)
        );
        stompClientRef.current.disconnect();
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className={styles.contents}>
      <div className={styles.container}>
        <div className={styles.blank}></div>
        <div className={styles.chat_area}>
          <img src="../img/chat-background.png" className={styles.chat_logo} alt=""/>
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
