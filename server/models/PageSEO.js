import mongoose from "mongoose";

const pageSEOSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    pageName: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 70,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 320,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PageSEO", pageSEOSchema);