require("dotenv").config({ path: ".env.local" });

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI belum diatur");
}

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    status: String,
  },
  { timestamps: true }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", UserSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("MongoDB connected");

    const email = "admin@lms.com";
    const password = "admin123";
    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Admin sudah ada.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: "Administrator",
      email,
      password: hashedPassword,
      role: "admin",
      status: "aktif",
    });

    console.log("Admin berhasil dibuat!");
    console.log("Email:", email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("Gagal membuat admin:", error);
    process.exit(1);
  }
}

createAdmin();