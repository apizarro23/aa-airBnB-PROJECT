import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const errors = [];
  }, [errors]);

  if (sessionUser) return <Redirect to="/" />;

  // const validations = () => {
  //   const errors = [];
  //   if (email.length < 5)
  //     errors.push("Review character count must be 5 or greater");
  //   if (stars > 5 || stars < 1)
  //     errors.push("Please enter a number from 1 to 5 stars");
  //   return errors;
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(
        sessionActions.signup({
          firstName,
          lastName,
          email,
          username,
          password,
        })
      ).catch(async (res) => {
        const data = await res.json();
        if (data) {
          setErrors(data);
          // setErrors((prev) => [...prev, data.errors])
        }
        return;
      });
    }

    // setErrors([
    //   "User with that email already exists",
    // ]);

    setErrors((prev) => [
      ...prev,
      "Confirm Password field must be the same as the Password field",
    ]);
  };
  console.log(errors, "errors");
  return (
    <div className="formDiv">
      <h2 className="signUp">Sign Up</h2>
      <form className="signUpForm" onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          <input
            placeholder="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            placeholder="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            placeholder="Email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            placeholder="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button className="signUpButton" type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormPage;
