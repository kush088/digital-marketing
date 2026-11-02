import path from "path";
import fs from "fs";
import Project from "../models/Project.js";

const parseList = (value) => {
 if (Array.isArray(value)) return value.map(v=>String(v).trim()).filter(Boolean);
 if (typeof value !== "string" || !value.trim()) return [];
 try { const parsed=JSON.parse(value); if(Array.isArray(parsed)) return parsed.map(v=>String(v).trim()).filter(Boolean); } catch {}
 return value.split(",").map(v=>v.trim()).filter(Boolean);
};
const boolValue = value => value === true || value === "true";

export const getProjects = async (req,res) => {
 try { const projects=await Project.find().sort({order:1,createdAt:-1}); res.json(projects); }
 catch(err){res.status(500).json({message:"Server error",error:err.message});}
};
export const getProjectById = async (req,res) => {
 try { const project=await Project.findById(req.params.id); if(!project)return res.status(404).json({message:"Project not found"}); res.json(project); }
 catch(err){res.status(500).json({message:"Server error",error:err.message});}
};
export const createProject = async (req,res) => {
 try {
  const {title,shortDescription,description,category,projectRole,techStack,keyFeatures,githubLink,liveLink,featured,order}=req.body;
  const images=(req.files?.images||[]).map(f=>`/uploads/${f.filename}`);
  const file=req.files?.downloadFile?.[0];
  const project=await Project.create({title,shortDescription,description,category,projectRole,techStack:parseList(techStack),keyFeatures:parseList(keyFeatures),githubLink,liveLink,images,downloadFile:file?`/uploads/${file.filename}`:undefined,downloadFileName:file?.originalname,featured:boolValue(featured),order:Number(order)||0});
  res.status(201).json(project);
 } catch(err){res.status(500).json({message:"Server error",error:err.message});}
};
export const updateProject = async (req,res) => {
 try {
  const project=await Project.findById(req.params.id);if(!project)return res.status(404).json({message:"Project not found"});
  const fields=["title","shortDescription","description","category","projectRole","githubLink","liveLink"];
  fields.forEach(field=>{if(req.body[field]!==undefined)project[field]=req.body[field];});
  if(req.body.techStack!==undefined)project.techStack=parseList(req.body.techStack);
  if(req.body.keyFeatures!==undefined)project.keyFeatures=parseList(req.body.keyFeatures);
  if(req.body.featured!==undefined)project.featured=boolValue(req.body.featured);
  if(req.body.order!==undefined)project.order=Number(req.body.order)||0;
  if(req.body.removeImages){const remove=parseList(req.body.removeImages);remove.forEach(p=>{const f=path.join(process.cwd(),p);if(fs.existsSync(f))fs.unlinkSync(f);});project.images=project.images.filter(p=>!remove.includes(p));}
  const added=(req.files?.images||[]).map(f=>`/uploads/${f.filename}`);project.images=[...project.images,...added];
  const file=req.files?.downloadFile?.[0];if(file){if(project.downloadFile){const old=path.join(process.cwd(),project.downloadFile);if(fs.existsSync(old))fs.unlinkSync(old);}project.downloadFile=`/uploads/${file.filename}`;project.downloadFileName=file.originalname;}
  await project.save();res.json(project);
 } catch(err){res.status(500).json({message:"Server error",error:err.message});}
};
export const deleteProject = async (req,res) => {
 try {const project=await Project.findById(req.params.id);if(!project)return res.status(404).json({message:"Project not found"});[...project.images,project.downloadFile].filter(Boolean).forEach(p=>{const f=path.join(process.cwd(),p);if(fs.existsSync(f))fs.unlinkSync(f);});await project.deleteOne();res.json({message:"Project deleted"});}
 catch(err){res.status(500).json({message:"Server error",error:err.message});}
};
export const downloadProject = async (req,res) => {
 try {const project=await Project.findById(req.params.id);if(!project||!project.downloadFile)return res.status(404).json({message:"No downloadable file for this project"});const f=path.join(process.cwd(),project.downloadFile);if(!fs.existsSync(f))return res.status(404).json({message:"File missing on server"});res.download(f,project.downloadFileName||path.basename(f));}
 catch(err){res.status(500).json({message:"Server error",error:err.message});}
};
