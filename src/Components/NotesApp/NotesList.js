import React, { useEffect, useMemo, useState } from "react";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import "./NotesList.css";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore } from "../../firebase.js";
import { useAuth } from "../../contexts/AuthContext.js";

const NotesList = ({ notes, deleteNote, selectNote }) => {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const userNotesCategoriesCollectionRef = collection(
    firestore,
    `users/${currentUser.uid}/categories`
  );

  useEffect(() => {
    let isMounted = true;
    const getCategories = async () => {
      const categoriesData = query(
        userNotesCategoriesCollectionRef,
        orderBy("timestamp", "desc")
      );
      return onSnapshot(categoriesData, (querySnapshot) => {
        const updatedCategories = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        if (isMounted) setCategories(updatedCategories);
      });
    };
    getCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredNotes = useMemo(() => {
    if (selectedCategory === "") {
      return notes;
    } else {
      return notes.filter((note) => note.category === selectedCategory);
    }
  }, [notes, selectedCategory]);

  return (
    <div className="notesListContainer">
      <div
        className="categoriesBarWrapper"
        style={{ maxWidth: "100%", overflow: "auto" }}
      >
        <div className="categoriesBar" style={{ display: "inline-flex" }}>
          <p
            className={`category ${selectedCategory === "" ? "selected" : ""}`}
            onClick={() => setSelectedCategory("")}
          >
            #All
          </p>
          {categories.map((cat) => (
            <p
              className={`category ${
                selectedCategory === cat.name ? "selected" : ""
              }`}
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
            >
              #{cat.name}
            </p>
          ))}
        </div>
      </div>
      {filteredNotes.length === 0 ? (
        <div className="notesMessage">No notes for this category</div>
      ) : (
        <>
          {filteredNotes.map((note, index) => (
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
          ))}
        </>
      )}
    </div>
  );
};

export default NotesList;
