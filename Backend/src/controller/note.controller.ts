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
