import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { Category } from "../utils/types";

export const useCategories = () => {
  const queryClient = useQueryClient();
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/category");
      return data.data;
    },
  });
  const createCategoryMutation = useMutation<
    Category,
    Error,
    { name: string },
    { previousCategories?: Category[] }
  >({
    mutationFn: async (newCategory) => {
      const { data } = await api.post<Category>(
        "/api/v1/category/add",
        newCategory
      );

      return data;
    },
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
      const previousCategories = queryClient.getQueryData<Category[]>([
        "categories",
      ]);
      //TODO: Check and test again after making the UI
      const tempCategory: Category = {
        id: Date.now() * -1,
        name: newCategory.name,
        userId: -1,
      };

      queryClient.setQueryData<Category[]>(["categories"], (old) =>
        old ? [...old, tempCategory] : [tempCategory]
      );
      return { previousCategories };
    },
    onError: (_, __, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(["categories"], context.previousCategories);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateCategoryMutation = useMutation<
    Category,
    Error,
    { categoryId: number; name: string }
  >({
    mutationFn: async ({ categoryId, name }) => {
      const { data } = await api.patch<Category>(
        `/api/v1/category/${categoryId}`,
        {
          name,
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategoryMutation = useMutation<void, Error, number>({
    mutationFn: async (categoryId) => {
      await api.delete(`/api/v1/category/${categoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
  return {
    categoriesQuery,
    createCategoryMutation,
    updateCategoryMutation,
    deleteCategoryMutation,
  };
};
