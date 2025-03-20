import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(false);

  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: "",
  });
  //lấy url của ảnh, hiển thị tạm ảnh trước khi upload
  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      console.log("Image URL:", imageUrl);
      setImage(file);
    }
  };
  //Cập nhật giá trị của từng input khi người dùng nhập dữ liệu vào form. Dùng name của input để cập nhật đúng key trong productDetails.
  const changeHandler = (e) => {
    setProductDetails((productDetails) => ({
      ...productDetails,
      [e.target.name]: e.target.value,
    }));
  };
  //up ảnh lên server và nhận lại đường dẫn ảnh, sau đó cập nhật image và gửi dữ liệu đầy đủ sản phẩm lên server
  const Add_Product = async () => {
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    let formData = new FormData();
    formData.append("product", image);

    await fetch("http://localhost:4000/upload", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        responseData = data;
      });

      if(responseData.success)
      {
        product.image=responseData.image_url;
        console.log(product)
        await fetch('http://localhost:4000/addproduct',{
          method:'POST',
          headers:{
            Accept:'application/json',
            'Content-Type':'application/json',
          },
          body:JSON.stringify(product),
        })
        .then((resp)=>resp.json())
        .then((data)=>{
          data.success?alert("Product Added"):alert("Failed")
        })
      }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          {/* Nếu image có giá trị (tức là có ảnh được chọn), thì dùng URL.createObjectURL(image) để tạo URL tạm thời hiển thị ảnh đó còn không thì hiển thị hình ảnh mặc định từ upload_area */}
          <img
            className="addproduct-thumnail-img"
            src={image ? URL.createObjectURL(image) : upload_area}
            alt=""
          />
        </label>
        <input
          onChange={imageHandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default AddProduct;
