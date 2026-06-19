import React, { useState } from "react";
import axios from "axios";
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AIPanel() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summaryBullets, setSummaryBullets] = useState([]);
  const [atsScore, setAtsScore] = useState(null);
  const [error, setError] = useState("");
  const [pros, setPros] = useState([]);
  const [cons, setCons] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
      setFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError("");
    setSummaryBullets([]);
    setAtsScore(null);
    setPros([]);
    setCons([]);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || "https://aspira-backend.onrender.com";
      
      const response = await axios.post(
        `${backendUrl}/api/ai/summarize`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setSummaryBullets(response.data.summary_bullets || []);
        setAtsScore(response.data.ats_score);
        setPros(response.data.pros || []);
        setCons(response.data.cons || []);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "Something went wrong while processing your resume.",
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper utility to dynamically determine score color thresholds
  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981"; // Vibrant Green
    if (score >= 55) return "#f59e0b"; // Clean Amber Orange
    return "#ef4444"; // Warning Red
  };

  // SVG Radial Ring Metric Calculations
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = atsScore ? circumference - (atsScore / 100) * circumference : circumference;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>AI Resume Summarizer</h2>
        <p style={styles.subtitle}>
          Upload your PDF resume to generate an instant, executive AI summary
          tailored for hiring managers.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <label
          style={{
            ...styles.dropzone,
            borderColor: file ? "#10b981" : "#cbd5e1",
          }}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={styles.hiddenInput}
          />
          <UploadCloud
            size={40}
            color={file ? "#10b981" : "#64748b"}
            style={{ marginBottom: 12 }}
          />
          <span style={styles.dropzoneText}>
            {file ? file.name : "Click to browse or drop your resume PDF here"}
          </span>
          {file && (
            <span style={styles.fileSize}>
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          )}
        </label>

        <button
          type="submit"
          disabled={loading || !file}
          style={{
            ...styles.button,
            backgroundColor: loading || !file ? "#94a3b8" : "#3b82f6",
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} style={styles.spinner} />
              Analyzing with BART Model...
            </>
          ) : (
            "Generate AI Summary"
          )}
        </button>
      </form>

      {error && (
        <div style={styles.errorBanner}>
          <AlertCircle size={20} color="#ef4444" style={{ marginRight: 8, flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* 💻 GAUGED VISUAL HEADER LAYER */}
      {atsScore !== null && (
        <div style={{ ...styles.resultCard, display: "flex", alignItems: "center", gap: "24px" }}>
          
          {/* FIXED CIRCLE PROGRESS CONTAINER */}
          <div style={{ position: "relative", width: "90px", height: "90px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="90" height="90" style={{ transform: "rotate(-90deg)", width: "90px", height: "90px" }}>
              <circle 
                cx="45" 
                cy="45" 
                r={radius} 
                fill="transparent" 
                stroke="#e2e8f0" 
                strokeWidth="6" 
              />
              <circle
                cx="45"
                cy="45"
                r={radius}
                fill="transparent"
                stroke={getScoreColor(atsScore)}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
              />
            </svg>
            <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "#1e293b", lineHeight: 1 }}>{atsScore}</span>
              <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "700", marginTop: "2px" }}>ATS</span>
            </div>
          </div>

          {/* Right side Text Area holding our generated arrays */}
          <div style={{ flexGrow: 1 }}>
            <div style={styles.resultHeader}>
              <CheckCircle2 size={18} color="#10b981" style={{ marginRight: 6 }} />
              <h3 style={styles.resultTitle}>Executive AI Assessment</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: "16px", color: "#14532d", fontSize: "13px", lineHeight: "1.6" }}>
              {summaryBullets.map((bullet, idx) => (
                <li key={idx} style={{ marginBottom: "4px" }}>
                  {bullet.endsWith('.') ? bullet : `${bullet}.`}
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

      {(pros.length > 0 || cons.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "16px" }}>
          <div style={{ padding: "16px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px" }}>
            <h4 style={{ color: "#166534", margin: "0 0 10px 0", fontSize: "15px", fontWeight: "700" }}>⭐ Strengths (Pros)</h4>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#14532d", fontSize: "13px", lineHeight: "1.6" }}>
              {pros.map((pro, index) => (
                <li key={index} style={{ marginBottom: "6px" }}>{pro}</li>
              ))}
            </ul>
          </div>

          <div style={{ padding: "16px", backgroundColor: "#fff5f5", border: "1px solid #fed7d7", borderRadius: "8px" }}>
            <h4 style={{ color: "#9b1c1c", margin: "0 0 10px 0", fontSize: "15px", fontWeight: "700" }}>⚠️ Improvements (Cons)</h4>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#771d1d", fontSize: "13px", lineHeight: "1.6" }}>
              {cons.map((con, index) => (
                <li key={index} style={{ marginBottom: "6px" }}>{con}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "650px", margin: "40px auto", padding: "24px", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", fontFamily: "system-ui, sans-serif" },
  header: { marginBottom: "24px", textAlign: "center" },
  title: { fontSize: "24px", fontWeight: "700", color: "#1e293b", marginBottom: "8px" },
  subtitle: { fontSize: "14px", color: "#64748b", lineHeight: "1.5" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  dropzone: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px", border: "2px dashed", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s ease", backgroundColor: "#f8fafc" },
  hiddenInput: { display: "none" },
  dropzoneText: { fontSize: "14px", fontWeight: "500", color: "#334155", textAlign: "center" },
  fileSize: { fontSize: "12px", color: "#64748b", marginTop: "4px" },
  button: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", border: "none", borderRadius: "6px", color: "#ffffff", fontSize: "15px", fontWeight: "600", cursor: "pointer", transition: "background-color 0.2s" },
  errorBanner: { display: "flex", alignItems: "center", marginTop: "16px", padding: "12px", backgroundColor: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "6px", color: "#991b1b", fontSize: "14px" },
  resultCard: { marginTop: "24px", padding: "20px", backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "8px" },
  resultHeader: { display: "flex", alignItems: "center", marginBottom: "8px", borderBottom: "1px solid #dcfce7", paddingBottom: "4px" },
  resultTitle: { fontSize: "15px", fontWeight: "700", color: "#166534", margin: 0 },
  spinner: { animation: "spin 1s linear infinite" },
};

if (typeof document !== "undefined") {
  const styleSheet = document.styleSheets[0] || document.head.appendChild(document.createElement("style")).sheet;
  try {
    styleSheet.insertRule("@keyframes spin { to { transform: rotate(360deg); } }", styleSheet.cssRules.length);
  } catch (e) {}
}