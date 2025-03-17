const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const cors = require("cors");


app.use(express.json());
app.use(cors());

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
        console.log('file', file)
      return cb(
        null,
        `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Creating Upload Endpoint for images
//   app.use("/images", express.static("upload/images"));
app.use("/images",express.static(path.join(__dirname, "./upload/images")))
  
  app.post("/upload", upload.single("product"), (req, res) => {
    console.log("Uploaded file:", req.file);
    if(!req.file)
    {
        return res.status(400).json({ message: "No file uploaded!" });
    }
    res.json({
      success: 1,
      image_url: `http://localhost:${port}/images/${req.file.filename}`,
    });
  });
  
  // Schema for Creating product
  const Product =mongoose.model('Product',{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type: String,
        required:true,
    },
    image:{
        type:String,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    new_price:{
        type: Number,
        required: true
    },
    old_price:{
        type: Number,
        require: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    avilable:{
        type: Boolean,
        default: true
    },

  })

  app.post('/addproduct', async (req,res)=>{
    const product=new Product({
        id:req.body.id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        success:true,
        name:req.body.name,
    })
  })




  app.listen(port, (error) => {
    if (!error) {
      console.log("Server running on port: " + port);
    } else {
      console.log("Error:" + error);
    }
  });
  