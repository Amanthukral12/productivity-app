import { useNotes } from "../../hooks/notes";

const Notes = () => {
  const { notesQuery } = useNotes();
  const notes = notesQuery.data;
  console.log(notes);
  return <div>Notes</div>;
};

export default Notes;
