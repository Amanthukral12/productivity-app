import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { UserDocument } from "../types/types";
import prisma from "../db/db";
import { ApiResponse } from "../utils/ApiResponse";

export const getNotes = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized Access. Please login again.", [
      "Unauthorized Access. Please login again",
    ]);
  }
  const userId = (req.user as UserDocument).id;

  const notes = await prisma.note.findMany({
    where: {
      userId,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched successfully"));
});

export const addNote = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized Access. Please login again.", [
      "Unauthorized Access. Please login again",
    ]);
  }
  const userId = (req.user as UserDocument).id;

  const { title, content, categoryIds } = req.body;

  if (!content) {
    throw new ApiError(400, "Note content is required", [
      "Note content is required",
    ]);
  }

  if (!Array.isArray(categoryIds)) {
    throw new ApiError(400, "Category Ids must be an array", [
      "Category Ids must be an array",
    ]);
  }
  try {
    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId,
        categories: categoryIds.length
          ? {
              connect: categoryIds.map((id: number) => ({ id })),
            }
          : undefined,
      },
      include: {
        categories: true,
      },
    });
    return res.status(201).json(new ApiResponse(201, note, "Note created"));
  } catch (error) {
    console.log(error);
    throw new ApiError(400, "Error creating note", ["Error creating note"]);
  }
});

export const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized Access. Please login again.", [
      "Unauthorized Access. Please login again.",
    ]);
  }
  const userId = (req.user as UserDocument).id;

  const { noteId } = req.params;

  const noteExists = await prisma.note.findFirst({
    where: {
      id: Number(noteId),
      userId,
    },
  });

  if (!noteExists) {
    throw new ApiError(404, "Note not found", ["Note not found"]);
  }

  await prisma.note.delete({
    where: {
      id: Number(noteExists.id),
      userId,
    },
  });
  return res.status(200).json(new ApiResponse(200, {}, "Note deleted"));
});

export const getNoteById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized Access. Please login again.", [
      "Unauthorized Access. Please login again.",
    ]);
  }
  const userId = (req.user as UserDocument).id;

  const { noteId } = req.params;

  const noteExists = await prisma.note.findFirst({
    where: {
      id: Number(noteId),
      userId,
    },
  });

  if (!noteExists) {
    throw new ApiError(404, "Note not found", ["Note not found"]);
  }

  return res.status(200).json(new ApiResponse(200, noteExists, "Note found"));
});

export const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const { noteId } = req.params;
  const { title, content, categoryIds } = req.body;
  if (!req.user) {
    throw new ApiError(401, "Unauthorized Access. Please login again.", [
      "Unauthorized Access. Please login again.",
    ]);
  }

  if (!title && !content && !categoryIds) {
    throw new ApiError(400, "No fields to update", ["No fields to update"]);
  }
  if (content === "" || content === null) {
    throw new ApiError(400, "Content cannot be blank", [
      "Content cannot be blank",
    ]);
  }
  const userId = (req.user as UserDocument).id;

  const noteExists = await prisma.note.findFirst({
    where: {
      id: Number(noteId),
      userId,
    },
  });

  if (!noteExists) {
    throw new ApiError(404, "Note not found", ["Note not found"]);
  }

  const existingCategories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
  });

  if (existingCategories.length !== categoryIds.length) {
    throw new ApiError(404, "One or more categories do not exist.", [
      "One or more categories do not exist.",
    ]);
  }

  const updatedNote = await prisma.note.update({
    where: {
      id: noteExists.id,
      userId,
    },

    data: {
      title: title !== undefined ? title : undefined,
      content: content !== undefined ? content : undefined,
      categories: categoryIds
        ? {
            set: categoryIds.map((id: number) => ({ id })),
          }
        : undefined,
    },
    include: {
      categories: true,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, updatedNote, "Note updated"));
});
