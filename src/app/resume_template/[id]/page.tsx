"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

type ResumeVersion = Record<string, any>;

export default function ResumeTemplatePage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [mutations, setMutations] = useState<ResumeVersion[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [error, setError] = useState("");
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMutations = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/resume-metadata?id=${id}`);
        if (!res.ok) throw new Error("Failed to fetch resume data.");
        const data = await res.json();

        if (!data.mutatedData || data.mutatedData.length === 0) {
          throw new Error("No mutated versions found.");
        }

        setMutations(data.mutatedData);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Error loading resume data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMutations();
  }, [id]);

  const handleDownload = async () => {
    if (!previewRef.current || selected === null) return;

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        margin: 0.3,
        filename: `resume_${id}_v${selected + 1}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(previewRef.current).save();
    } catch (err) {
      console.error("❌ PDF generation failed, fallback to print:", err);
      alert("PDF generation failed. Opening print dialog...");

      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write("<html><head><title>Resume</title>");
        printWindow.document.write(`<style>
          body { font-family: sans-serif; padding: 2rem; }
          h1, h2 { margin: 0.5rem 0; }
          ul, li { margin: 0; padding: 0; }
          .inline-skills li { display: inline-block; margin-right: 8px; background: #eee; padding: 2px 6px; border-radius: 4px; }
        </style>`);
        printWindow.document.write("</head><body>");
        printWindow.document.write(previewRef.current.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  const renderHTMLPreview = (resume: ResumeVersion) => {
    const { name, contact, skills, experience, education, projects } = resume;

    return (
      <div className="bg-white shadow p-6 rounded border border-gray-300 space-y-4 text-black">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-gray-700">
          📧 {contact?.email} | 📞 {contact?.phone} <br />
          🔗 {contact?.linkedin}
        </p>

        <section>
          <h2 className="text-xl font-semibold mt-4 mb-1">Skills</h2>
          <ul className="inline-skills flex flex-wrap gap-2 text-sm">
            {skills?.map((skill: string, i: number) => (
              <li key={i} className="bg-gray-200 px-2 py-1 rounded">
                {skill}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-4 mb-1">Experience</h2>
          {experience?.map((exp: any, i: number) => (
            <div key={i} className="mb-2">
              <p className="font-medium">
                {exp.role} @ {exp.company}
              </p>
              <p className="text-sm text-gray-600">{exp.dates}</p>
              <ul className="list-disc pl-5 text-sm space-y-1 mt-1">
                {exp.details?.map((line: string, j: number) => (
                  <li key={j}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-4 mb-1">Education</h2>
          {education?.map((edu: any, i: number) => (
            <p key={i}>
              🎓 {edu.degree} @ {edu.institution} ({edu.dates})
            </p>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-semibold mt-4 mb-1">Projects</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {projects?.map((proj: string, i: number) => (
              <li key={i}>{proj}</li>
            ))}
          </ul>
        </section>
      </div>
    );
  };

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6 text-black">
      <h1 className="text-2xl font-bold">Build Your Resume</h1>

      {loading && <p className="text-gray-500">Loading mutated versions...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <div className="space-y-3">
            {mutations.map((m, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`px-3 py-2 rounded border w-full text-left ${
                  selected === i
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                Select Version {i + 1}
              </button>
            ))}
          </div>

          {selected !== null && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Preview</h2>
              <div ref={previewRef}>
                {renderHTMLPreview(mutations[selected])}
              </div>

              <button
                onClick={handleDownload}
                className="mt-4 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                📥 Download as PDF
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
