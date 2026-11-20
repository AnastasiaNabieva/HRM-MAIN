import { useState } from "react";
import { useParams } from "react-router-dom";
import { useUserById } from "../../store/coreApi"; 
import { useUpdateCandidateStageMutation } from "../../store/boardApi";
import Map from "./Map";
import AddCandidateModal from "../list/AddCandidateModal";
import * as styles from "./userRpofile.module.css";

export default function Profile() {
  const { id } = useParams();
  const { data, isLoading, error } = useUserById(id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [updateStage, { isLoading: isUpdatingStage }] = useUpdateCandidateStageMutation();

  if (isLoading) return <div><p>Loading</p></div>;
  if (error) return <div><p>Error</p></div>;

  const isOnBoard = !!data?.stageId;

  const handleMoveToBoard = async () => {
    await updateStage({ id: data.id, stageId: "open", positionInStage: 0 }).unwrap();
  };

  const handleRemoveFromBoard = async () => {
    await updateStage({ id: data.id, stageId: null, positionInStage: 0 }).unwrap();
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerCard}>
        <img src={data?.image} alt="User avatar" className={styles.avatar} />
        <div className={styles.headerInfo}>
          <div className={styles.nameRow}>
            <h1 className={styles.name}>
              {data?.firstName} {data?.lastName}
            </h1>
            <span className={styles.cityBadge}>{data?.address?.city}</span>
            
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
              {isOnBoard ? (
                <button 
                  onClick={handleRemoveFromBoard}
                  disabled={isUpdatingStage}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--background-accent)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-small)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: 'var(--text-color)',
                    fontFamily: 'var(--font)'
                  }}
                >
                  Remove from Board
                </button>
              ) : (
                <button 
                  onClick={handleMoveToBoard}
                  disabled={isUpdatingStage}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'var(--button-blue)',
                    border: 'none',
                    borderRadius: 'var(--radius-small)',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: 'white',
                    fontFamily: 'var(--font)'
                  }}
                >
                  Add to Board
                </button>
              )}

              <button 
                onClick={() => setIsEditModalOpen(true)}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'var(--background-accent)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-small)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontFamily: 'var(--font)',
                  color: 'var(--text-color)'
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
          <p className={styles.title}>
            {data?.company?.title || "Specialist"} • {data?.company?.name}
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Candidate Details</h2>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{data?.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Phone</span>
              <span className={styles.infoValue}>{data?.phone}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Company</span>
              <span className={styles.infoValue}>{data?.company?.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Department</span>
              <span className={styles.infoValue}>{data?.company?.department}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Education</span>
              <span className={styles.infoValue}>{data?.university}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Age / Gender</span>
              <span className={styles.infoValue}>
                {data?.age} y.o., {data?.gender}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Location</h2>
          <p className={styles.addressText}>
            {data?.address?.address}, {data?.address?.city}, {data?.address?.state}
          </p>
          <div className={styles.mapContainer}>
            <Map
              lat={data?.address?.coordinates?.lat}
              lng={data?.address?.coordinates?.lng}
            />
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <AddCandidateModal 
          onClose={() => setIsEditModalOpen(false)} 
          candidate={data} 
        />
      )}
    </div>
  );
}