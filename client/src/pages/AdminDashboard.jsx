import React,{useEffect,useState} from "react";
import axios from "axios";
import {useAuth} from "../context/AuthContext.jsx";
import "./AdminDashboard.css";
const blank={title:"",shortDescription:"",description:"",category:"Full-Stack",projectRole:"",techStack:"",keyFeatures:"",githubLink:"",liveLink:"",featured:false,order:0};
function ProjectModal({initial,onClose,onSave}){
 const[form,setForm]=useState({...blank,...initial,techStack:Array.isArray(initial?.techStack)?initial.techStack.join(", "):initial?.techStack||"",keyFeatures:Array.isArray(initial?.keyFeatures)?initial.keyFeatures.join(", "):initial?.keyFeatures||""});
 const[saving,setSaving]=useState(false);const change=e=>setForm(v=>({...v,[e.target.name]:e.target.type==="checkbox"?e.target.checked:e.target.value}));
 const submit=async e=>{e.preventDefault();setSaving(true);try{await onSave({...form,techStack:form.techStack,keyFeatures:form.keyFeatures});}finally{setSaving(false);}};
 return <div className="modal-overlay"><form onSubmit={submit} className="modal-panel"><div className="modal-header"><div><p className="eyebrow">Portfolio content</p><h2>{form._id?"Edit project":"Add a project"}</h2></div><button type="button" onClick={onClose}>Close ✕</button></div>
 <div className="modal-grid">
 <label className="full">Project title<input className="field" name="title" value={form.title} onChange={change} required/></label>
 <label className="full">Short description<input className="field" name="shortDescription" value={form.shortDescription} onChange={change} placeholder="A concise summary for project cards"/></label>
 <label className="full">Full description<textarea className="field" name="description" rows="5" value={form.description} onChange={change} required/></label>
 <label>Category<select className="field" name="category" value={form.category} onChange={change}><option>Full-Stack</option><option>Frontend</option><option>Backend</option><option>E-commerce</option><option>Web Application</option><option>Other</option></select></label>
 <label>My role<input className="field" name="projectRole" value={form.projectRole} onChange={change} placeholder="Full-stack development"/></label>
 <label className="full">Technologies (comma separated)<input className="field" name="techStack" value={form.techStack} onChange={change} placeholder="React, Node.js, Express, MongoDB"/></label>
 <label className="full">Key features (comma separated)<input className="field" name="keyFeatures" value={form.keyFeatures} onChange={change} placeholder="Authentication, Admin dashboard, CRUD"/></label>
 <label>Live project URL<input className="field" name="liveLink" value={form.liveLink} onChange={change} placeholder="https://..."/></label>
 <label>GitHub URL<input className="field" name="githubLink" value={form.githubLink} onChange={change} placeholder="https://github.com/..."/></label>
 <label>Display order<input className="field" type="number" name="order" value={form.order} onChange={change}/></label>
 <label className="modal-checkbox"><input type="checkbox" name="featured" checked={Boolean(form.featured)} onChange={change}/> Feature on homepage</label>
 </div><button type="submit" disabled={saving} className="btn btn-primary">{saving?"Saving…":"Save project"}</button></form></div>;
}
export default function AdminDashboard(){
 const{apiBase,token,logout,admin}=useAuth();const[projects,setProjects]=useState([]);const[loading,setLoading]=useState(true);const[modal,setModal]=useState(null);const[error,setError]=useState("");
 const headers={headers:{Authorization:`Bearer ${token}`}};
 const load=async()=>{setLoading(true);try{const{data}=await axios.get(`${apiBase}/projects`);setProjects(Array.isArray(data)?data:[]);setError("");}catch(e){setError("Could not load projects. Please refresh and try again.");}finally{setLoading(false);}};
 useEffect(()=>{load();},[apiBase]);
 const save=async data=>{try{if(data._id)await axios.put(`${apiBase}/projects/${data._id}`,data,headers);else await axios.post(`${apiBase}/projects`,data,headers);setModal(null);await load();}catch(e){setError(e.response?.data?.message||"Unable to save project.");}};
 const remove=async id=>{if(!window.confirm("Delete this project? This cannot be undone."))return;try{await axios.delete(`${apiBase}/projects/${id}`,headers);await load();}catch(e){setError("Unable to delete project.");}};
 return <div className="admin-page"><header className="admin-header"><div className="admin-header-inner"><div><p className="eyebrow">Portfolio CMS</p><h1 className="admin-title">{admin?.name?`Welcome, ${admin.name}`:"Dashboard"}</h1></div><button onClick={logout} className="btn btn-outline">Log out</button></div></header>
 <main className="admin-main"><div className="admin-summary"><div><span>CONTENT MANAGER</span><h2>Projects <small>{projects.length}</small></h2><p>Manage the work displayed on your developer portfolio.</p></div><button onClick={()=>setModal({...blank})} className="btn btn-primary">＋ Add project</button></div>
 {error&&<p className="admin-error">{error}</p>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Project</th><th>Category</th><th>Featured</th><th>Actions</th></tr></thead><tbody>{loading?<tr><td colSpan="4" className="empty-row">Loading projects…</td></tr>:projects.length===0?<tr><td colSpan="4" className="empty-row">No projects yet. Add your first project.</td></tr>:projects.map(p=><tr key={p._id}><td><strong>{p.title}</strong><small>{p.shortDescription||p.description}</small></td><td>{p.category||"Full-Stack"}</td><td>{p.featured?"Yes":"—"}</td><td className="actions"><button className="edit-link" onClick={()=>setModal(p)}>Edit</button><button className="delete-link" onClick={()=>remove(p._id)}>Delete</button></td></tr>)}</tbody></table></div></main>
 {modal&&<ProjectModal initial={modal} onClose={()=>setModal(null)} onSave={save}/>}</div>;
}
