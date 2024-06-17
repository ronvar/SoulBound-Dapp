import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { verifyUser } from "./verify";

export const verifyUserController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { authToken } = req.body;

    const verifiedUser = await verifyUser(authToken);
    if (!verifiedUser) {
      return res
        .status(200)
        .json({ status: "Unauthorized", token: verifiedUser });
    }
    return res.status(200).json({ status: "Authorized", token: verifiedUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ status: "Internal Server Error" });
  }
};
