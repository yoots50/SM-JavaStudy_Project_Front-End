import axios from "axios";
import { useRef } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

export async function auth(value) {
  const URL = `http://${process.env.REACT_APP_SERVER_IP}:8080/user/auth`;
  return await axios
    .post(URL, null, { params: value })
    .then((r) => r.data)
    .catch((e) => e);
}

let stompClient = null;

export async function connectWebSocket({ setChats, setUsers, setstompClient, chatDiv }) {
  const nickname = localStorage.getItem("nickname"); // 유저가 입력한 닉네임
  const socket = new SockJS(
    `http://${process.env.REACT_APP_SERVER_IP}:8080/ws`
  );
  stompClient = over(socket);
  setstompClient(stompClient);
  const onConnected = () => {
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
        setTimeout(() => {
          chatDiv.scrollTop = chatDiv.scrollHeight;
        }, 1);
      });

      stompClient.subscribe("/topic/users", (message) => {
        const userList = JSON.parse(message.body);
        setUsers(userList);
      });

      stompClient.send("/app/send/users", {}, JSON.stringify(enterMsg));
      stompClient.send("/app/send/messages", {}, JSON.stringify(enterMsg));
    }
  };

  const onError = (error) => {
    console.error("WebSocket connection error:", error);
  };

  stompClient.connect({}, onConnected, onError);
}

export async function disconnectWebSocket({ nickname }) {
  if (stompClient) {
    const leaveMsg = {
      type: "LEAVE",
      message: `${nickname}님이 퇴장하셨습니다.`,
      nickname: nickname,
      date: null,
    };
    stompClient.send("/app/send/users", {}, JSON.stringify(leaveMsg));
    stompClient.send("/app/send/messages", {}, JSON.stringify(leaveMsg));
    stompClient.disconnect();
  }
}

export async function sendMessage({ value, nickname }) {
  const msgToSend = {
    type: "MESSAGE",
    message: value,
    nickname: nickname,
    date: null,
  };
  stompClient.send(
    "/app/send/messages",
    {},
    JSON.stringify(msgToSend)
  );
}
