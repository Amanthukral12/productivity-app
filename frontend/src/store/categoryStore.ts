import { create } from "zustand";
import { Category } from "../types/types";

interface CategoryState {
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  selectedCategory: null,
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
