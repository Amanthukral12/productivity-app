import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import prisma from "../db/db";
import { UserDocument } from "../types/types";
import { ApiResponse } from "../utils/ApiResponse";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new ApiError(401, "Unauthorized Access. Please login again.", [
          "Unauthorized Access. Please login again.",
        ]);
      }
      const userId = (req.user as UserDocument).id;

      const { name } = req.body;
      if (!name) {
        return res
          .status(400)
          .json(new ApiResponse(400, {}, "Category name is required"));
      }

      const catefogyExists = await prisma.category.findFirst({
        where: {
          name,
          userId,
        },
      });

      if (catefogyExists) {
        return res
          .status(400)
          .json(new ApiResponse(400, {}, "Category already exists"));
      }

      const category = await prisma.category.create({
        data: {
          name,
          userId,
        },
      });
      res
        .status(201)
        .json(
          new ApiResponse(
            201,
            category,
            `${category.name} created successfully`
          )
        );
    } catch (error) {
      throw new ApiError(400, "Error creating category", [
        "Error creating category",
      ]);
    }
  }
);
