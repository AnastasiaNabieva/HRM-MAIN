import { useState } from "react";
import { useCreateCandidateMutation, useUpdateCandidateMutation } from "../../store/coreApi";
import * as styles from "./addCandidateModal.module.css";

export default function AddCandidateModal({ onClose, defaultSource, candidate = null, initialStageId = "open" }) {
  const isEdit = !!candidate;
  
  const [createCandidate, { isLoading: isCreating }] = useCreateCandidateMutation();
  const [updateCandidate, { isLoading: isUpdating }] = useUpdateCandidateMutation();
  const isLoading = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    firstName: candidate?.firstName || "",
    lastName: candidate?.lastName || "",
    email: candidate?.email || "",
    phone: candidate?.phone || "",
    position: candidate?.company?.name || "",
    location: candidate?.address?.city || "",
    salary: candidate?.weight ? candidate.weight * 1000 : 0,
    source: candidate?.address?.state || defaultSource || "", 
    birthDate: candidate?.birthDate || "", 
    stageId: candidate?.stageId || initialStageId, 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        salary: Number(formData.salary) || 0,
      };
      
      if (isEdit) {
        await updateCandidate({ id: candidate.id, ...dataToSend }).unwrap();
      } else {
        await createCandidate(dataToSend).unwrap();
      }
      onClose();
    } catch (err) {
      alert("Ошибка: " + JSON.stringify(err.data?.error?.details || err));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? "Edit Candidate" : "Add New Candidate"}</h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <input type="text" placeholder="First Name *" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
            <input type="text" placeholder="Last Name *" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          </div>

          <input type="email" placeholder="Email address *" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          
          <div className={styles.row}>
            <input type="text" placeholder="Phone number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            <input type="date" placeholder="Birth Date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} />
          </div>

          <div className={styles.row}>
            <input type="text" placeholder="City, Country" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            <input type="text" placeholder="Source (e.g. LinkedIn)" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} />
          </div>

          <div className={styles.row}>
            <input type="text" placeholder="Job Title" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} />
            <input type="number" placeholder="Salary ($)" value={formData.salary || ""} onChange={e => setFormData({...formData, salary: e.target.value})} />
          </div>
          
          <div className={styles.actions}>
            <button type="button" onClick={onClose} disabled={isLoading}>Cancel</button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : (isEdit ? "Update" : "Save Candidate")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}