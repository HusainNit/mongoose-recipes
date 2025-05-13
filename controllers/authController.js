const bcrypt = require("bcrypt");
const User = require("../models/user.js");

const registerUser = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({
      email: req.body.email,
    });

    if (userInDatabase) {
      res.send("UserName already taken");
    }

    if (req.body.password !== req.body.confirmPassword) {
      res.send("password did not match confirmPassword");
    }

    const hashPassword = bcrypt.hashSync(req.body.password, 12);
    const user = await User.create({
      email: req.body.email,
      password: hashPassword,
      first: req.body.first,
      last: req.body.last,
      picture: req.body.picture,
      recipes: [],
    });

    res.render("./auth/thanks.ejs", { user });
  } catch (error) {
    console.log(error.message);
  }
};

const signInUser = async (req, res) => {
  try {
    const userInDatabase = await User.findOne({
      email: req.body.email,
    });

    if (!userInDatabase) {
      res.send("No user has been registered with that email. Please sign up!");
    }

    const validPass = bcrypt.compareSync(
      req.body.password,
      userInDatabase.password
    );

    if (!validPass) {
      res.send("incorrect password");
    }

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id,
    };

    res.redirect(`/users/${userInDatabase._id}`);
  } catch (error) {
    console.log(error.message);
  }
};

const signOutUser = (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (error) {
    console.log(error.message);
  }
};

const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.send("there is no user with this id");
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.send("Password and Confirm Password must match");
      // This will be also be an EJS page...
    }
    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 12);

    user.password = hashedPassword;

    await user.save();
    res.render("./auth/confirm.ejs", { user });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  registerUser,
  signInUser,
  signOutUser,
  updatePassword,
};
