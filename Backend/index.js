const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const morgan = require("morgan");

const cors = require("cors");
const { error } = require("console");

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//Database Connection with MongoDB
mongoose.connect(
  "mongodb+srv://buiquocdat30:DAT0369948689@shopper.saapn.mongodb.net/Ecommerce"
);

//API creattion

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Image Storage Engine

const storage = multer.diskStorage({
  // destination: "./upload/images",
  destination: path.join(__dirname, "./upload/images"),
  filename: (req, file, cb) => {
    console.log("file", file);
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

// Creating Upload Endpoint for images
//   app.use("/images", express.static("upload/images"));
app.use("/images", express.static(path.join(__dirname, "./upload/images")));

app.post("/upload", upload.single("product"), (req, res) => {
  console.log("Uploaded file:", req.file);
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded!" });
  }
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Schema for Creating product
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  avilable: {
    type: Boolean,
    default: true,
  },
});

// Creating API for add products
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API for deleting products
app.post("/removeproduct", async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      id: req.body.id,
    });
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }
    console.log("Remove");
    res.json({
      success: true,
      name: req.body.name,
    });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

//Creating API for getting all products
app.get("/allproducts", async (req, res) => {
  try {
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

// Shema creating for User model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Creating Endpoint for registering the User
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      error: "existing user found with same email address",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

//Creating endpoint for user login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, error: "Wrong Password" });
    }
  } else {
    res.json({ success: false, error: "Wrong Email Id" });
  }
});

//creating endpoint for newcollection Database
app.get("/newcollections", async (req, res) => {
  try {
    let products = await Product.find({}); // Kiểm tra xem có dữ liệu không
    let newcollection = products.slice(1).slice(-8);
    console.log("Newcollection Fetched");
    res.status(200).json(newcollection);
  } catch (error) {
    console.error("Error fetching new collections:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// creating endpoint for pupular in women section
app.get("/popularinwomen", async (req, res) => {
  try {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
  } catch (error) {
    console.error("Error fetching Popular in women:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Creating middelware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ errors: "Please authenticate using valid token" });
    }
  }
};

//creating endpoint for adding products in cartData
app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    // Kiểm tra xem itemId có tồn tại trong request hay không
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: "itemId is required" });
    }

    // Tìm user trong database
    let userData = await Users.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }
    // Đảm bảo cartData luôn tồn tại
    if (!userData.cartData) {
      userData.cartData = {};
    }
    userData.cartData[req.body.itemId] =
      (userData.cartData[req.body.itemId] || 0) + 1;

    // Đánh dấu cartData đã thay đổi để Mongoose lưu lại
    userData.markModified("cartData");
    // Lưu dữ liệu vào database
    await userData.save();

    res.json({
      message: "Item added to cart successfully",
      cartData: userData.cartData,
    });
    console.log("added", req.body.itemId);
  } catch (error) {
    console.error("Error in /addtocart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//creating endpoint to remove product from cartData
app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    // Kiểm tra xem itemId có tồn tại trong request hay không
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: "itemId is required" });
    }

    // Tìm user trong database
    let userData = await Users.findById(req.user.id);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }
    // Đảm bảo cartData luôn tồn tại
    if (!userData.cartData) {
      userData.cartData = {};
    }

    // Kiểm tra xem sản phẩm có trong giỏ hàng không
    if (!userData.cartData[itemId]) {
      return res.status(400).json({ error: "Item not found in cart" });
    }

    if (userData.cartData[itemId] > 1) {
      userData.cartData[itemId] -= 1;
    } else {
      // Nếu số lượng = 1, xóa luôn sản phẩm khỏi giỏ hàng
      delete userData.cartData[itemId];
    }
    // Đánh dấu cartData đã thay đổi để Mongoose lưu lại
    userData.markModified("cartData");
    // Lưu dữ liệu vào database
    await userData.save();
    console.log("removed", req.body.itemId);
    res.json({
      message: "Item removed to cart successfully",
      cartData: userData.cartData,
    });
  } catch (error) {
    console.error("Error in /removefromcart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//creating endpoint to get cartdata
app.get('/getcart',fetchUser, async (req, res)=>{
  console.log("getcart");
  let userData =await Users.findById(req.user.id)
  res.json(userData.cartData)
})

app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port: " + port);
  } else {
    console.log("Error:" + error);
  }
});
