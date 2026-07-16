import { Router } from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All category routes require authentication.
router.use(verifyJWT);

router.route("/").post(createCategory).get(getCategories);

router
  .route("/:categoryId")
  .get(getCategoryById)
  .patch(updateCategory);

export default router;