import { Request, Response, Router } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../../../../shared/models/User";
import { getRepository } from "typeorm";
import {
  createApiResponse,
  saltPassword,
  verifyPasswsord,
} from "../../utils/util";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).send("Missing username or password");
    return;
  }

  try {
    const userRepo = getRepository(User);

    const user = await userRepo.findOne({ where: { username: username } });
    if (!user) {
      res.status(400).send("User not found");
      return;
    }

    const passwordMatch = await verifyPasswsord(
      password,
      (
        await user
      ).password
    );

    if (!passwordMatch) {
      res.status(400).send("Incorrect password");
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      {
        username: username,
        id: (await user).id,
      },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "1h",
      }
    );

    const response = createApiResponse("OK", {
      token,
    });

    res.send(response);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
    return;
  }
});

router.post("/register", async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  console.log(req.body);

  if (!username || !password || !email) {
    res.status(400).send("Missing username, password, or email");
    return;
  }

  try {
    const userRepo = getRepository(User);

    const user = await userRepo.findOne({ where: { username: username } });
    console.log(user);
    if (user) {
      res.status(400).send("User already exists");
      return;
    }

    const newUser = new User();
    newUser.username = username;
    newUser.password = saltPassword(password);
    newUser.email = email;

    await userRepo.save(newUser);

    const response = createApiResponse("OK", {
      username: newUser.username,
      email: newUser.email,
    });

    res.send(response);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
    return;
  }
});

router.get("/current", async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(400).send("Missing token");
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as JwtPayload;
    const response = createApiResponse("OK", {
      username: decoded.username,
      id: decoded.id,
    });

    res.send(response);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
    return;
  }
});

export const userRouter = router;
