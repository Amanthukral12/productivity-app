import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { Note } from "../utils/types";

export const useNotes = () => {
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/notes");
      return data.data;
    },
  });

  const createNotesMutation = useMutation<
    Note,
    Error,
    { title: string; content: string; categoryIds: number[] },
    { previousNotes?: Note[] }
  >({
    mutationFn: async (newNote) => {
      const { data } = await api.post<Note>("/api/v1/notes/add", newNote);
      return data;
    },
    onMutate: async (newNote) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["notes"]);
      queryClient.setQueryData<Note[]>(["notes"], (old) =>
        old ? [...old, newNote] : [newNote]
      );
      return { previousNotes };
    },
    onError: (_, __, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["notes"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteNoteMutation = useMutation<void, Error, number>({
    mutationFn: async (noteId) => {
      await api.delete(`/api/v1/notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const useNoteByIdQuery = (noteId: number) => {
    return useQuery<Note, Error>({
      queryKey: ["notes", noteId],
      queryFn: async () => {
        const { data } = await api.get(`/api/v1/notes/${noteId}`);
        return data.data;
      },
      enabled: !!noteId,
    });
  };

  const updateNotesMutation = useMutation<
    Note,
    Error,
    { noteId: number; title: string; content: string; categoryIds: number[] }
  >({
    mutationFn: async ({ noteId, title, content, categoryIds }) => {
      const { data } = await api.put<Note>(`/api/v1/notes/${noteId}`, {
        title,
        content,
        categoryIds,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return {
    notesQuery,
    createNotesMutation,
    deleteNoteMutation,
    useNoteByIdQuery,
    updateNotesMutation,
  };
};
