import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Admin from "./models/Admin.js";

dotenv.config();

const run = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL?.toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.error(
        "Set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file first."
      );
      process.exit(1);
    }

    let admin = await Admin.findOne({ email });

    if (admin) {
      // Reset/update existing password
      admin.password = password;
      await admin.save();

      console.log(`Admin password updated for ${email}`);
    } else {
      // Create new admin
      await Admin.create({
        email,
        password,
      });

      console.log(`Admin account created for ${email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Seed admin error:", error);
    process.exit(1);
  }
};

run();