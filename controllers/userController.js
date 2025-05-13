const User = require("../models/user.js");

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).populate("recipes");
    const data = {
      first: user.first,
      last: user.last,
      picture: user.picture,
      recipes: user.recipes,
    };
    res.render("./users/profile.ejs", { user });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getUserById,
};
