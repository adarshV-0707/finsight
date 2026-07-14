import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { findUserById } from "../models/user.model.js";

// Verifies the access token and attaches the authenticated user to req.user.
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
    );
  } catch {
    throw new ApiError(
      401,
      "Access token is invalid or has expired",
    );
  }

  const user = await findUserById(decodedToken.id);

  if (!user) {
    throw new ApiError(401, "Invalid access token");
  }

  req.user = user;

  next();
});