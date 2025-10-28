import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

export default function Chat() {
  const [chat, setChat] = useState([]); // 유저가 입력할 채팅 내용
  const [value, setValue] = useState("");
  const nickname = localStorage.getItem("nickname"); // 유저가 입력한 닉네임
  const [stompClient, setStompClient] = useState(null);
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 메세지를 서버로 전송하는 로직을 작성할 것
    // messageType는 MESSAGE로 할 것
    const msgToSend = { type: "MESSAGE", message: value, nickname: nickname };
    stompClient.send("/app/send", {}, JSON.stringify(msgToSend));
    setValue("");
  };
  // useEffect를 통해 서버와 연결하는 로직 작성
  // 서버와 연결할 시 messageType를 ENTER로 하는 ChatDTO 전송
  // 서버와 연결이 끊어질 시 messageType를 LEAVE로 하는 chatDTO 전송
  useEffect(() => {
    const ws = new SockJS("http://localhost:8080/ws");
    setStompClient(over(ws));
    if (stompClient !== null) {
      const leaveMessage = { type: "LEAVE", message: null, nickname: nickname };
      const welcomeMessage = {
        type: "ENTER",
        message: null,
        nickname: nickname,
      };
      stompClient?.connect({}, () => {
        console.log("connected");
        stompClient?.send("/app/send", {}, JSON.stringify(welcomeMessage));
        stompClient?.subscribe("/topic/messages", (message) => {
          console.log(message);
        });
      });
      return stompClient?.send("/app/send", {}, JSON.stringify(leaveMessage));
    }
  }, []);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="type message here"
          type="text"
          value={value}
          onChange={handleChange}
        />
        <button>send</button>
      </form>
    </div>
  );
}
