import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { UserDocument } from "../types/types";
import prisma from "../db/db";
import { ApiResponse } from "../utils/ApiResponse";

export const addTodo = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized Access. Please login again.", [
      "Unauthorized Access. Please login again",
    ]);
  }
  const userId = (req.user as UserDocument).id;
  const { title, isComplete, priority, dueDate, hasReminder, reminderAt } =
    req.body;
  if (!title || title.trim() === "") {
    throw new ApiError(400, "Todo cannot be blank", ["Todo cannot be blank"]);
  }

  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        isComplete,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        hasReminder,
        reminderAt: reminderAt ? new Date(reminderAt) : undefined,
        userId,
      },
    });
    return res.status(201).json(new ApiResponse(201, todo, "Todo Created"));
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "Error creating todo", ["Error creating todo"]);
  }
});

export const deleteTodo = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized Access. Please login again.", [
      "Unauthorized Access. Please login again",
    ]);
  }
  const userId = (req.user as UserDocument).id;
  const { todoId } = req.params;

  const todoExists = await prisma.todo.findFirst({
    where: {
      id: Number(todoId),
      userId,
    },
  });
  if (!todoExists) {
    throw new ApiError(404, "Todo not found", ["Todo not found"]);
  }

  try {
    await prisma.todo.delete({
      where: {
        id: Number(todoExists.id),
        userId,
      },
    });
    return res.status(200).json(new ApiResponse(200, {}, "Todo deleted"));
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "Error deleting todo", ["Error deleting todo"]);
  }
});

export const updateTodo = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized Access. Please login again.", [
      "Unauthorized Access. Please login again",
    ]);
  }
  const userId = (req.user as UserDocument).id;
  const { todoId } = req.params;
  const { title, isComplete, priority, dueDate, hasReminder, reminderAt } =
    req.body;

  if (
    !title &&
    !isComplete &&
    !priority &&
    !dueDate &&
    !hasReminder &&
    !reminderAt
  ) {
    throw new ApiError(400, "No fields to update", ["No fields to update"]);
  }

  if (title === null || title === "") {
    throw new ApiError(400, "Title cannot be blank", ["Title cannot be blank"]);
  }

  const todoExists = await prisma.todo.findFirst({
    where: {
      id: Number(todoId),
      userId,
    },
  });
  if (!todoExists) {
    throw new ApiError(404, "Todo not found", ["Todo not found"]);
  }

  try {
    const updatedTodo = await prisma.todo.update({
      where: {
        id: Number(todoExists.id),
        userId,
      },
      data: {
        title: title || undefined,
        isComplete: isComplete || undefined,
        priority: priority || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        hasReminder: hasReminder || undefined,
        reminderAt: reminderAt ? new Date(reminderAt) : undefined,
      },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, updatedTodo, "Todo updated"));
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "Error updating todo", ["Error updating todo"]);
  }
});

export const getTodos = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized Access. Please login again.", [
      "Unauthorized Access. Please login again",
    ]);
  }
  const userId = (req.user as UserDocument).id;
  const { sortBy = "dueDate", sortOrder = "asc" } = req.query;

  const orderConfig =
    sortBy === "priority"
      ? [{ priority: sortOrder as "asc" | "desc" }, { dueDate: "asc" }]
      : { [sortBy as string]: sortOrder as "asc" | "desc" };

  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId,
      },
      orderBy: orderConfig as any,
    });
    return res.status(200).json(new ApiResponse(200, todos, "Todos fetched"));
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "Error fetching todos", ["Error fetching todos"]);
  }
});

export const getTodoById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized Access. Please login again.", [
      "Unauthorized Access. Please login again",
    ]);
  }
  const userId = (req.user as UserDocument).id;
  const { todoId } = req.params;

  const todo = await prisma.todo.findFirst({
    where: {
      id: Number(todoId),
      userId,
    },
  });
  if (!todo) {
    throw new ApiError(404, "Todo not found", ["Todo not found"]);
  }
  return res.status(200).json(new ApiResponse(200, todo, "Todo fetched"));
});
