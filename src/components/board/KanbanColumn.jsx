import { totalAmount, weightedAmount } from "../../utils/kanbanUtils";
import { useSelector, useDispatch } from "react-redux";
import { useDroppable } from "@dnd-kit/core";
import { changeCheckbox } from "../../store/kanbanSlice";
import KanbanCard from "./KanbanCard";
import * as styles from "./kanban.module.css";

export default function KanbanColumn({ status }) {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.kanban.users);
  const selectedUID = useSelector((state) => state.kanban.selectedUID);
  
  const columnUsers = allUsers?.filter((user) => user.stageId === status.id) || [];

  const total = totalAmount(columnUsers);
  
  const weighted = status?.success === 0 
    ? total 
    : weightedAmount(total, status?.success);

  const { setNodeRef } = useDroppable({
    id: status.id,
  });

  const isAllSelected = columnUsers.length > 0 && columnUsers.every(u => selectedUID.includes(u.id));
  const isSomeSelected = columnUsers.some(u => selectedUID.includes(u.id));

  const handleSelectAllInColumn = () => {
    if (isAllSelected) {
      columnUsers.forEach(u => {
        if (selectedUID.includes(u.id)) dispatch(changeCheckbox(u.id));
      });
    } else {
      columnUsers.forEach(u => {
        if (!selectedUID.includes(u.id)) dispatch(changeCheckbox(u.id));
      });
    }
  };

  return (
    <div ref={setNodeRef} className={styles.columnWrapper}>
      <div className={styles.column}>
        <label className={styles.columnHeader}>
          <input 
            type="checkbox" 
            checked={isAllSelected}
            ref={input => {
              if (input) {
                input.indeterminate = isSomeSelected && !isAllSelected;
              }
            }}
            onChange={handleSelectAllInColumn}
            aria-label={`Select all in ${status.title}`} 
          />
          <span>{status.title}</span>
        </label>

        <div className={styles.cardsList}>
          {columnUsers?.map((user) => (
            <KanbanCard key={user.id} user={user} />
          ))}
        </div>
      </div>

      <div className={styles.amount}>
        <div className={styles.weight}>
          Weighted amount <span>$&nbsp;{weighted}</span>{" "}
        </div>
        <div className={styles.total}>
          Total amount <span>$&nbsp;{total}</span>
        </div>
      </div>
    </div>
  );
}