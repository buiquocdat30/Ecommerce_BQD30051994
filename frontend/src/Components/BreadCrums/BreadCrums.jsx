import React from "react";
import "./BreadCrums.css";
import arrow_icon from "../Assets/breadcrum_arrow.png";
const BreadCrums = ({ product }) => {
  if (!product.category) {
    console.log("lỗi ko có data");
  } else {
    return (
      <div className="breadcrum">
        HOME <img src={arrow_icon} alt="" /> SHOP{" "}
        <img src={arrow_icon} alt="" /> {product.category}{" "}
        <img src={arrow_icon} alt="" /> {product.name}
      </div>
    );
  }
};

export default BreadCrums;
