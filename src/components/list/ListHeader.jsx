import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSearchQuery } from "../../store/paginationSlice";
import SquareIcon from "../UI/icons/SquareIcon";
import SearchIcon from "../UI/icons/SearchIcon";
import AddCandidateModal from "./AddCandidateModal";
import ResumeParserModal from "./ResumeParserModal"; 
import * as styles from "./listHeader.module.css";

export default function ListHeader() {
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState("Direct");
  
  const currentPage = useSelector((state) => state.pagination.currentPage);
  const searchQuery = useSelector((state) => state.pagination.searchQuery);

  const openAddModal = (source = "Direct") => {
    setModalSource(source);
    setIsAddModalOpen(true);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <SquareIcon />
          <p>Candidate list</p>
          <p className={styles.pageInfo}>Page {currentPage}</p>
        </div>

        <div className={styles.actionsGroup}>
          <div className={styles.dropdownWrapper}>
            <button
              type="button"
              className={styles.dropdownBtn}
              onClick={() => openAddModal("Direct")}
            >
              <span>+ Add candidate</span>
              <span onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}>⌵</span>
            </button>

            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownItem} onClick={() => openAddModal("Swiggy")}>Swiggy</div>
                <div className={styles.dropdownItem} onClick={() => openAddModal("LuxApp CRM")}>LuxApp CRM</div>
                <div className={styles.dropdownItem} onClick={() => openAddModal("Recruit App")}>Recruit App-mo</div>
              </div>
            )}
          </div>

          {/* Открывает модалку парсера */}
          <button 
            className={styles.slackButton} 
            onClick={() => setIsResumeModalOpen(true)}
          >
            Resume parser
          </button>

          <div className={styles.searchWrapper}>
            <SearchIcon />
            <input
              type="search"
              id="search"
              className={styles.searchInput}
              placeholder="Advanced search"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            />
          </div>
        </div>
      </header>

      {isAddModalOpen && (
        <AddCandidateModal 
          onClose={() => setIsAddModalOpen(false)} 
          defaultSource={modalSource} 
        />
      )}

      {isResumeModalOpen && (
        <ResumeParserModal 
          onClose={() => setIsResumeModalOpen(false)} 
        />
      )}
    </>
  );
}