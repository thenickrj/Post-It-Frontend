import axios from "axios";
import React, { useState } from "react";
import { Redirect, useHistory } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import signIn from "../images/signIn.svg";

const Container = styled.div`
  * {
    font-family: "Poppins", sans-serif;
  }

  .login {
    width: 30%;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
      rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
      rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
    min-width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 20px;
    position: relative;
    z-index: 99;
    margin: auto;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    box-shadow: 0px 0px 12px 2px rgba(15, 15, 15, 0.2);
    border-radius: 4px;
    position: relative;
    z-index: 99;
    width: 100%;
    height: 100%;
    z-index: 99;
    padding: 17px 10px;
    /* //transition: transform 200ms ease-in-out; */
  }

  .right-side {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 90%;
    background-color: #3498db;
    width: 100%;
    position: absolute;
    border-radius: 6px;
    z-index: 1;
    transition: all 400ms ease-in-out;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }

  .right-side.right {
    right: -40%;
  }

  .right-side:hover {
    margin: 0 -5% 0 -5%;
  }

  .right-side.left {
    right: 40%;
    align-items: flex-start;
  }

  .right-side.left:hover {
    right: 45%;
  }

  .text {
    font-size: 21px;
    font-weight: 500;
    color: #fff;
  }

  .login_container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .header {
    font-size: 24px;
  }

  .content {
    display: flex;
    flex-direction: column;
  }

  .log_img_contain {
    width: 400px;
    margin-left: -48px;
  }

  .log_img {
    height: 135px;
    margin-left: -15px;
  }

  .form {
    margin-top: 2em;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: fit-content;
  }

  .inLabel {
    font-size: 20px;
  }

  .login_input {
    margin-top: 6px;
    min-width: 18em;
    height: 37px;
    padding: 0px 10px;
    font-size: 16px;
    background-color: #cfcfcf9c;
    border: 0;
    border-radius: 4px;
    margin-bottom: 31px;
    transition: all 250ms ease-in-out;
  }

  .login_input:focus {
    outline: none;
    box-shadow: 0px 0px 12px 0.8px #0e81ce96;
  }

  .loginButton {
    font-size: 21px;
    padding: 5px 20px;
    border: 0;
    background-color: #3498db;
    color: #fff;
    border-radius: 3px;
    transition: all 250ms ease-in-out;
    cursor: pointer;
  }

  .loginButton:hover {
    background-color: #2386c8;
  }

  .loginButton:focus {
    outline: none;
  }

  .alert {
    position: relative;
    padding: 5px 5px;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
  }

  a {
    color: cornflowerblue;
  }

  .alert-danger {
    color: #842029;
    background-color: #f8d7da;
    border-color: #f5c2c7;
  }

  .error_input {
    width: fit-content;
    height: 30px;
    /* margin: auto; */
    top: 1vw;
    position: relative;
  }

  .login_redirect {
    margin-top: 3%;
    padding: 4px;
    text-align: center;
  }
`;

function SignUp() {
  const [email, setEmail] = useState();
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();

  const [errorMsg, setErrorMsg] = useState();
  const [errorStatus, setErrorStatus] = useState(false);

  const [loginRedirect, setLoginRedirect] = useState(false);

  let history = useHistory();

  function validateEmail(emailCheck) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(emailCheck).toLowerCase());
  }

  function register() {
    console.log("S");
    if (
      validateEmail(email) &&
      email !== "" &&
      userName !== "" &&
      password !== "" &&
      email !== undefined &&
      password !== undefined &&
      userName !== undefined
    ) {
      const data = {
        name: userName,
        email: email,
        password: password,
      };
      console.log(data);
      axios
        .post("https://just-post--it.herokuapp.com/signup", data)
        .then((res) => {
          if (res.data === "Account already exist") {
            setErrorMsg(res.data);
            setErrorStatus(true);
          } else {
            setErrorStatus(false);
            localStorage.setItem("userInfo", JSON.stringify(res.data));
            // history.push("/login");
            setLoginRedirect(true);
          }
          // console.log("1", res.data);
          console.log(res);
        })
        .catch((err) => console.log(err));
    } else if (
      email === "" ||
      userName === "" ||
      password === "" ||
      email === undefined ||
      password === undefined ||
      userName === undefined
    ) {
      setErrorMsg("Enter the Details!");
      setErrorStatus(true);
    } else if (email === "" || email === undefined) {
      setErrorStatus(true);
      setErrorMsg("Enter Email!");
    } else if (!validateEmail(email)) {
      setErrorStatus(true);
      setErrorMsg("Email is invalid!");
    } else {
      console.log("Not Ok");
      setErrorMsg("Enter the Details!");
      setErrorStatus(true);
    }
  }

  return (
    <Container>
      <div>
        <div class="login">
          <div class="container">
            <div class="login_container">
              <div class="header">Register</div>
              <div class="content">
                <div class="log_img_contain">
                  <img
                    class="log_img"
                    width="500px"
                    height="200px"
                    src={signIn}
                    alt=""
                  />
                </div>
                <div class="form">
                  <div class="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      id="username"
                      class="login_input"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      name="username"
                      placeholder="Username..."
                    />
                  </div>
                  <div class="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      class="login_input"
                      type="email"
                      name="email"
                      placeholder="Email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div class="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      class="login_input"
                      type="password"
                      name="password"
                      placeholder="Password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="footer">
                <button type="button" class="loginButton" onClick={register}>
                  Register
                </button>
                {/* Display any kind of error */}
                {errorStatus && (
                  <div className="alert alert-danger error_input" role="alert">
                    <p
                      style={{
                        textAlign: "center",
                        bottom: "1vw",
                        position: "relative",
                      }}
                    >
                      {errorMsg}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="login_redirect">
        Already have an account? <Link to="/login">Click here</Link> to login
      </div>
      {loginRedirect && <Redirect to="/" />}
    </Container>
  );
}

export default SignUp;
