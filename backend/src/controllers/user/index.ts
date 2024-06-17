import { Router } from "express";
import { body } from "express-validator";
import {
  getMintedNFTsConroller,
  getMintingGasPriceController,
  mintNewNFTConroller,
} from "./tokens";
import { getUserController, saveUserController } from "./user";

const router = Router();

router.post("/save", body("user_id").isInt(), saveUserController);
router.get("/getTokens", getMintedNFTsConroller);
router.get("/gasPrice", getMintingGasPriceController);
router.post(
  "/mint",
  body("wallet_address").isString(),
  body("message").isString(),
  body("signature").isString(),
  mintNewNFTConroller
);
router.use("/", getUserController);

export default router;
