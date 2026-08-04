import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: "Full Stack" }, // Full Stack, Frontend...
    date: { type: String, required: true }, // e.g. "May 2026"
    technologies: [{ type: String }], // ["React", "Node.js"...]
    image: { type: String }, // cloudinary URL
    imagePublicId: { type: String }, // for deletion
    codeUrl: { type: String },
    liveUrl: { type: String },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);