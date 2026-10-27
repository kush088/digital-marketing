import express from "express";
import mongoose from "mongoose";
import PageSEO from "../models/PageSEO.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Public endpoint: get SEO settings for a specific page.
router.get("/public/:slug", async (req, res) => {
  try {
    const slug = String(req.params.slug || "").toLowerCase();

    const page = await PageSEO.findOne({ slug }).lean();

    if (!page) {
      return res.status(200).json({
        success: true,
        page: null,
      });
    }

    return res.status(200).json({
      success: true,
      page: {
        slug: page.slug,
        pageName: page.pageName,
        title: page.title,
        description: page.description,
      },
    });
  } catch (error) {
    console.error("Public SEO fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load page SEO settings.",
    });
  }
});

// Admin endpoint: get all page SEO settings.
router.get("/", protect, async (req, res) => {
  try {
    const pages = await PageSEO.find()
      .sort({ pageName: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      pages,
    });
  } catch (error) {
    console.error("Admin SEO fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load SEO settings.",
    });
  }
});

// Admin endpoint: create or update one page's SEO settings.
router.put("/:slug", protect, async (req, res) => {
  try {
    const slug = String(req.params.slug || "").toLowerCase();

    const { pageName, title, description } = req.body;

    if (
      typeof pageName !== "string" ||
      typeof title !== "string" ||
      typeof description !== "string" ||
      !pageName.trim() ||
      !title.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Page name and title are required.",
      });
    }

    if (title.trim().length > 70) {
      return res.status(400).json({
        success: false,
        message: "Title must be 70 characters or fewer.",
      });
    }

    if (description.trim().length > 320) {
      return res.status(400).json({
        success: false,
        message: "Description must be 320 characters or fewer.",
      });
    }

    const page = await PageSEO.findOneAndUpdate(
      { slug },
      {
        $set: {
          slug,
          pageName: pageName.trim(),
          title: title.trim(),
          description: description.trim(),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "SEO settings saved successfully.",
      page,
    });
  } catch (error) {
    console.error("SEO save error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save SEO settings.",
    });
  }
});

export default router;