import express from "express";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/create-admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const admin = await Admin.create({
      email: email.toLowerCase(),
      password,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      email: admin.email,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create admin",
    });
  }
});

export default router;