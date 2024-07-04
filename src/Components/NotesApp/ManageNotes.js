import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import "./ManageNotes.css";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore } from "../../firebase.js";
import { useAuth } from "../../contexts/AuthContext.js";
import CategoriesForm from "./CategoriesForm.js";
const ManageNotes = ({ addNote, currentNote, formType, updateNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { currentUser } = useAuth();

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

  useEffect(() => {
    const setNote = () => {
      const { title, content, category } = currentNote;
      setTitle(title);
      setContent(content);
      setCategory(category);
    };
    if (currentNote !== null) {
      setNote();
    }
  }, [currentNote]);

  const handleChange = (e) => {
    const val = e.target.value;
    switch (e.target.name) {
      case "title":
        setTitle(val);
        break;
      case "content":
        setContent(val);
        break;
      case "category":
        setCategory(val);
        break;
      default:
        console.log("error");
    }
  };

  const setFormType = () => {
    if (formType === "Add") {
      return (
        <button type="submit" className="addbutton" onClick={onSubmitHandler}>
          Add
        </button>
      );
    }
    return (
      <button type="submit" className="addbutton" onClick={onSubmitHandler}>
        Update
      </button>
    );
  };

  const onSubmitHandler = () => {
    const noteObj = { title, content, category };
    if (noteObj.content === "") {
      return;
    }
    formType === "Add"
      ? addNote(noteObj)
      : updateNote(noteObj, currentNote.id, currentNote.index);

    setTitle("");
    setContent("");
    setCategory("");
  };
  return (
    <Card className="manageNotesRoot">
      <CardContent className="manageNotesForm">
        <input
          placeholder="Add a Title..."
          label="Title"
          name="title"
          onChange={handleChange}
          value={title}
          className="titleInput"
        />
        <textarea
          rows={10}
          placeholder="Add a Note..."
          name="content"
          value={content}
          onChange={handleChange}
          className="contentInput"
        />
        <select name="category" value={category} onChange={handleChange}>
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button onClick={() => setShowForm(!showForm)}>
          Manage Categories
        </button>
        <CategoriesForm
          shown={showForm}
          close={() => setShowForm(!showForm)}
          categories={categories}
        />
        {setFormType()}
      </CardContent>
    </Card>
  );
};

export default ManageNotes;
