import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    description: { type: String, required: true },

    // Project category
    category: {
      type: String,
      required: true,
      trim: true,
    },

    techStack: [{ type: String, trim: true }],

    images: [{ type: String }],

    githubLink: { type: String, trim: true },

    liveLink: { type: String, trim: true },

    downloadFile: { type: String },

    downloadFileName: { type: String },

    featured: { type: Boolean, default: false },

    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);