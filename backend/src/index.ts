import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "dotenv";
import user from "./controllers/user/index";
import auth from "./controllers/auth/index";

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
app.use("/user", user);
app.use("/verify", auth);

const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

server.timeout = 120000;
