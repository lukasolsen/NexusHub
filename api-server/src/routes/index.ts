import { Router, Request, Response } from "express";
import { userRouter } from "./user";
import { gameRouter } from "./game";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

router.use("/user", userRouter);
router.use("/game", gameRouter);

export default router;
