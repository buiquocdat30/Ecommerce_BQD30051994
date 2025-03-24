import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelopeOpen,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import instagram_icon from "../Components/Assets/instagram_icon.png";
import pintester_icon from "../Components/Assets/pintester_icon.png";
import whatsapp_icon from "../Components/Assets/whatsapp_icon.png";
// import facebook_icon from "../Components/Assets/facebook_icon.png";
// import google_icon from "../Components/Assets/google_icon.png";
// import x_icon from "../Components/Assets/x_icon.png";
import "./CSS/LoginSignup.css";

const LoginSignup = () => {
  const [state, setState] = useState("Login");

  const dataDetails = { username: "", password: "", email: "" };
  const [formData, setFormData] = useState(dataDetails);

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const login = async () => {
    console.log("Login Function Executed", formData);
  };

  const signup = async () => {
    try {
      console.log("Sign Up Function Executed", formData);
      let responseData;
      await fetch("http://localhost:4000/signup", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => (responseData = data));

      if (responseData.success) {
        localStorage.setItem("auth-token", responseData.token);
        window.location.replace("/");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields-container">
          {state === "Sign Up" ? (
            <div className="loginsignup-fields">
              <FontAwesomeIcon className="field-icon" icon={faUser} />
              <input
                name="username"
                value={formData.username}
                onChange={changeHandler}
                type="text"
                placeholder="Your Name"
              />
            </div>
          ) : (
            <></>
          )}
          <div className="loginsignup-fields">
            <FontAwesomeIcon className="field-icon" icon={faEnvelopeOpen} />
            <input
              name="email"
              value={formData.email}
              onChange={changeHandler}
              type="email"
              placeholder="Email Adress"
            />
          </div>
          <div className="loginsignup-fields">
            <FontAwesomeIcon className="field-icon" icon={faLock} />
            <input
              name="password"
              value={formData.password}
              onChange={changeHandler}
              type="password"
              placeholder="Your Password"
            />
          </div>
        </div>
        <button
          onClick={() => {
            state === "Login" ? login() : signup();
          }}
        >
          Continue
        </button>
        {state === "Sign Up" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span
              className="click-span"
              onClick={() => {
                setState("Login");
              }}
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span
              className="click-span"
              onClick={() => {
                setState("Sign Up");
              }}
            >
              Click here
            </span>
          </p>
        )}

        <div className="loginsignup-agree">
          <input type="checkbox" name="" id="" />
          <p>By continuing, i agree the terms of use & privacy policy.</p>
        </div>

        <p className="loginsignup-login">
          Fast Signup With Your Favourite Social Profile
        </p>
        <div className="loginsignup-social-icon">
          {/* <div className="loginsignup-icons-container">
          <img src={facebook_icon } alt="" />
          </div>
          <div className="loginsignup-icons-container">
          <img src={google_icon } alt="" />
          </div>
          <div className="loginsignup-icons-container">
          <img src={x_icon } alt="" />
          </div> */}
          <div className="loginsignup-icons-container">
            <img src={instagram_icon} alt="" />
          </div>
          <div className="loginsignup-icons-container">
            <img src={pintester_icon} alt="" />
          </div>
          <div className="loginsignup-icons-container">
            <img src={whatsapp_icon} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
