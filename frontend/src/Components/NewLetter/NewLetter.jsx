import React from "react";
import "./NewLetter.css";

const NewLetter = () => {
  return (
    <div className="newletter">
      <h1>Get Exclusive Offers on Your Mail</h1>
      <p>Subcrise to our newletter and stay updated</p>
      <div>
        <input type="email" placeholder="Your Email.." />
        <button>Subscribe</button>
      </div>
    </div>
  );
};
export default NewLetter;
