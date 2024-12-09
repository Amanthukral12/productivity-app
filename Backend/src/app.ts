import express from "express";
import session from "express-session";
import authRoutes from "./routes/auth.routes";
const app = express();

import dotenv from "dotenv";
import passport from "./config/passport";
dotenv.config();

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

export default app;
