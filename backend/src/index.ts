import "express-async-errors";

import express, { Router, Request, Response, json, urlencoded, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

const route = Router();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));

route.get("/", (req: Request, res: Response) => {
  res.json({ message: "hello world with Typescript" });
});

app.use(route);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Path not found" });
});

app.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ message: err.message });
  }
);

app.listen(3333, () => console.log("Server running on port 3333"));
