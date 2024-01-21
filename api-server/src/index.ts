import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import pool from "../../shared/database/db";

import { createApiResponse } from "./utils/util";
//import rateLimiterMiddleware from "./middleware/rateLimiterMiddleware";
import userRequireMiddleware from "./middleware/userRequire";
import router from "./routes";
import { APIResponse } from "./types/response";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();

//app.use(rateLimiterMiddleware);
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRequireMiddleware);

app.use("/api/v2", router);

app.get("*", (req: Request, res: Response) => {
  const notFoundResponse = createApiResponse(
    "Not Found",
    "The requested resource was not found."
  );
  res.status(404).send(notFoundResponse);
});

// Error handling middleware for unhandled errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled error:", err);
  const errorResponse: APIResponse<string> = createApiResponse(
    "Internal Server Error",
    "An error occurred while processing the request."
  );
  res.status(500).send(errorResponse);
});

app.listen(
  parseInt(process.env.SERVER_PORT?.toString() || "3000"),
  process.env.SERVER_IP || "localhost",
  () => {
    console.log(
      `Server running at http://${process.env.SERVER_IP}:${process.env.SERVER_PORT}/`
    );
  }
);
