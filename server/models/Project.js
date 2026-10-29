
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    techStack: [
      {
        type: String,
        trim: true,
      },
    ],

    // Project images
    images: [{ type: String }],

    // Image or video project
    projectType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    // Uploaded video or external video URL
    videoSource: {
      type: String,
      enum: ["upload", "external"],
      default: "upload",
    },

    videoUrl: {
      type: String,
      trim: true,
    },

    // Video thumbnail
    thumbnail: {
      type: String,
      trim: true,
    },

    // Project links
    githubLink: {
      type: String,
      trim: true,
    },

    liveLink: {
      type: String,
      trim: true,
    },

    // Downloadable case-study document
    downloadFile: {
      type: String,
    },

    downloadFileName: {
      type: String,
    },

    // Existing featured-project functionality
    featured: {
      type: Boolean,
      default: false,
    },

    // Controls homepage visibility independently of featured
    showOnHome: {
      type: Boolean,
      default: true,
    },

    // Project display order
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);
