import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { Category } from "../types/types";

export const useCategories = () => {
  const queryClient = useQueryClient();
  const categoriesQuery = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/category");
      return data.data;
    },
  });
  const createCategoryMutation = useMutation<
    Category,
    Error,
    Partial<Category>,
    { previousCategories?: Category[] }
  >({
    mutationFn: async (formData) => {
      const { data } = await api.post<Category>(
        "/api/v1/category/add",
        formData
      );

      return data;
    },
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ["category"] });
      const previousCategories = queryClient.getQueryData<Category[]>([
        "category",
      ]);

      queryClient.setQueryData<Category[]>(["category"], (oldCategories) => {
        const optimisticCategory = {
          ...newCategory,
          id: Date.now(),
        } as Category;
        return oldCategories
          ? [...oldCategories, optimisticCategory]
          : [optimisticCategory];
      });
      return { previousCategories };
    },
    onError: (_, __, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["category"], context.previousCategories);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });

  const updateCategoryMutation = useMutation<
    Category,
    Error,
    { categoryId: number; formData: Partial<Category> },
    { previousCategories?: Category[] }
  >({
    mutationFn: async ({ categoryId, formData }) => {
      const { data } = await api.patch<Category>(
        `/api/v1/category/${categoryId}`,
        formData
      );
      return data;
    },
    onMutate: async ({ categoryId, formData }) => {
      await queryClient.cancelQueries({ queryKey: ["category"] });
      const previousCategories = queryClient.getQueryData<Category[]>([
        "category",
      ]);
      queryClient.setQueryData<Category[]>(
        ["category"],
        (oldCategories) =>
          oldCategories?.map((category) =>
            Number(category.id) === categoryId
              ? { ...category, ...formData }
              : category
          ) || []
      );
      return { previousCategories };
    },
    onError: (_, __, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["category"], context.previousCategories);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });

  const deleteCategoryMutation = useMutation<
    void,
    Error,
    number,
    { previousCategories?: Category[] }
  >({
    mutationFn: async (categoryId) => {
      await api.delete(`/api/v1/category/${categoryId}`);
    },
    onMutate: async (categoryId) => {
      await queryClient.cancelQueries({ queryKey: ["category"] });
      const previousCategories = queryClient.getQueryData<Category[]>([
        "category",
      ]);
      queryClient.setQueryData<Category[]>(
        ["category"],
        (oldCategories) =>
          oldCategories?.filter((category) => category.id !== categoryId) || []
      );
      return { previousCategories };
    },
    onError: (_, __, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["category"], context.previousCategories);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["category"] });
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });
  return {
    categoriesQuery,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
};
