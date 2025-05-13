require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const session = require("express-session");

const app = express();

app.use(morgan("dev"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = require("./db");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter.js");
const recipeRouter = require("./routes/recipeRouter.js");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/recipes", recipeRouter);

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.listen(process.env.PORT, () => {
  console.log(`app listen to port ${process.env.PORT}`);
});
