import { Link } from "react-router-dom";
import AddIcon from "../UI/icons/AddIcon";
import SearchIcon from "../UI/icons/SearchIcon";
import * as styles from "./header.module.css";

export default function Header({ onMenu }) {
  return (
    <header className={styles.header}>
      <button
        className={styles.burgerBtn}
        onClick={onMenu}
        aria-label="Open menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      
      <div className={styles.searchWrapper}>
        <span className={styles.searchIcon}>
          <SearchIcon />
        </span>
        <input
          type="search"
          id="search"
          placeholder="Search by name, job, email & Linkedin URL"
          title="Search bar"
          className={styles.searchBar}
        />
      </div>

      <p className={styles.title}>CRM Recruit </p>

      <div className={styles.icons}>
        {/* Оборачиваем иконку в Link, чтобы она вела на страницу добавления */}
        <Link to="/list" style={{ textDecoration: "none" }} title="Go to Candidate List to add">
          <AddIcon className={styles.addIcon} />
        </Link>
      </div>
    </header>
  );
}