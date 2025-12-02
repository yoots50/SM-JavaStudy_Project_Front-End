import React, { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { over } from "stompjs";

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
    const msgToSend = {
      type: "MESSAGE",
      message: value,
      nickname: nickname,
    };
    stompClientRef.current.send(
      "/app/send/messages",
      {},
      JSON.stringify(msgToSend)
    );
    setValue(""); // 전송 후 입력창을 비우는 로직
  };
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const client = over(socket);
    stompClientRef.current = client;

    const onConnected = () => {
      const stompClient = stompClientRef.current;
      const enterMsg = {
        type: "ENTER",
        message: `${nickname}님이 입장하셨습니다.`,
        nickname: nickname,
      };
      if (stompClient.current) {
        stompClient.subscribe("/topic/messages", (message) => {
          const received = JSON.parse(message.body);
          setChats((prev) => [
            ...prev,
            `${received.nickname}: ${received.message}`,
          ]);
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
        };
        stompClientRef.current.send(
          "/app/send/users",
          {},
          JSON.stringify(leaveMsg)
        );
        stompClientRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input></input>
        placeholder="type message here" type="text" value={value}
        onChange={handleChange}
        />
        <button>send</button>
      </form>
      {users && users.map((user) => <h1>{user}</h1>)} {/* 접속한 유저 리스트 */}
      {chats && chats.map((chat) => <h1>{chat}</h1>)} {/* 채팅 내용 */}
    </div>
  );
}
