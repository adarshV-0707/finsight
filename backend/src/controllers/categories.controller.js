import {
  insertCategory,
  findCategoriesByUserId,
  findCategoryById as findCategoryByIdModel,
  updateCategoryById,
} from "../models/category.model.js";

import {
  validateCreateCategory,
  validateUpdateCategory,
  isValidCategoryType,
} from "../validators/category.validator.js";

import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCategory = asyncHandler(async (req, res) => {
  const { error, data } = validateCreateCategory(req.body);

  if (error) {
    throw new ApiError(400, error);
  }

  try {
    const category = await insertCategory({
      userId: req.user.id,
      ...data,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          category,
          "Category created successfully",
        ),
      );
  } catch (error) {
    if (error.code === "23505") {
      throw new ApiError(
        409,
        "A category with this name and type already exists",
      );
    }

    throw error;
  }
});

const getCategories = asyncHandler(async (req, res) => {
  const { type } = req.query;

  if (type && !isValidCategoryType(type)) {
    throw new ApiError(
      400,
      "Category type must be either income or expense",
    );
  }

  const categories = await findCategoriesByUserId(
    req.user.id,
    type,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        categories,
        "Categories fetched successfully",
      ),
    );
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await findCategoryByIdModel(
    req.params.categoryId,
    req.user.id,
  );

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        category,
        "Category fetched successfully",
      ),
    );
});

const updateCategory = asyncHandler(async (req, res) => {
  const { error, data } = validateUpdateCategory(req.body);

  if (error) {
    throw new ApiError(400, error);
  }

  try {
    const updatedCategory = await updateCategoryById(
      req.params.categoryId,
      req.user.id,
      data,
    );

    if (!updatedCategory) {
      throw new ApiError(404, "Category not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedCategory,
          "Category updated successfully",
        ),
      );
  } catch (error) {
    if (error.code === "23505") {
      throw new ApiError(
        409,
        "A category with this name and type already exists",
      );
    }

    throw error;
  }
});

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
};