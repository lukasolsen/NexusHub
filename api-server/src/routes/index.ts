import { Router, NextFunction, Request, Response } from "express";
import { userRouter } from "./user";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

router.use("/user", userRouter);

export default router;
