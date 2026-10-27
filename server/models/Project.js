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

    // Project category
    category: {
      type: String,
      required: true,
      trim: true,
    },

    techStack: [{ type: String, trim: true }],

    // Existing image-project support
    images: [{ type: String }],

    // Media type: image project or video project
    projectType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },

    // Video source: uploaded file or external URL
    videoSource: {
      type: String,
      enum: ["upload", "external"],
      default: "upload",
    },

    // Uploaded video URL or external video URL
    videoUrl: {
      type: String,
      trim: true,
    },

    // Custom thumbnail used for video cards and previews
    thumbnail: {
      type: String,
      trim: true,
    },

    githubLink: {
      type: String,
      trim: true,
    },

    liveLink: {
      type: String,
      trim: true,
    },

    downloadFile: {
      type: String,
    },

    downloadFileName: {
      type: String,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);