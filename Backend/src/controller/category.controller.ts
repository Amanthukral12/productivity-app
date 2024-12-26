import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import prisma from "../db/db";
import { UserDocument } from "../types/types";
import { ApiResponse } from "../utils/ApiResponse";

export const createCategory = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access. Please login again.", [
        "Unauthorized Access. Please login again.",
      ]);
    }
    const userId = (req.user as UserDocument).id;

    const { name } = req.body;
    if (!name) {
      throw new ApiError(400, "Category name is required", [
        "Category name is required",
      ]);
    }

    const catefogyExists = await prisma.category.findFirst({
      where: {
        name,
        userId,
      },
    });

    if (catefogyExists) {
      throw new ApiError(400, "Category already exists", [
        "Category already exists",
      ]);
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
        new ApiResponse(201, category, `${category.name} created successfully`)
      );
  }
);

export const deleteCategory = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access. Please login again.", [
        "Unauthorized Access. Please login again.",
      ]);
    }
    const userId = (req.user as UserDocument).id;

    const { categoryId } = req.params;

    const categoryExists = await prisma.category.findFirst({
      where: {
        id: Number(categoryId),
        userId,
      },
    });

    if (!categoryExists) {
      throw new ApiError(404, "Category not found", ["Category not found"]);
    }

    await prisma.category.delete({
      where: {
        id: Number(categoryId),
      },
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          `${categoryExists.name} category deleted successfully`
        )
      );
  }
);

export const getCategories = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access. Please login again.", [
        "Unauthorized Access. Please login again.",
      ]);
    }
    const userId = (req.user as UserDocument).id;

    const categories = await prisma.category.findMany({
      where: {
        userId,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, categories, "Categories fetched successfully")
      );
  }
);

export const updateCategory = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized Access. Please login again.", [
        "Unauthorized Access. Please login again.",
      ]);
    }
    const userId = (req.user as UserDocument).id;

    const { categoryId } = req.params;

    if (!categoryId) {
      throw new ApiError(400, "Category ID is required", [
        "Category ID is required",
      ]);
    }

    const categoryExists = await prisma.category.findFirst({
      where: {
        id: Number(categoryId),
        userId,
      },
    });

    if (!categoryExists) {
      throw new ApiError(404, "Category not found", ["Category not found"]);
    }

    const { name } = req.body;

    if (name === "" || !name) {
      throw new ApiError(400, "Category name can not be blank", [
        "Category name can not be blank",
      ]);
    }

    const category = await prisma.category.update({
      where: {
        id: Number(categoryId),
        userId,
      },
      data: {
        name,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, category, `${category.name} updated successfully`)
      );
  }
);
