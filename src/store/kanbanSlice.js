import { createSlice } from "@reduxjs/toolkit";

const savedState = JSON.parse(localStorage.getItem("kanbanState"));

export const kanbanSlice = createSlice({
  name: "kanban",
  initialState: savedState || {
    selectedUID: [],
    users: [],
  },
  reducers: {
    changeCheckbox: (state, action) => {
      const id = action.payload;
      const index = state.selectedUID.indexOf(id);

      if (index !== -1) {
        state.selectedUID.splice(index, 1);
      } else {
        state.selectedUID.push(id);
      }
    },

    setUsers: (state, action) => {
      state.users = action.payload.map((user) => ({
        ...user,
        statusId: user.stageId, 
      }));
    },

    moveUser: (state, action) => {
      const { userId, newStatusId } = action.payload;
      const user = state.users.find((u) => u.id === userId);
      if (user) {
        user.statusId = newStatusId;
        user.stageId = newStatusId;
      }
    },
  },
});

export const { changeCheckbox, setUsers, moveUser } = kanbanSlice.actions;
export default kanbanSlice.reducer;