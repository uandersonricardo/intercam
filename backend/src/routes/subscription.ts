import { Router } from "express";
import { createSubscription, CreateSubscriptionParams } from "../controllers/subscription";

const subscriptionRouter = Router();

subscriptionRouter.post('/', async (req, res) => {
  const params: CreateSubscriptionParams = {
    endpoint: req.body['endpoint']?.toString(),
    expirationTime: parseInt(req.body['expirationTime']?.toString() ?? "0"),
    keys: {
      p256dh: req.body['keys']['p256dh']?.toString(),
      auth: req.body['keys']['auth']?.toString()
    },
    userId: req.body['userId']?.toString()
  };

  const endpoint = await createSubscription(params);

  res.json({ endpoint });
});

export default subscriptionRouter;
