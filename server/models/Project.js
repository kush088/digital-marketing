import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, default: "", trim: true },
    description: { type: String, required: true },
    category: { type: String, default: "Full-Stack", trim: true },
    projectRole: { type: String, default: "", trim: true },
    keyFeatures: [{ type: String, trim: true }],
    techStack: [{ type: String, trim: true }],
    images: [{ type: String }],
    githubLink: { type: String, trim: true },
    liveLink: { type: String, trim: true },
    downloadFile: { type: String },
    downloadFileName: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },

    // Legacy fields retained so existing portfolio documents remain readable.
    summary: { type: String, default: "" },
    image: { type: String, default: "" },
    tags: [{ type: String }],
    result: { type: String, default: "" },
    client: { type: String, default: "" },
    timeline: { type: String, default: "" },
    downloadUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
