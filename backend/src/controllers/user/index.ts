import { Router } from "express";
import { getMintedNFTsConroller } from "./getTokens";

const router = Router();

router.use("/getTokens", getMintedNFTsConroller);

export default router;