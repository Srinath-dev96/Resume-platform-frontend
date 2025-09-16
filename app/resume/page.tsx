"use client";

import { useState, useEffect } from "react";
import api from "../../utils/api";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface Resume {
  _id: string;
  education: { degree: string; institution: string; year: string }[];
  skills: string[];
  projects: { title: string; description: string; link: string }[];
}

export default function ResumePage() {
  const router = useRouter();
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [education, setEducation] = useState({ degree: "", institution: "", year: "" });
  const [skill, setSkill] = useState("");
  const [project, setProject] = useState({ title: "", description: "", link: "" });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      router.push("/login");
      return;
    }
    setToken(savedToken);

    const fetchResume = async () => {
      try {
        const res = await api.get("/api/resumes", {
          headers: { Authorization: `Bearer ${savedToken}` },
        });
        setResume(res.data[0] || null);
      } catch (err) {
        console.error("❌ Fetch resume failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [router]);

  const createResume = async () => {
    if (!token) return;
    try {
      const res = await api.post(
        "/api/resumes/create",
        { education: [], skills: [], projects: [] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResume(res.data);
    } catch (err) {
      console.error("❌ Create resume failed:", err);
    }
  };

  const addEducation = async () => {
    if (!resume || !token) return;
    try {
      const res = await api.put(
        `/api/resumes/${resume._id}`,
        { education: [...resume.education, education] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResume(res.data);
      setEducation({ degree: "", institution: "", year: "" });
    } catch (err) {
      console.error("❌ Add education failed:", err);
    }
  };

  const addSkill = async () => {
    if (!resume || !token) return;
    try {
      const res = await api.put(
        `/api/resumes/${resume._id}`,
        { skills: [...resume.skills, skill] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResume(res.data);
      setSkill("");
    } catch (err) {
      console.error("❌ Add skill failed:", err);
    }
  };

  const addProject = async () => {
    if (!resume || !token) return;
    try {
      const res = await api.put(
        `/api/resumes/${resume._id}`,
        { projects: [...resume.projects, project] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResume(res.data);
      setProject({ title: "", description: "", link: "" });
    } catch (err) {
      console.error("❌ Add project failed:", err);
    }
  };

  const deleteResume = async () => {
    if (!resume || !token) return;
    if (!confirm("Are you sure you want to delete your resume?")) return;
    try {
      await api.delete(`/api/resumes/${resume._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResume(null);
    } catch (err) {
      console.error("❌ Delete resume failed:", err);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById("resume-content");
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("resume.pdf");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md space-y-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Resume Builder</h1>

      {!resume ? (
        <div className="text-center">
          <p className="mb-4 text-gray-600">No resume found.</p>
          <button
            onClick={createResume}
            className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition"
          >
            Create Resume
          </button>
        </div>
      ) : (
        <>
          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              onClick={downloadPDF}
              className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
            >
              Download PDF
            </button>
            <button
              onClick={deleteResume}
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
            >
              Delete Resume
            </button>
          </div>

          {/* Resume Content */}
          <div id="resume-content" className="space-y-6">
            {/* Education */}
            <div>
              <h2 className="font-semibold text-xl mb-2">Education</h2>
              <div className="space-y-2">
                {resume.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between bg-gray-50 p-2 rounded"
                  >
                    <span>{edu.degree}</span>
                    <span>{edu.institution}</span>
                    <span>{edu.year}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <input
                  placeholder="Degree"
                  value={education.degree}
                  onChange={(e) =>
                    setEducation({ ...education, degree: e.target.value })
                  }
                  className="border p-2 rounded w-1/3"
                />
                <input
                  placeholder="Institution"
                  value={education.institution}
                  onChange={(e) =>
                    setEducation({ ...education, institution: e.target.value })
                  }
                  className="border p-2 rounded w-1/3"
                />
                <input
                  placeholder="Year"
                  value={education.year}
                  onChange={(e) =>
                    setEducation({ ...education, year: e.target.value })
                  }
                  className="border p-2 rounded w-1/6"
                />
                <button
                  onClick={addEducation}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="font-semibold text-xl mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2 mb-2">
                {resume.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-green-300 transition"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Skill"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  className="border p-2 rounded flex-1"
                />
                <button
                  onClick={addSkill}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Projects */}
            <div>
              <h2 className="font-semibold text-xl mb-2">Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                {resume.projects.map((p, idx) => (
                  <div
                    key={idx}
                    className="border p-2 rounded shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="font-medium">{p.title}</h3>
                    <p>{p.description}</p>
                    <a href={p.link} className="text-blue-600" target="_blank">
                      {p.link}
                    </a>
                  </div>
                ))}
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  placeholder="Title"
                  value={project.title}
                  onChange={(e) => setProject({ ...project, title: e.target.value })}
                  className="border p-2 rounded flex-1"
                />
                <input
                  placeholder="Description"
                  value={project.description}
                  onChange={(e) =>
                    setProject({ ...project, description: e.target.value })
                  }
                  className="border p-2 rounded flex-1"
                />
                <input
                  placeholder="Link"
                  value={project.link}
                  onChange={(e) => setProject({ ...project, link: e.target.value })}
                  className="border p-2 rounded flex-1"
                />
                <button
                  onClick={addProject}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
