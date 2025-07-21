import { create } from "zustand";
import { Todo } from "../types/types";

interface TodoState {
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo | null) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  selectedTodo: null,
  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
}));
