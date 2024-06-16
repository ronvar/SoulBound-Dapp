import express, { Express, Request, Response, Router } from "express";
import dotenv from "dotenv";
import {
  fetchTokenDetailsByWalletAddress,
} from "./controllers/amoy/amoy";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import user from "./controllers/user/index";

config();

const app = express();
const port = process.env.PORT || 3005;

app.use(express.json());
app.use(bodyParser.raw({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

const corsOptions: cors.CorsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));
app.use("/user", user)

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

server.timeout = 120000;

const test = async () => {
  const totalSupply = await fetchTokenDetailsByWalletAddress();
  
  const userTokens = await fetchTokenDetailsByWalletAddress(
    "0x754e49da4978bd9FF2e9Bfddd9399898FbB3dEc3"
  );

  console.log("tokenIds", totalSupply);
  console.log("user tokens", userTokens);
};

test();
