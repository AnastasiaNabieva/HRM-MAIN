import { useState, useRef } from "react";
import { useUploadResumeMutation } from "../../store/parserApi";
import * as styles from "./addCandidateModal.module.css";

export default function ResumeParserModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadResume, { isLoading }] = useUploadResumeMutation();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    
    const formData = new FormData();
    formData.append("resume", file);

    try {
      await uploadResume(formData).unwrap();
      window.location.reload();
      onClose();
    } catch (err) {
      alert("Ошибка при загрузке файла");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ width: '500px' }}>
        <h2>Resume Parser</h2>
        <p style={{ color: 'var(--button-grey)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Upload a resume file (PDF, DOCX, TXT). The system will extract the candidate's name and create a profile.
        </p>

        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--button-blue)' : 'var(--border-color)'}`,
            borderRadius: 'var(--radius-small)',
            padding: '3rem 2rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragging ? 'rgba(112, 127, 221, 0.05)' : 'var(--background-accent)',
            transition: 'all 0.2s'
          }}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept=".pdf,.doc,.docx,.txt"
          />
          {file ? (
            <div>
              <p style={{ fontWeight: 'bold', color: 'var(--button-blue)' }}>{file.name}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--button-grey)' }}>{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          ) : (
            <div>
              <p>Drag & drop your resume here</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--button-grey)', marginTop: '0.5rem' }}>or click to browse files</p>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button type="button" onClick={onClose} disabled={isLoading}>Cancel</button>
          <button 
            type="button" 
            onClick={handleSubmit} 
            disabled={!file || isLoading}
            style={{ backgroundColor: 'var(--button-blue)', color: 'white' }}
          >
            {isLoading ? "Uploading..." : "Upload & Parse"}
          </button>
        </div>
      </div>
    </div>
  );
}