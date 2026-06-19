import React, { useState } from "react";
import axios from "axios";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AIPanel() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  
  // 1. Pros & Cons State Arrays
  const [pros, setPros] = useState([]);
  const [cons, setCons] = useState([]);

  // Handle file selection from input
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

  // Handle API submission to your backend architecture
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file); // Matches backend Multer upload key definition

    setLoading(true);
    setError("");
    
    // 2. Reset visual state slots before parsing network payloads
    setSummary("");
    setPros([]);
    setCons([]);

    try {
      // Dynamic fallback configuration pointing to your live production Render engine
      const backendUrl = import.meta.env.VITE_API_URL || "https://aspira-backend.onrender.com";
      
      const response = await axios.post(
        `${backendUrl}/api/ai/summarize`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // Manages cookie/session lifecycles cleanly
        },
      );

      // 3. Populate matching UI arrays on successful network execution
      if (response.data.success) {
        setSummary(response.data.summary);
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
        {/* Drag & Drop Visual Wrapper Dropzone */}
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

        {/* Submit Action Button */}
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

      {/* Error Message Conditional Alert State Banner */}
      {error && (
        <div style={styles.errorBanner}>
          <AlertCircle
            size={20}
            color="#ef4444"
            style={{ marginRight: 8, flexShrink: 0 }}
          />
          <span>{error}</span>
        </div>
      )}

      {/* AI Output Response Terminal Card Section */}
      {summary && (
        <div style={styles.resultCard}>
          <div style={styles.resultHeader}>
            <CheckCircle2
              size={20}
              color="#10b981"
              style={{ marginRight: 8 }}
            />
            <h3 style={styles.resultTitle}>Executive Summary Results</h3>
          </div>
          <p style={styles.summaryText}>{summary}</p>
        </div>
      )}

      {/* 4. Pros & Cons Review Grid Block Layout */}
      {(pros.length > 0 || cons.length > 0) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginTop: "16px",
          }}
        >
          {/* Pros Card column */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
            }}
          >
            <h4
              style={{
                color: "#166534",
                margin: "0 0 10px 0",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
              ⭐ Strengths (Pros)
            </h4>
            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                color: "#14532d",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            >
              {pros.map((pro, index) => (
                <li key={index} style={{ marginBottom: "6px" }}>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          {/* Cons Card column */}
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fff5f5",
              border: "1px solid #fed7d7",
              borderRadius: "8px",
            }}
          >
            <h4
              style={{
                color: "#9b1c1c",
                margin: "0 0 10px 0",
                fontSize: "15px",
                fontWeight: "700",
              }}
            >
              ⚠️ Improvements (Cons)
            </h4>
            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                color: "#771d1d",
                fontSize: "13px",
                lineHeight: "1.6",
              }}
            >
              {cons.map((con, index) => (
                <li key={index} style={{ marginBottom: "6px" }}>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline CSS Styles Definition
const styles = {
  container: {
    maxWidth: "650px",
    margin: "40px auto",
    padding: "24px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    fontFamily: "system-ui, sans-serif",
  },
  header: { marginBottom: "24px", textAlign: "center" },
  title: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "8px",
  },
  subtitle: { fontSize: "14px", color: "#64748b", lineHeight: "1.5" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  dropzone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    border: "2px dashed",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: "#f8fafc",
  },
  hiddenInput: { display: "none" },
  dropzoneText: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#334155",
    textAlign: "center",
  },
  fileSize: { fontSize: "12px", color: "#64748b", marginTop: "4px" },
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: "6px",
    color: "#991b1b",
    fontSize: "14px",
  },
  resultCard: {
    marginTop: "24px",
    padding: "20px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
  },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    borderBottom: "1px solid #dcfce7",
    paddingBottom: "8px",
  },
  resultTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#166534",
    margin: 0,
  },
  summaryText: {
    fontSize: "14px",
    color: "#14532d",
    lineHeight: "1.6",
    margin: 0,
  },
  spinner: { animation: "spin 1s linear infinite" },
};

if (typeof document !== "undefined") {
  const styleSheet =
    document.styleSheets[0] ||
    document.head.appendChild(document.createElement("style")).sheet;
  try {
    styleSheet.insertRule(
      "@keyframes spin { to { transform: rotate(360deg); } }",
      styleSheet.cssRules.length,
    );
  } catch (e) {}
}