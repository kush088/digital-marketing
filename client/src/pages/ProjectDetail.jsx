import React,{useEffect,useState} from "react";
import {Link,useParams} from "react-router-dom";
import axios from "axios";
import {useAuth} from "../context/AuthContext.jsx";
import "./ProjectDetail.css";
const apiOrigin=(import.meta.env.VITE_API_URL||"http://localhost:5000/api").replace(/\/api\/?$/,"");
const mediaUrl=v=>!v?"":(/^(https?:|data:|blob:)/i.test(v)?v:`${apiOrigin}${v.startsWith("/")?"":"/"}${v}`);
export default function ProjectDetail(){
 const{id}=useParams();const{apiBase}=useAuth();const[project,setProject]=useState(null);const[status,setStatus]=useState("loading");
 useEffect(()=>{setStatus("loading");axios.get(`${apiBase}/projects/${id}`).then(({data})=>{setProject(data);setStatus("ready")}).catch(()=>setStatus("error"));},[apiBase,id]);
 if(status==="loading")return <div className="detail-loading"><span className="spinner"/>Loading project…</div>;
 if(status==="error"||!project)return <div className="detail-error"><h1>Project not found</h1><p>This project may have been moved or removed.</p><Link to="/projects" className="btn btn-outline">← Back to projects</Link></div>;
 const tech=Array.isArray(project.techStack)?project.techStack:[];const images=project.images?.length?project.images:(project.image?[project.image]:[]);
 return <main className="container detail-page"><Link to="/projects" className="detail-back">← All projects</Link><div className="detail-heading"><p className="eyebrow">{project.category||"Development project"}</p><h1>{project.title}</h1><p>{project.shortDescription||project.summary||project.description}</p></div>
 {images.length>0&&<div className="detail-gallery">{images.map((img,i)=><img key={`${img}-${i}`} src={mediaUrl(img)} alt={`${project.title} preview ${i+1}`}/>)}</div>}
 <div className="detail-content-grid"><article className="detail-description"><p className="eyebrow">Overview</p><h2>About this project</h2><p>{project.description}</p>{project.keyFeatures?.length>0&&<><h2>Key features</h2><ul>{project.keyFeatures.map(f=><li key={f}>{f}</li>)}</ul></>}</article>
 <aside className="detail-sidebar"><div className="detail-info-card"><span className="detail-info-label">Technology stack</span><div className="detail-tech-list">{tech.length?tech.map(t=><span key={t}>{t}</span>):<span>Not specified</span>}</div>{project.projectRole&&<><span className="detail-info-label">My role</span><p>{project.projectRole}</p></>}<div className="detail-links">{project.liveLink&&<a className="btn btn-primary" href={project.liveLink} target="_blank" rel="noreferrer">Visit live project ↗</a>}{project.githubLink&&<a className="btn btn-outline" href={project.githubLink} target="_blank" rel="noreferrer">View source code ↗</a>}{project.downloadFile&&<a className="btn btn-outline" href={`${apiBase}/projects/${project._id}/download`}>Download project file ↓</a>}</div></div></aside></div></main>;
}
