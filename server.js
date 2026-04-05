require("dotenv").config();
const app = require("./app");
const { sequelize, User } = require("./models");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const PORT = 5000;

// 🔑 Generate random password
const generatePassword = () => {
  return crypto.randomBytes(6).toString("hex"); 
  // 12-char random password
};

const createDefaultAdmin = async () => {
  const adminExists = await User.findOne({
    where: { role: "admin" }
  });

  if (!adminExists) {
    const plainPassword = generatePassword();

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await User.create({
      name: "Super Admin",
      email: "admin@system.com",
      password: hashedPassword,
      role: "admin"
    });

    console.log("\n🚀 DEFAULT ADMIN CREATED");
    console.log("=================================");
    console.log("📧 Email: admin@system.com");
    console.log("🔑 Password:", plainPassword);
    console.log("⚠️  Save this password now. It won't be shown again.");
    console.log("=================================\n");
  }
};

sequelize.sync().then(async () => {
  await createDefaultAdmin();
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
});