import React,{useEffect,useState} from "react";
import {Link} from "react-router-dom";
import axios from "axios";
import ProjectCard from "../components/ProjectCard.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import "./Home.css";
const stack=["React.js","JavaScript","Node.js","Express.js","MongoDB","REST APIs","Git & GitHub"];
const services=[["01","Frontend development","Responsive, accessible interfaces with React, JavaScript, HTML and CSS."],["02","Backend development","REST APIs, server-side logic and authentication using Node.js and Express."],["03","Database integration","Data modelling and CRUD workflows with MongoDB and Mongoose."],["04","Full-stack delivery","Connecting interfaces, APIs and databases into complete web applications."]];
export default function Home(){
 const{apiBase}=useAuth();const[projects,setProjects]=useState([]);
 useEffect(()=>{axios.get(`${apiBase}/projects`).then(({data})=>setProjects((Array.isArray(data)?data:[]).filter(p=>p.featured).slice(0,3))).catch(()=>setProjects([]));},[apiBase]);
 return <div>
  <section className="home-hero"><div className="home-hero-inner"><div className="home-hero-copy">
   <p className="eyebrow">Full-Stack MERN Developer · India</p><h1>I build digital products <span>from idea to launch.</span></h1>
   <p className="home-hero-description">I'm Kush Parekh, a full-stack developer focused on building thoughtful user experiences and reliable web applications with the MERN stack.</p>
   <div className="home-hero-actions"><Link to="/projects" className="btn btn-primary">Explore my work ↗</Link><Link to="/contact" className="btn btn-outline">Let's connect</Link></div>
   <div className="home-availability"><span/>Open to opportunities and collaborations</div>
  </div><div className="home-hero-visual"><div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/><div className="hero-code-card"><div className="code-card-top"><span/><span/><span/><small>developer.js</small></div><div className="code-lines"><p><i>const</i> developer = {"{"}</p><p className="code-indent">name: <b>"Kush Parekh"</b>,</p><p className="code-indent">stack: <b>"MERN"</b>,</p><p className="code-indent">mindset: <b>"Always learning"</b></p><p>{"}"}</p><p className="code-call">developer.<em>build</em>();</p></div><div className="code-card-bottom"><span/>Available for new opportunities</div></div><div className="floating-chip chip-react">⚛ React</div><div className="floating-chip chip-node">⌘ Node.js</div><div className="floating-chip chip-db">◈ MongoDB</div></div></div><div className="hero-bottom-note">SCROLL TO EXPLORE <span/></div></section>
  <section className="stack-strip"><div className="container stack-strip-inner"><span className="stack-label">TECH I WORK WITH</span><div className="stack-list">{stack.map(s=><span key={s}>{s}</span>)}</div></div></section>
  <section className="section"><div className="container"><div className="section-topline"><div><p className="eyebrow">What I do</p><h2 className="section-heading">Building across the <span className="gradient-text">whole stack.</span></h2></div><p className="section-intro">From the first component to the database behind it, I enjoy bringing complete web experiences together.</p></div><div className="capabilities-grid">{services.map(([n,t,d])=><article className="capability-card" key={n}><span className="capability-number">{n}</span><h3>{t}</h3><p>{d}</p><span className="capability-arrow">↗</span></article>)}</div></div></section>
  <section className="section home-projects-section"><div className="container"><div className="section-topline"><div><p className="eyebrow">Selected work</p><h2 className="section-heading">Projects built with <span className="gradient-text">purpose.</span></h2></div><Link to="/projects" className="text-link">View all projects ↗</Link></div>{projects.length?<div className="home-project-grid">{projects.map(p=><ProjectCard key={p._id} project={p}/>)}</div>:<div className="project-empty-note">Project showcases are being updated. Visit the projects page to see the latest work.</div>}</div></section>
  <section className="home-cta-wrap"><div className="container home-cta"><div><p className="eyebrow">Have an idea?</p><h2>Let's make something <span>useful.</span></h2><p>Have a role, project or collaboration in mind? I'd be happy to hear about it.</p></div><Link to="/contact" className="btn btn-primary">Start a conversation ↗</Link></div></section>
 </div>;
}
