const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const authUsers = require("./routes/users");
const blogRoutes = require("./routes/blog");
const categoryRoute = require("./routes/categories");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = mongoose.connection;

    db.on("error", (err) => console.error(err));
    db.once("open", () => console.log("Connected to MongoDB!"));
  } catch {
    console.log(error);
    process.exit(1);
  }
};

// Define the storage for file uploads using Multer
const storage = multer.diskStorage({
  // Specify the destination folder where files will be saved
  destination: (req, file, cb) => {
    cb(null, "uploads"); // Change "uploads" to the desired folder path
  },
  // Define the filename for the uploaded file
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
// Create a Multer instance with the defined storage configuration
const upload = multer({ storage });

// Define a route for handling file uploads
app.post("/api/upload", upload.single("file"), (req, res) => {
  const filename = req.file.filename;
  res.status(200).json({ filename });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", authUsers);
app.use("/api/blog", blogRoutes);
app.use("/api/category", categoryRoute);

app.get("/", (req, res) => {
  res.send("Server Running");
});

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () =>
    console.log("Server running on " + process.env.API_URL)
  );
});
