import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../Sidebar/Sidebar";
import { IoMenu } from "react-icons/io5";
import "./Dashboard.css";
import NavigationBar from "../NavigationMenu/NavigationBar";
import { firestore } from "../../firebase";
import {
  query,
  orderBy,
  onSnapshot,
  collection,
  limit,
  where,
} from "firebase/firestore";
import moment from "moment/moment";
import { IoMdAddCircleOutline } from "react-icons/io";
import Pomodoro from "../Pomodoro/Pomodoro.js";
const Dashboard = () => {
  const [error, setError] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [hours, setHours] = useState("");
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.displayName === null) {
      navigate("/update-profile");
    }
  }, [currentUser, navigate]);

  const today = moment(new Date()).format("YYYY-MM-DD");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = currentDateTime.toDateString();
  const formattedTime = currentDateTime
    .toLocaleTimeString()
    .replace(/(.*)\D\d+/, "$1");

  const getHours = () => {
    const today = new Date();
    let hours = today.getHours();
    setHours(hours);
    if (hours > 12 && hours < 16) {
      setMessage("Good Afternoon!");
    } else if (hours > 4 && hours < 12) {
      setMessage("Good Morning!");
    } else {
      setMessage("Good Evening!");
    }
  };

  useEffect(() => {
    getHours();
  }, []);

  const userTodosCollectionRef = collection(
    firestore,
    `users/${currentUser.uid}/todos`
  );

  const memoizedGetTodos = useCallback(() => {
    const todoData = query(
      userTodosCollectionRef,
      orderBy("timestamp", "desc"),
      limit(3)
    );
    return onSnapshot(todoData, (querySnapshot) => {
      const updatedTodo = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        todo: doc.data().todo,
        inprogress: doc.data().inprogress,
      }));
      setTodos(updatedTodo);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = memoizedGetTodos();
    return () => unsubscribe();
  }, [memoizedGetTodos]);

  const userNotesCollectionRef = collection(
    firestore,
    `users/${currentUser.uid}/notes`
  );

  const memoizedGetNotes = useCallback(() => {
    const notesData = query(
      userNotesCollectionRef,
      orderBy("timestamp", "desc"),
      limit(2)
    );
    return onSnapshot(notesData, (querySnapshot) => {
      const updatedNotes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        content: doc.data().content,
      }));
      setNotes(updatedNotes);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = memoizedGetNotes();
    return () => unsubscribe();
  }, [memoizedGetNotes]);

  const userEventsCollectionRef = collection(
    firestore,
    `users/${currentUser.uid}/eventReminder`
  );

  const memoizedGetEvents = useCallback(() => {
    const eventsData = query(
      userEventsCollectionRef,
      where("recurrenceEndDate", ">=", today),
      limit(3)
    );

    return onSnapshot(eventsData, (querySnapshot) => {
      const updatedEvents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        start: doc.data().start,
        end: doc.data().end,
        allDay: doc.data().allDay,
        isRecurring: doc.data().isRecurring || false,
        recurrenceFrequency: doc.data().recurrenceFrequency,
        recurrenceEndDate: doc.data().recurrenceEndDate,
      }));

      setEvents(updatedEvents);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = memoizedGetEvents();
    return () => unsubscribe();
  }, [memoizedGetEvents]);

  console.log("object");

  return (
    <div className="root">
      <div className="dashboardNavigation">
        <IoMenu
          onClick={() => setIsOpen(true)}
          className={"dashboardMenuIcon" + (isOpen ? " hidden" : "")}
        />
        <Sidebar shown={isOpen} close={() => setIsOpen(!isOpen)}></Sidebar>
        <NavigationBar />
      </div>
      <section className="dashboardSection">
        <div className="welcome">Welcome to Produkto</div>
        <section className="greetingSection">
          <div>
            <div className="greeting">{message}</div>
            <div className="name">{currentUser.displayName}</div>
          </div>
          <div>
            <h3>{formattedDate}</h3>
            <h3>{formattedTime}</h3>
          </div>
        </section>
        <section className="summarySection">
          <div className="eventsNotesSection">
            <div className="dashboardEventsSection">
              <header className="header">
                <h3>Events</h3>
                <Link to={"/event-reminder"}>
                  <IoMdAddCircleOutline className="dashboardIcon" />
                </Link>
              </header>
              {events.length === 0 && (
                <h1 className="dashboardMessage">No Events found...</h1>
              )}
              {events.map((event) => (
                <div key={event.id} className="singleEvent">
                  <p className="eventTitle">{event.title}</p>
                  <p className="eventDetail">
                    {event.isRecurring
                      ? `Recurring till ${moment(
                          event.recurrenceEndDate
                        ).format("DD-MM-YYYY")}`
                      : `Days left for event :
                    ${moment(event.recurrenceEndDate).diff(today, "days")}`}
                  </p>
                </div>
              ))}
            </div>
            <div className="dashboardNotesSection">
              <header className="header">
                <h3>Notes</h3>
                <Link to={"/notes-app"}>
                  <IoMdAddCircleOutline className="dashboardIcon" />
                </Link>
              </header>
              {notes.length === 0 && (
                <h1 className="dashboardMessage">No Notes found...</h1>
              )}
              {notes.map((note) => (
                <div key={note.id} className="singleNote">
                  <p className="noteTitle">{note.title}</p>

                  <p className="noteContent">
                    {note.content.length > 100
                      ? note.content.slice(0, 100) + " ...Read More"
                      : note.content.slice(0, 100)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="dashboardTodoPomodoroSection">
            <div className="dashboardTodoSection">
              <header className="header">
                <h3>Todos</h3>
                <Link to={"/todo-list"}>
                  <IoMdAddCircleOutline className="dashboardIcon" />
                </Link>
              </header>
              {todos.length === 0 && (
                <h1 className="dashboardMessage">No Todos found...</h1>
              )}
              {todos.map((todo, index) => (
                <div key={todo.id} className="singleTodo">
                  <p className="todo">
                    <span>{index + 1}. </span>
                    {todo.todo}
                  </p>
                </div>
              ))}
            </div>
            <Pomodoro />
          </div>
        </section>
        <section className="quickLinksSection">
          <h1 className="quickHeading">Quick Links for my other apps:</h1>
          <div className="links">
            <p>
              <a
                href="https://rgb-pallete.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="quickLink"
              >
                RGB Pallete - Extract colors from an Image
              </a>
            </p>
            <p>
              <a
                href="https://program-space.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="quickLink"
              >
                ProgramSpace - Read latest blogs
              </a>
            </p>
            <p>
              <a
                href="https://blogview.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="quickLink"
              >
                BlogView - Download Banner for your Blogs
              </a>
            </p>
          </div>
        </section>
      </section>

      {error && <h1>{error}</h1>}
    </div>
  );
};

export default Dashboard;
