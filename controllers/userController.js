const { User } = require("../models");
const bcrypt = require("bcryptjs");

exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!["admin", "analyst", "viewer"].includes(role))
    return res.status(400).json({ message: "Invalid role" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashed, role });

  res.status(201).json(user);
};