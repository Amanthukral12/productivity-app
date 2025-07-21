import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { Todo } from "../types/types";

export const useTodos = () => {
  const queryClient = useQueryClient();

  const todosQuery = useQuery({
    queryKey: ["todo"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/todos");
      return data.data;
    },
  });

  const createTodosMutation = useMutation<
    Todo,
    Error,
    Partial<Todo>,
    { previousTodos?: Todo[] }
  >({
    mutationFn: async (formData) => {
      const { data } = await api.post<Todo>("/api/v1/todos/add", formData);
      return data;
    },
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });
      const previousTodos = queryClient.getQueryData<Todo[]>(["todo"]);
      queryClient.setQueryData<Todo[]>(["todo"], (oldTodos) => {
        return oldTodos
          ? [...oldTodos, { ...newTodo, id: Date.now() } as Todo]
          : [{ ...newTodo, id: Date.now() } as Todo];
      });
      return { previousTodos };
    },
    onError: (_, __, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todo"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });

  const deleteTodoMutation = useMutation<
    void,
    Error,
    string,
    { previousTodos?: Todo[] }
  >({
    mutationFn: async (todoId) => {
      await api.delete(`/api/v1/todos/${todoId}`);
    },
    onMutate: async (todoId) => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });
      const previousTodos = queryClient.getQueryData<Todo[]>(["todo"]);
      queryClient.setQueryData<Todo[]>(["todo"], (oldTodos) => {
        return oldTodos?.filter((todo) => todo.id !== Number(todoId)) || [];
      });
      return { previousTodos };
    },
    onError: (_, __, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todo"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });

  const updateTodoMutation = useMutation<
    Todo,
    Error,
    { todoId: string; formData: Partial<Todo> },
    { previousTodos?: Todo[] }
  >({
    mutationFn: async ({ todoId, formData }) => {
      const { data } = await api.put(`/api/v1/todos/${todoId}`, formData);
      return data;
    },
    onMutate: async ({ todoId, formData }) => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });
      const previousTodos = queryClient.getQueryData<Todo[]>(["todo"]);
      queryClient.setQueryData<Todo[]>(
        ["todo"],
        (oldTodos) =>
          oldTodos?.map((todo) =>
            todo.id === Number(todoId) ? { ...todo, formData } : todo
          ) || []
      );
      return { previousTodos };
    },
    onError: (_, __, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todo"], context.previousTodos);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });

  return {
    todosQuery,
    createTodosMutation,
    deleteTodoMutation,
    updateTodoMutation,
  };
};
