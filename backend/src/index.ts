import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { fetchTokenIds, getContract, getProvider } from "./controllers/amoy/amoy";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

const test = async () => {

const amoyProvider = getProvider();
const amoyContract = getContract(amoyProvider);
const totalSupply = await fetchTokenIds(amoyContract);
const userTokens  = await fetchTokenIds(amoyContract, "0x754e49da4978bd9FF2e9Bfddd9399898FbB3dEc3");

console.log('tokenIds', totalSupply);
console.log('user tokens', userTokens);
};

test();