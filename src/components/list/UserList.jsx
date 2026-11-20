import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers, useBulkDeleteCandidatesMutation } from "../../store/coreApi"; 
import { useSelector, useDispatch } from "react-redux";
import { changeCheckbox } from "../../store/kanbanSlice";
import { formatDate } from "../../utils/kanbanUtils";
import ResumeIcon from "../UI/icons/ResumeIcon";
import Pagination from "./Pagination";
import BulkActionsBar from "../UI/BulkActionsBar";
import * as styles from "./userList.module.css";

export default function UsersList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const selectedUID = useSelector((state) => state.kanban.selectedUID);
  const currentPage = useSelector((state) => state.pagination.currentPage);
  const pageSize = useSelector((state) => state.pagination.pageSize);
  const searchQuery = useSelector((state) => state.pagination.searchQuery);
  
  const { data: usersList = [], isLoading, error } = useUsers(searchQuery);
  
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  if (isLoading) return <div><p>Loading</p></div>;
  if (error) return <div><p>Error</p></div>;

  const sortedUsers = [...usersList].sort((a, b) => {
    if (!sortConfig.key) return 0;
    let aValue = a[sortConfig.key] || "";
    let bValue = b[sortConfig.key] || "";
    if (sortConfig.key === 'city') {
      aValue = a.address?.city || "";
      bValue = b.address?.city || "";
    }
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const startIndex = (currentPage - 1) * pageSize; 
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + pageSize); 

  const isAllSelected = paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUID.includes(u.id));
  
  const handleSelectAll = () => {
    if (isAllSelected) {
      paginatedUsers.forEach(u => {
        if (selectedUID.includes(u.id)) dispatch(changeCheckbox(u.id));
      });
    } else {
      paginatedUsers.forEach(u => {
        if (!selectedUID.includes(u.id)) dispatch(changeCheckbox(u.id));
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>
                <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
              </th>
              <th>ID</th>
              <th onClick={() => requestSort('firstName')} style={{cursor: 'pointer'}}>Name ↕</th>
              <th onClick={() => requestSort('city')} style={{cursor: 'pointer'}}>City ↕</th>
              <th>Title</th>
              <th>Resume</th>
              <th>Owner</th>
              <th>Source</th>
              <th>Profile request</th>
              <th>Profile updated</th>
              {/* Колонка Actions удалена */}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center", padding: "2rem" }}>
                  No candidates found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user, index) => {
                const displayId = startIndex + index + 1;
                return (
                  <tr
                    key={user.id}
                    onClick={() => navigate(`/user/${user.id}`)}
                    className={styles.row}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedUID.includes(user.id)}
                        onChange={() => dispatch(changeCheckbox(user.id))}
                      />
                    </td>
                    <td>{displayId}</td>
                    <td className={styles.nameCell}>
                      {user.firstName} {user.lastName}
                    </td>
                    <td>{user.address?.city}</td>
                    <td>{user.company?.title}</td>
                    <td>
                      <ResumeIcon />
                    </td>
                    <td>{user.company?.state || "Shrini"}</td>
                    <td>{user.address?.state || "Direct"}</td>
                    <td>{formatDate(user.birthDate)}</td>
                    <td>Not Available</td>
                    {/* Ячейка Actions удалена */}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationContainer}>
        <Pagination totalItems={usersList.length} />
      </div>

      <BulkActionsBar />
    </div>
  );
}