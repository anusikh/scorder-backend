import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRoute from "./routes/user.routes";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

var corsOptions = {
  origin: `${process.env.ORIGIN_URL}`,
  credentials: true, // withCredentials = true in axios. So that we can use token stored in cookies
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user", userRoute);

app.get("/", (req: Request, res: Response) => {
  res.json({ res: "hello panda" });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
