import { NavLink, useLocation } from "react-router-dom";
import { useUsers } from "../../store/coreApi";
import UserIcon from "../UI/icons/UserIcon";
import CaseIcon from "../UI/icons/CaseIcon";
import PigIcon from "../UI/icons/PigIcon";
import * as styles from "./sidebar.module.css";

export default function Aside({ open, onClose }) {
  const location = useLocation();
  const isUserActive = location.pathname.startsWith("/user");

  const { data: users } = useUsers();
  const firstUserId = users?.[0]?.id || "";

  return (
    <>
      {open && <div className={styles.backdrop} onClick={onClose} />}

      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <nav>
          <ul className={styles.sidebarMenu}>
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                }
                aria-label="Kanban board"
              >
                <PigIcon />
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/list"
                className={({ isActive }) =>
                  isActive && !isUserActive
                    ? `${styles.navItem} ${styles.active}`
                    : styles.navItem
                }
                aria-label="Users list"
              >
                <CaseIcon />
              </NavLink>
            </li>
            <li>
              {firstUserId ? (
                <NavLink
                  to={`/user/${firstUserId}`}
                  className={`${styles.navItem} ${isUserActive ? styles.active : ""}`}
                  aria-label="User's page"
                >
                  <UserIcon />
                </NavLink>
              ) : (
                <span className={styles.navItem}>
                  <UserIcon />
                </span>
              )}
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}