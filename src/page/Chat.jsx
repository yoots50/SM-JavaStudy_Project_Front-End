import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client"; // 
import { over } from "stompjs";

let stompClient = null; // 이곳에 over함수를 통해 SockJS함수의 socket을 client로 받아 넣음

export default function Chat() {
  const [chat, setChat] = useState([]); // 유저들의 채팅 내용을 가진 리스트, 리스트 안에는 {type: ..., message: ..., nickname: ...}와 같은 UserDTO의 형태를 띄는 객체가 들어간다.
  const [value, setValue] = useState(""); // 유저가 보낼 메시지 내용
  const [isConnected, setIsConnected] = useState(false); // 유저가 stompClient에 접속했는지 여부를 저장
  const nickname = localStorage.getItem("nickname"); // 유저가 입력한 닉네임을 로컬 스토리지에서 뽑아옴
  const handleChange = (e) => { // 유저가 input태그로 메시지를 입력할 시 value를 바꾸기 위함
    setValue(e.target.value); // input 태그 속 값을 value에 넣음
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // submit을 하면 새로고침이 되는 것을 방지
    // 메세지를 서버로 전송하는 로직을 작성할 것
    // messageType는 MESSAGE로 할 것
    // 메세지를 서버로 전송했다면 setValue
  };
  // useEffect를 통해 서버와 연결하는 로직 작성
  // 서버와 연결할 시 messageType를 ENTER로 하는 ChatDTO 전송, message는 null로 할 것
  // 서버와 연결이 끊어질 시 messageType를 LEAVE로 하는 chatDTO 전송, message는 null로 할 것
  // SockJs와 stompjs의 over함수, isConnected, stompClient 등을 사용 할 것
  return (
    <div>
      <form onSubmit={handleSubmit}> {/* send 버튼을 누를 시 handleSubmit이 작동 */}
        <input
          placeholder="type message here"
          type="text"
          value={value}
          onChange={handleChange}
        /> {/* 유저가 메시지를 입력 할 수 있는 input태그 */}
        <button>send</button> {/* 유저가 send 버튼을 누를 시 handleSubmit이 실행된다. */}
      </form>
      {/* 이곳에 chat 안에 있는 유저들의 채팅 내용을 html 태그로 변환하여 보여준다. chat 안에는 UserDTO 형식의 객체가 있으므로 이를 활용한다.*/}
    </div>
  );
}
