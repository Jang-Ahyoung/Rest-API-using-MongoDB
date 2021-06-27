const express = require("express");
const app = express();
app.listen(8800, () => {
    console.log("Backend server is running");
})

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("MongoDB is connected");
});

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const userRoute = require("./routes/user");
app.use("/api/users", userRoute);


