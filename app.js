require("dotenv").config();
require("./config/db");

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Test message" });
});

app.use("/api", require("./routes/index.routes"));

app.listen(process.env.PORT, () => {
  console.log(`Running on : ${process.env.PORT}`);
});
