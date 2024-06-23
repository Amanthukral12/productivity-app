import React from "react";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import "./NotesList.css";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Masonry from "react-masonry-css";
const NotesList = ({ notes, deleteNote, selectNote }) => {
  const breakpoints = {
    default: 1,
    1100: 1,
    700: 1,
  };
  const noteList = notes.map((note, index) => {
    return (
      <div className="notesListRoot" key={index}>
        <Card className="notesCard" elevation={1}>
          <CardHeader title={note.title} />
          <hr className="line" />
          <CardContent>
            <p className="notesContent">{note.content}</p>

            <div className="actions">
              <button
                className="actionButton"
                onClick={() => {
                  selectNote(index);
                }}
              >
                <MdEdit className="notesIcon" />
              </button>
              <button
                className="actionButton"
                onClick={() => {
                  deleteNote(note.id);
                }}
              >
                <MdDelete className="notesIcon" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  });

  return (
    <Masonry
      breakpointCols={breakpoints}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {noteList}
    </Masonry>
  );
};

export default NotesList;
