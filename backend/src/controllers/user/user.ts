import { Request, Response } from "express";
import { getUser, saveUser } from "../../services/dataSources/user/user";
import { User } from "../../types/user";

export const getUserController = async (req: Request, res: Response) => {
  const userId = req.query.user_id as string;
  const user = await getUser(userId, userId);
  const payload = {
    data: {
      user,
    },
  };
  return res.status(200).json(payload);
};

export const saveUserController = async (req: Request, res: Response) => {
  const userId = req.body.user.user_id;

  if (!userId) return res.status(400).send("Unauthorized");

  let user: Partial<User> = req.body.user;
  const saved = await saveUser(user);
  if (saved) {
    const payload = {
      data: `User saved. ${userId}`,
      user: saved,
    };
    return res.status(200).json(payload);
  }
  return res
    .status(500)
    .json({ msg: "Could not update user", status: "error" });
};
