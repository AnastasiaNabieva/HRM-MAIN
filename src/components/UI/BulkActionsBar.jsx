import { useSelector, useDispatch } from "react-redux";
import { changeCheckbox } from "../../store/kanbanSlice";
import { useBulkDeleteCandidatesMutation } from "../../store/coreApi";
import TrashIcon from "./icons/TrashIcon";
import * as styles from "./bulkActionsBar.module.css";

export default function BulkActionsBar({ position = "center" }) {
  const dispatch = useDispatch();
  const selectedUID = useSelector((state) => state.kanban.selectedUID);
  const [bulkDelete, { isLoading }] = useBulkDeleteCandidatesMutation();

  if (selectedUID.length === 0) return null;

  const handleDelete = async () => {
    if (window.confirm(`Вы уверены, что хотите удалить ${selectedUID.length} кандидатов?`)) {
      try {
        await bulkDelete(selectedUID).unwrap();
        selectedUID.forEach(id => dispatch(changeCheckbox(id)));
      } catch (err) {
        alert("Ошибка при массовом удалении");
      }
    }
  };

  const positionClass = position === "right" ? styles.fixedRight : styles.fixed;

  return (
    <div className={`${styles.panel} ${positionClass}`}>
      <span className={styles.text}>
        Выбрано: <span>{selectedUID.length}</span>
      </span>
      <button onClick={handleDelete} disabled={isLoading} className={styles.deleteBtn}>
        <TrashIcon />
        {isLoading ? "Удаление..." : "Удалить выбранных"}
      </button>
    </div>
  );
}