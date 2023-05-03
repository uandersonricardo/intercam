import { Router } from "express";
import { createCall, CreateCallParams, findCall, FindCallParams, findCalls, FindCallsParams, updateCall, UpdateCallParams } from "../controllers/call";

const callRouter = Router();

callRouter.post('/', async (req, res) => {
  const params: CreateCallParams = {
    imageBase64: req.body['image']?.toString() ?? "",
    location: req.body['location'],
    confidence: parseFloat(req.body['confidence']?.toString() ?? "0"),
    personId: req.body['detected']?.toString() || null,
    userId: req.body['user']?.toString() ?? ""
  };

  const id = await createCall(params);

  res.json({ id });
});

callRouter.get('/', async (req, res) => {
  const params: FindCallsParams = {
    userId: req.query['user']?.toString() ?? ""
  };

  const calls = await findCalls(params);

  res.json({ calls });
});

callRouter.get('/:id', async (req, res) => {
  const params: FindCallParams = {
    id: req.params.id
  };

  const call = await findCall(params);

  res.json({ call });
});

callRouter.put('/:id', async (req, res) => {
  const params: UpdateCallParams = {
    id: req.params.id,
    answer: req.body['answer'] ?? false,
    person: req.body['person']
  };

  await updateCall(params);

  res.json();
});

export default callRouter;
