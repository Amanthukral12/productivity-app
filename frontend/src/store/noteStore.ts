import { create } from "zustand";
import { Note } from "../utils/types";

interface NotesState {
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  filterCategoryId: number | null;
  setFilterCategoryId: (categoryId: number | null) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  selectedNote: null,
  setSelectedNote: (note) => set({ selectedNote: note }),
  filterCategoryId: null,
  setFilterCategoryId: (categoryId) => set({ filterCategoryId: categoryId }),
}));
