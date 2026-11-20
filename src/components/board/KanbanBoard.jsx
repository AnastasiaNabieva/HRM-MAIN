import { useUsers } from "../../store/coreApi";
import { useUpdateCandidateStageMutation } from "../../store/boardApi";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { DEALS_STATUS } from "../../constants/kanbanConfig";
import KanbanColumn from "./KanbanColumn";
import KanbanCard from "./KanbanCard";
import BulkActionsBar from "../UI/BulkActionsBar"; 
import * as styles from "./kanban.module.css";
import { setUsers, moveUser } from "../../store/kanbanSlice";

function CardOverlay({ user }) {
  if (!user) return null;
  return (
    <div className={styles.card} style={{ cursor: 'grabbing', pointerEvents: 'none' }}>
      <input type="checkbox" checked={false} readOnly />
      <div className={styles.cardBody}>
        <span className={styles.cardTitle}>{user.company?.name}</span>
        <p className={styles.cardCompany}>{user.firstName} {user.lastName}</p>
        <p className={styles.cardPrice}>$&nbsp;{user.weight}</p> {/* <--- УБРАЛИ * 1000 */}
        <div className={styles.cardFooter}>
          <p className={styles.cardDate}>Created: <span>Today</span></p>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoard() {
  const dispatch = useDispatch();
  const [activeUser, setActiveUser] = useState(null);
  
  const { data: usersData, isLoading, error } = useUsers();
  const allUsers = useSelector((state) => state.kanban.users);
  const [updateStage] = useUpdateCandidateStageMutation();

  useEffect(() => {
    if (usersData) {
      dispatch(setUsers(usersData));
    }
  }, [usersData, dispatch]);

  const handleDragStart = (event) => {
    const user = allUsers.find((u) => u.id === event.active.id);
    setActiveUser(user);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveUser(null);
    if (!over) return;

    dispatch(moveUser({ userId: active.id, newStatusId: over.id }));
    updateStage({ id: active.id, stageId: over.id, positionInStage: 0 });
  };

  const totalPipeline = allUsers.reduce((acc, user) => acc + (user.weight || 0), 0);
  const totalWeighted = allUsers.reduce((acc, user) => {
    const status = DEALS_STATUS.find(s => s.id === user.statusId);
    return acc + ((user.weight || 0) * (status?.success || 0));
  }, 0);
  
  const wonDeals = allUsers.filter(u => u.statusId === 'won').reduce((acc, user) => acc + (user.weight || 0), 0);
  const lostDeals = allUsers.filter(u => u.statusId === 'lost').reduce((acc, user) => acc + (user.weight || 0), 0);

  if (isLoading) return <div><p>Loading...</p></div>;
  if (error) return <div><p>Ошибка загрузки данных</p></div>;

  return (
    <div>
      <div className={styles.deals}>
        <span className={styles.dealsTitle}>Deals</span>
        <div className={styles.summaryItem}>
          <span>Total Weighted Pipeline</span>
          <span className={styles.summaryValue}>${totalWeighted.toLocaleString()}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Total Pipeline</span>
          <span className={styles.summaryValue}>${totalPipeline.toLocaleString()}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabelGreen}>Deals Won</span>
          <span className={styles.summaryValueGreen}>${wonDeals.toLocaleString()}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabelRed}>Deals Lost</span>
          <span className={styles.summaryValueRed}>${lostDeals.toLocaleString()}</span>
        </div>
      </div>
      
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className={styles.kanbanContainer}>
          {DEALS_STATUS.map((status) => (
            <KanbanColumn key={status.id} status={status} />
          ))}
        </div>
        <DragOverlay>
          {activeUser ? <CardOverlay user={activeUser} /> : null}
        </DragOverlay>
      </DndContext>

      <BulkActionsBar position="right" />
    </div>
  );
}