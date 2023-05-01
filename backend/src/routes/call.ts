import { Router } from "express";
import { createCall, CreateCallParams } from "../controllers/call";

const callRouter = Router();

callRouter.post('/', async (req, res) => {
  const params: CreateCallParams = {
    imageBase64: req.body['image']?.toString() ?? "",
    confidence: parseFloat(req.body['confidence']?.toString() ?? "0"),
    personId: req.body['detected']?.toString(),
    userId: req.body['user']?.toString() ?? ""
  };

  const id = await createCall(params);

  res.json({ id });
});

export default callRouter;
