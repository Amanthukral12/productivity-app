import React, { useState } from "react";
import "./categoryForm.css";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../firebase.js";
import { useAuth } from "../../contexts/AuthContext.js";
const CategoriesForm = ({ shown, close, categories }) => {
  const [category, setCategory] = useState();
  const { currentUser } = useAuth();
  const userNotesCategoriesCollectionRef = collection(
    firestore,
    `users/${currentUser.uid}/categories`
  );
  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await addDoc(userNotesCategoriesCollectionRef, {
        name: category,
        timestamp: serverTimestamp(),
      });
      setCategory("");
    } catch (error) {
      console.log(error);
    }
  };

  return shown ? (
    <div
      className="form-backdrop"
      onClick={() => {
        close();
      }}
    >
      <div
        className="form-content"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="heading"> Manage Categories</h1>
        <form className="eventForm" onSubmit={(e) => addCategory(e)}>
          <label className="label">Title</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter new category"
            className="input"
          />
          <button className="submitButton" type="submit">
            Add Category
          </button>
        </form>
        <div className="categoriesList">
          <h1 className="categoriesHeading">Categories</h1>
          {categories.map((cat) => (
            <p className="category" key={cat.id}>
              {cat.name}
            </p>
          ))}
        </div>
      </div>
    </div>
  ) : null;
};

export default CategoriesForm;
