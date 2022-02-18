import { useRef, useState } from "react";
import "./register.css";
import RoomIcon from "@mui/icons-material/Room";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";

export default function Register({ setShowRegister }) {
  const [success, setSucces] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("/users/register", newUser);
      setError(false);
      setSucces(true);
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };

  return (
    <div className="registerContainer">
      <div className="logo">
        <RoomIcon />
        <span>AmdadulPin</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" autoFocus placeholder="username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="registerBtn" type="submit">
          Register
        </button>
        {success && (
          <span className="success">Successfull. You can login now!</span>
        )}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <CancelIcon
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}
