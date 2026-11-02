import React from "react";
import {Link} from "react-router-dom";
import "./ProjectCard.css";
const apiOrigin=(import.meta.env.VITE_API_URL||"http://localhost:5000/api").replace(/\/api\/?$/,"");
const mediaUrl=(value)=>!value?"":(/^(https?:|data:|blob:)/i.test(value)?value:`${apiOrigin}${value.startsWith("/")?"":"/"}${value}`);
export default function ProjectCard({project}){
 const image=project.images?.[0]||project.image||"";const tech=Array.isArray(project.techStack)?project.techStack:(Array.isArray(project.tags)?project.tags:[]);
 const summary=project.shortDescription||project.summary||project.description||"A full-stack web development project.";
 return <article className="project-card"><Link to={`/projects/${project._id}`} className="project-card-image" aria-label={`View ${project.title}`}>{image?<img src={mediaUrl(image)} alt={project.title} loading="lazy"/>:<div className="project-card-placeholder"><span>{project.title?.slice(0,1)||"P"}</span><small>PROJECT PREVIEW</small></div>}{project.projectType==="video"&&<span className="project-media-label">VIDEO PROJECT</span>}</Link><div className="project-card-body"><div className="project-card-tags">{tech.slice(0,3).map(t=><span className="badge" key={t}>{t}</span>)}</div><h3 className="project-card-title"><Link to={`/projects/${project._id}`}>{project.title}</Link></h3><p className="project-card-summary">{summary}</p><div className="project-card-actions"><Link to={`/projects/${project._id}`} className="project-card-view">Explore project ↗</Link>{project.liveLink&&<a href={project.liveLink} target="_blank" rel="noreferrer" className="project-card-external">Live site</a>}</div></div></article>;
}
