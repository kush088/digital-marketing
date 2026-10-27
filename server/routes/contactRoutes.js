
import express from "express";
import mongoose from "mongoose";
import Contact from "../models/Contact.js";
import protect from "../middleware/auth.js";

const router = express.Router();

/* =========================================
   1. SUBMIT CONTACT MESSAGE
   POST /api/contact
========================================= */

router.post("/", async (req, res) => {
  try {
    const { name, email, budget, message } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      budget:
        typeof budget === "string" ? budget.trim() : "",
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Message submitted successfully.",
      contact,
    });
  } catch (error) {
    console.error("Contact submission error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit contact message.",
    });
  }
});

/* =========================================
   2. GET ALL CONTACT MESSAGES
   GET /api/contact
========================================= */

router.get("/", protect, async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Fetch contact messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contact messages.",
    });
  }
});

/* =========================================
   3. DELETE CONTACT MESSAGE
   DELETE /api/contact/:id
========================================= */

router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID.",
      });
    }

    const contact = await Contact.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete contact message error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete contact message.",
    });
  }
});

export default router;
