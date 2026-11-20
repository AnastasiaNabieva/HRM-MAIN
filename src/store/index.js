import { configureStore } from "@reduxjs/toolkit";
import { coreApi } from "./coreApi";
import { boardApi } from "./boardApi";
import { parserApi } from "./parserApi";
import kanbanReducer from "./kanbanSlice";
import paginationReducer from "./paginationSlice";

export const store = configureStore({
  reducer: {
    [coreApi.reducerPath]: coreApi.reducer,
    [boardApi.reducerPath]: boardApi.reducer,
    [parserApi.reducerPath]: parserApi.reducer,
    kanban: kanbanReducer,
    pagination: paginationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(coreApi.middleware)
      .concat(boardApi.middleware)
      .concat(parserApi.middleware),
});

store.subscribe(() => {
  localStorage.setItem("kanbanState", JSON.stringify(store.getState().kanban));
});