import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

let stompClient = null;

export default function Chat() {
  const [chat, setChat] = useState([]); // 유저가 입력할 채팅 내용
  const [value, setValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const nickname = localStorage.getItem("nickname"); // 유저가 입력한 닉네임
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
  const onConnected = () => {
    setIsConnected(true);
    if (stompClient && isConnected)
      stompClient.subscribe("/topic/messages", (message) => {
        console.log(message);
      });
  };
  useEffect(() => {
    const ws = new SockJS("http://localhost:8080/ws");
    stompClient = over(ws);

    const leaveMessage = { type: "LEAVE", message: null, nickname: nickname };
    const welcomeMessage = {
      type: "ENTER",
      message: null,
      nickname: nickname,
    };

    stompClient.connect({}, onConnected, (err) => {
      console.log(err);
    });
    return () => {
      if (stompClient && isConnected) stompClient.disconnect();
    };
  }, [nickname]);
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
