import { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function Uploader({ onTextExtracted, isLoading }) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef();

  async function extractText(file) {
    if (!file || file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    setFileName(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(" ");
      fullText += pageText + "\n";
    }
    onTextExtracted(fullText);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    extractText(e.dataTransfer.files[0]);
  }

  return (
    <div
      onClick={() => !isLoading && inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      style={{
        border: `1.5px dashed ${dragging ? "var(--purple)" : "var(--border2)"}`,
        borderRadius: "16px",
        padding: "48px 24px",
        textAlign: "center",
        cursor: isLoading ? "not-allowed" : "pointer",
        background: dragging ? "rgba(139,92,246,0.08)" : "var(--card)",
        transition: "all 0.25s",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {dragging && (
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at center, rgba(139,92,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      )}
      <input ref={inputRef} type="file" accept="application/pdf"
        style={{ display: "none" }} onChange={e => extractText(e.target.files[0])} />

      <div style={{
        width: "56px", height: "56px", borderRadius: "14px",
        background: "rgba(139,92,246,0.15)", border: "1px solid var(--border2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 16px",
      }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
          stroke="var(--purple2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="12" y1="18" x2="12" y2="12"/>
          <line x1="9" y1="15" x2="15" y2="15"/>
        </svg>
      </div>

      {isLoading ? (
        <>
          <p style={{ color: "var(--purple2)", fontWeight: 600, fontSize: "15px", marginBottom: "6px" }}>
            Analyzing your contract...
          </p>
          <p style={{ color: "var(--text3)", fontSize: "13px" }}>This usually takes 10–20 seconds</p>
        </>
      ) : fileName ? (
        <p style={{ color: "var(--green)", fontWeight: 600, fontSize: "14px" }}>
          ✓ {fileName} — click to upload a different file
        </p>
      ) : (
        <>
          <p style={{ fontWeight: 600, color: "var(--text)", fontSize: "15px", marginBottom: "8px" }}>
            Drop your PDF here or click to browse
          </p>
          <p style={{ color: "var(--text3)", fontSize: "13px", marginBottom: "20px" }}>
            Works with NDAs, offer letters, leases, employment contracts
          </p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            {["NDA", "Offer Letter", "Lease", "Employment", "Terms of Service"].map(tag => (
              <span key={tag} style={{
                fontSize: "11px", fontWeight: 600, padding: "4px 10px",
                borderRadius: "20px", background: "rgba(139,92,246,0.1)",
                border: "1px solid var(--border2)", color: "var(--purple2)",
              }}>{tag}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}