const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRouter = require("./routes/auth");

const userRouter = require("./routes/user");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useUnifiedTopology: true,
  })
  .then(console.log(`Database connected!`))
  .catch((err) => {
    console.log(err);
  });

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use(cors());

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
