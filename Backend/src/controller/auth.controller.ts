import { Request, Response } from "express";

export const googleLoginSuccess = (req: Request, res: Response) => {
  res.json({ message: "Login Successful", user: req.user });
};

export const logout = (req: Request, res: Response) => {
  req.logOut(() => {
    res.json({ message: "Logged out successfully" });
  });
};
