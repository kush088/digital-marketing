import React,{useState} from "react";
import {NavLink} from "react-router-dom";
import "./Navbar.css";
const links=[{to:"/",label:"Home"},{to:"/about",label:"About"},{to:"/projects",label:"Projects"},{to:"/contact",label:"Contact"}];
export default function Navbar(){
 const[open,setOpen]=useState(false);const cls=({isActive})=>`navbar-link${isActive?" active":""}`;
 return <header className="navbar"><nav className="navbar-inner" aria-label="Main navigation">
  <NavLink to="/" className="navbar-logo" onClick={()=>setOpen(false)}>kush<span>parekh.</span></NavLink>
  <div className="navbar-links">{links.map(l=><NavLink key={l.to} to={l.to} end={l.to==="/"} className={cls}>{l.label}</NavLink>)}</div>
  <NavLink to="/contact" className="navbar-desktop-cta">Let's talk <span>↗</span></NavLink>
  <button className={`navbar-toggle${open?" is-open":""}`} aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open} onClick={()=>setOpen(v=>!v)}><span/><span/></button>
 </nav>{open&&<div className="navbar-mobile">{links.map(l=><NavLink key={l.to} to={l.to} end={l.to==="/"} className={cls} onClick={()=>setOpen(false)}>{l.label}</NavLink>)}<NavLink to="/contact" className="navbar-mobile-cta" onClick={()=>setOpen(false)}>Let's talk ↗</NavLink></div>}</header>;
}
