import express from "express";
import Contact from "../models/Contact.js";

const router = express.Router();

// --------------------------------------------------
// SUBMIT CONTACT FORM
// POST /api/contact
// --------------------------------------------------

router.post("/", async (req, res) => {
  try {
    const { name, email, budget, message } = req.body;

    // Validate required fields
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    // Create contact message
    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      budget: budget?.trim() || "",
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Message submitted successfully",
      contactId: contact._id,
    });
  } catch (error) {
    console.error("Contact submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit contact form",
    });
  }
});

export default router;