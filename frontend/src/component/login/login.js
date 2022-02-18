import { useRef, useState, useEffect } from "react";
import RoomIcon from "@mui/icons-material/Room";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import "./login.css";

export default function Login({ setShowLogin, myStorage, setCurrentUser }) {
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post("/users/login", user);
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setError(false);
      setShowLogin(false);
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };
  return (
    <div className="loginContainer">
      <div className="logo">
        <RoomIcon />
        <span>AmdadulPin</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={nameRef} />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="loginBtn" type="submit">
          Login
        </button>
      </form>
      {error && <span className="failure">Something went wrong!</span>}
      <CancelIcon className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}
