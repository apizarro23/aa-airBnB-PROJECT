import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "./Login.css";

function LoginForm() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password })).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  return (
        <div className="modal">
      <div>
        <h2 className="welcomeContainer"> Welcome to StairBnB </h2>
      </div>
      <form className="loginContainer" onSubmit={handleSubmit}>
        <div id="errors_login">
          {errors.map((error, idx) => (
            <div key={idx}>{error}</div>
          ))}
        </div>
        <label>
          {/* Email */}
          <input
            className="loginInput"
            type="text"
            value={credential}
            placeholder="Email"
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          {/* Password */}
          <input
            className="loginInput"
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button className="loginButton" type="submit">
          Log In
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
