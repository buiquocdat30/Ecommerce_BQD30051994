import React from "react";
import "./RelateProducts.css";
import Item from "../Item/Item";
import data_product from "../Assets/data";

const RelateProducts = () => {
  return (
    <div className="relateproducts">
      <h1>Relate Products</h1>
      <hr />
      <div className="relateproducts-item">
        {data_product.map((item, index) => {
          return (
            <Item
              key={index}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default RelateProducts;
