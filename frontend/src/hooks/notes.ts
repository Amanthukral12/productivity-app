import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import { Note } from "../types/types";

export const useNotes = () => {
  const queryClient = useQueryClient();

  const notesQuery = useQuery({
    queryKey: ["note"],
    queryFn: async () => {
      const { data } = await api.get("/api/v1/notes");
      return data.data;
    },
  });

  const createNotesMutation = useMutation<
    Note,
    Error,
    Partial<Note>,
    { previousNotes?: Note[] }
  >({
    mutationFn: async (formData) => {
      const { data } = await api.post<Note>("/api/v1/notes/add", formData);
      return data;
    },
    onMutate: async (newNote) => {
      await queryClient.cancelQueries({ queryKey: ["note"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["note"]);
      queryClient.setQueryData<Note[]>(["note"], (oldNotes) => {
        return oldNotes
          ? [...oldNotes, { ...newNote, id: Date.now().toString() } as Note]
          : [{ ...newNote, id: Date.now().toString() } as Note];
      });
      return { previousNotes };
    },
    onError: (_, __, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["note"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });

  const deleteNoteMutation = useMutation<
    void,
    Error,
    string,
    { previousNotes?: Note[] }
  >({
    mutationFn: async (noteId) => {
      await api.delete(`/api/v1/notes/${noteId}`);
    },
    onMutate: async (noteId) => {
      await queryClient.cancelQueries({ queryKey: ["note"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["note"]);
      queryClient.setQueryData<Note[]>(
        ["note"],
        (oldNotes) => oldNotes?.filter((note) => note.id !== noteId) || []
      );
      return { previousNotes };
    },
    onError: (_, __, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["note"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });

  const updateNoteMutation = useMutation<
    Note,
    Error,
    {
      noteId: number;
      formData: Partial<Note>;
    },
    { previousNotes?: Note[] }
  >({
    mutationFn: async ({ noteId, formData }) => {
      const { data } = await api.put(`/api/v1/notes/${noteId}`, formData);
      return data;
    },
    onMutate: async ({ noteId, formData }) => {
      await queryClient.cancelQueries({ queryKey: ["note"] });
      const previousNotes = queryClient.getQueryData<Note[]>(["note"]);
      queryClient.setQueryData<Note[]>(
        ["note"],
        (oldNotes) =>
          oldNotes?.map((note) =>
            Number(note.id) === noteId ? { ...note, formData } : note
          ) || []
      );
      return { previousNotes };
    },
    onError: (_, __, context) => {
      if (context?.previousNotes) {
        queryClient.setQueryData(["note"], context.previousNotes);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });

  return {
    notesQuery,
    createNotesMutation,
    deleteNoteMutation,
    updateNoteMutation,
  };
};
