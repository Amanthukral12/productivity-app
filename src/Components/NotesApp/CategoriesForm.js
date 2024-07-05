import React, { useState } from "react";
import "./categoryForm.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase.js";
import { useAuth } from "../../contexts/AuthContext.js";
import { MdDelete } from "react-icons/md";
const CategoriesForm = ({ shown, close, categories, setCategories }) => {
  const [category, setCategory] = useState("");
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

  const deleteCategory = async (categoryId, categoryName) => {
    try {
      const notescategoryDoc = doc(
        firestore,
        `users/${currentUser.uid}/categories/${categoryId}`
      );
      await deleteDoc(notescategoryDoc);
      const userNotesCollectionRef = collection(
        firestore,
        `users/${currentUser.uid}/notes`
      );
      const notesData = query(
        userNotesCollectionRef,
        where("category", "==", categoryName)
      );
      const notesSnapshot = await getDocs(notesData);
      notesSnapshot.forEach(async (noteDoc) => {
        const notesDocRef = doc(
          firestore,
          `users/${currentUser.uid}/notes/${noteDoc.id}`
        );
        await updateDoc(notesDocRef, {
          category: "",
        });
      });
      setCategories(categories.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.log("Error deleting category:", error);
    }
  };

  return shown ? (
    <div
      className="categoryFormBackdrop"
      onClick={() => {
        close();
      }}
    >
      <div
        className="categoryFormContent"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <h1 className="heading"> Manage Categories</h1>
        <form className="categoryForm" onSubmit={(e) => addCategory(e)}>
          <label className="label">Title</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter new category"
            className="input"
          />
          <button className="addCategoryButton" type="submit">
            Add Category
          </button>
        </form>
        <div className="categoriesList">
          <h1 className="categoriesHeading">Categories</h1>
          {categories.length === 0 ? (
            <div>No categories added.</div>
          ) : (
            <>
              {categories.map((cat) => (
                <div className="singleCategory" key={cat.id}>
                  <p>{cat.name}</p>

                  <MdDelete onClick={() => deleteCategory(cat.id, cat.name)} />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default CategoriesForm;
