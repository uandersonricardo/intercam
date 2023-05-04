import "express-async-errors";

import express, { Request, Response, json, urlencoded, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import callRouter from "./routes/call";
import userRouter from "./routes/user";
import subscriptionRouter from "./routes/subscription";
import personRouter from "./routes/person";
import statsRouter from "./routes/stats";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/calls", callRouter);
app.use("/users", userRouter);
app.use("/people", personRouter);
app.use("/stats", statsRouter);
app.use("/subscriptions", subscriptionRouter);
app.use("/public", express.static("public"));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Path not found" });
});

app.use(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ message: err.message });
  }
);

const port = process.env.PORT || 3333;

app.listen(port, () => console.log("Server running on port " + port));
