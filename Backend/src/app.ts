import express from "express";
import session from "express-session";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import noteRoutes from "./routes/note.routes";
import todoRoutes from "./routes/todo.routes";
import eventRoutes from "./routes/event.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

import dotenv from "dotenv";
import passport from "./config/passport";
dotenv.config();

app.use(express.json());

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/todos", todoRoutes);
app.use("/api/v1/events", eventRoutes);

export default app;
