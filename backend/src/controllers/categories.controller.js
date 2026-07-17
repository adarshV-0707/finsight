import { findAllCategories } from "../models/category.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getCategories = asyncHandler(async (req, res) => {
  const categories = await findAllCategories();

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

export { getCategories };