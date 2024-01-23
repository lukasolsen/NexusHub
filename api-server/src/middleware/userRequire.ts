import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../../../shared/models/User";
import { getRepository } from "typeorm";
import { createApiResponse } from "../utils/util";

const userRequireMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the wanted path is either register or loing
  if (
    req.path.toString() === "/api/v2/user/login" ||
    req.path.toString() === "/api/v2/user/register"
  ) {
    console.log("User require middleware: Skipping login and register.");
    return next();
  }

  const token = req.headers.authorization?.split(" ")[1];
  const apiKey = req.headers["x-api-key"];
  if (!token && !apiKey) {
    return res
      .status(401)
      .send(createApiResponse("Unauthorized", "Missing verification."));
  }

  // We can use either a JWT token or an API key to verify the user
  try {
    if (token) {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");

      if (!decoded) {
        return res
          .status(401)
          .send(createApiResponse("Unauthorized", "Invalid token."));
      }

      // Find the user with the given id
      const user = getRepository(User).findOne({ where: { id: decoded.id } });

      if (!user) {
        return res
          .status(404)
          .send(createApiResponse("Not Found", "User not found."));
      }

      // Add the user to the request object
      req.user = user;

      next();
    } else {
      return res
        .status(401)
        .send(createApiResponse("Unauthorized", "Invalid token."));
    }
  } catch (error) {
    return res
      .status(401)
      .send(createApiResponse("Unauthorized", "Invalid token."));
  }
};

export default userRequireMiddleware;
