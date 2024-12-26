import express from "express";
import session from "express-session";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import noteRoutes from "./routes/note.routes";
import cookieParser from "cookie-parser";
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
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/notes", noteRoutes);

export default app;
