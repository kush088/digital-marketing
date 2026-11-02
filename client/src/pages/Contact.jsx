import React,{useState} from "react";
import axios from "axios";
import {useAuth} from "../context/AuthContext.jsx";
import "./Contact.css";
const initial={name:"",email:"",budget:"",message:""};
export default function Contact(){
 const{apiBase}=useAuth();const[form,setForm]=useState(initial);const[status,setStatus]=useState("idle");
 const change=e=>setForm(v=>({...v,[e.target.name]:e.target.value}));
 const submit=async e=>{e.preventDefault();setStatus("sending");try{await axios.post(`${apiBase}/contact`,form);setStatus("sent");setForm(initial)}catch(error){console.error("Contact form error:",error);setStatus("error")}};
 return <main className="container contact-grid"><section className="contact-intro"><p className="eyebrow">Get in touch</p><h1>Have an idea?<br/><span>Let's talk.</span></h1><p>Whether you have a development opportunity, a project idea or simply want to connect, send me a message.</p><div className="contact-details"><a href="mailto:kushparekh01@gmail.com"><span>Email</span>kushparekh01@gmail.com ↗</a><a href="tel:+919016480817"><span>Phone</span>+91 90164 80817 ↗</a><div><span>Location</span>Gujarat, India</div></div><p className="contact-response-note"><span/>Usually responds within 1–2 business days</p></section>
 <form onSubmit={submit} className="contact-form"><div className="contact-form-heading"><h2>Send a message</h2><p>Share a little context and I'll get back to you.</p></div>
 <div className="field-group"><label className="field-label" htmlFor="name">Your name</label><input className="field" id="name" name="name" value={form.name} onChange={change} placeholder="Enter your name" required/></div>
 <div className="field-group"><label className="field-label" htmlFor="email">Email address</label><input className="field" id="email" name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" required/></div>
 <div className="field-group"><label className="field-label" htmlFor="message">Your message</label><textarea className="field" id="message" name="message" rows={6} value={form.message} onChange={change} placeholder="A little context about the opportunity or project..." required/></div>
 <button className="btn btn-primary" type="submit" disabled={status==="sending"}>{status==="sending"?"Sending message…":"Send message ↗"}</button>{status==="sent"&&<p className="contact-form-message text-success">Thanks for reaching out. Your message has been sent.</p>}{status==="error"&&<p className="contact-form-message text-error">Your message couldn't be sent. Please try again or email me directly.</p>}</form></main>;
}
