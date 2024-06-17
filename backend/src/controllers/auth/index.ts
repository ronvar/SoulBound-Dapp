import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { verifyUserController } from "./auth";

const router = Router();

router.use("/", body("authToken"), verifyUserController);

export default router;
