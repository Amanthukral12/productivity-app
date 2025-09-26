import { create } from "zustand";
import { Todo } from "../types/types";

interface TodoState {
  selectedTodo: Todo | null;
  isReminderEnabled: boolean | null;
  priority: string;
  dueDateSort: string;
  setIsReminderEnabled: (isEnabled: boolean | null) => void;
  setPriority: (priority: string) => void;
  setDueDateSort: (sortOrder: string) => void;
  setSelectedTodo: (todo: Todo | null) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  selectedTodo: null,
  isReminderEnabled: null,
  priority: "LOW",
  dueDateSort: "desc",
  setIsReminderEnabled: (isEnabled) => set({ isReminderEnabled: isEnabled }),
  setPriority: (priority) => set({ priority }),
  setSelectedTodo: (todo) => set({ selectedTodo: todo }),
  setDueDateSort: (sortOrder) => set({ dueDateSort: sortOrder }),
}));
