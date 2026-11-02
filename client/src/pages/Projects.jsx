import React,{useEffect,useMemo,useState} from "react";
import axios from "axios";
import ProjectCard from "../components/ProjectCard.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import "./Projects.css";
export default function Projects(){
 const{apiBase}=useAuth();const[projects,setProjects]=useState([]);const[loading,setLoading]=useState(true);const[category,setCategory]=useState("All");
 useEffect(()=>{axios.get(`${apiBase}/projects`).then(({data})=>setProjects(Array.isArray(data)?data:[])).catch(()=>setProjects([])).finally(()=>setLoading(false));},[apiBase]);
 const categories=useMemo(()=>["All",...new Set(projects.map(p=>p.category).filter(Boolean))],[projects]);const filtered=category==="All"?projects:projects.filter(p=>p.category===category);
 return <main className="container projects-page"><section className="projects-heading"><p className="eyebrow">Selected work</p><h1>Things I've <span>built.</span></h1><p>A collection of web applications and development experiments. Each project is an opportunity to learn, solve a problem and make something useful.</p></section>
 {categories.length>1&&<div className="filter-row" aria-label="Filter projects">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={`filter-pill${category===c?" active":""}`}>{c}</button>)}</div>}
 {loading?<div className="projects-loading"><span className="spinner"/><p>Loading projects…</p></div>:filtered.length===0?<div className="projects-empty"><span>✳</span><h2>{projects.length?"No projects in this category yet.":"New work is on the way."}</h2><p>Check back soon for more full-stack projects and experiments.</p></div>:<div className="projects-grid">{filtered.map(p=><ProjectCard key={p._id} project={p}/>)}</div>}</main>;
}
