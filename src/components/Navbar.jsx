import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.removeItem("nickname");
    navigate("/");
  };
  return (
    <div>
      <div>
        <img src="" />
        <h1>SM-Chat</h1>
      </div>
      {localStorage.getItem("nickname") === null ? null : (
        <button onClick={handleClick}>LogOut</button>
      )}
    </div>
  );
}
