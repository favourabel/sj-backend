import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";

// GET all (public)
export const getProjects = async (req, res) => {
  const projects = await Project.find().sort({ createdAt: -1 });
  res.json(projects);
};

// GET one
export const getProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Not found" });
  res.json(project);
};

// CREATE
export const createProject = async (req, res) => {
  try {
    const { title, description, category, date, technologies, codeUrl, liveUrl, featured } = req.body;

    const project = await Project.create({
      title,
      description,
      category,
      date,
      technologies: technologies ? JSON.parse(technologies) : [],
      codeUrl,
      liveUrl,
      featured: featured === "true",
      image: req.file?.path,
      imagePublicId: req.file?.filename,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    const { title, description, category, date, technologies, codeUrl, liveUrl, featured } = req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (date) project.date = date;
    if (technologies) project.technologies = JSON.parse(technologies);
    if (codeUrl) project.codeUrl = codeUrl;
    if (liveUrl) project.liveUrl = liveUrl;
    if (featured !== undefined) project.featured = featured === "true";

    if (req.file) {
      if (project.imagePublicId) {
        await cloudinary.uploader.destroy(project.imagePublicId);
      }
      project.image = req.file.path;
      project.imagePublicId = req.file.filename;
    }

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    if (project.imagePublicId) {
      await cloudinary.uploader.destroy(project.imagePublicId);
    }

    await project.deleteOne();
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};