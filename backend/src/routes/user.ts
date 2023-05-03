import { Router } from "express";
import { CreateUserParams, FindUserParams, HomeUserParams, LoginUserParams, createUser, findUser, homeUser, loginUser } from "../controllers/user";
import db from "../config/db";
import webpush from "../config/notification";

const userRouter = Router();

userRouter.post('/', async (req, res) => {
  const params: CreateUserParams = {
    name: req.body['name']?.toString(),
    email: req.body['email']?.toString(),
    password: req.body['password']?.toString()
  };

  const id = await createUser(params);

  res.json({ id });
});

userRouter.post('/login', async (req, res) => {
  const params: LoginUserParams = {
    email: req.body['email']?.toString(),
    password: req.body['password']?.toString()
  };

  const user = await loginUser(params);

  res.json({ user });
});

userRouter.get('/home', async (req, res) => {
  const params: HomeUserParams = {
    userId: req.query['user']?.toString() || ""
  };

  const home = await homeUser(params);

  res.json({ ...home });
});

userRouter.get('/:id', async (req, res) => {
  const params: FindUserParams = {
    id: req.params['id']
  };

  const user = await findUser(params);

  res.json({ user });
});

userRouter.post('/send-notification', async (req, res) => {
  const subscriptions = await db.subscription.findMany({
    where: {
      userId: req.body['userId']?.toString()
    }
  });

  subscriptions.forEach(async (subscription) => {
    await webpush.sendNotification({
      endpoint: subscription.endpoint,
      keys: {
        auth: subscription.auth,
        p256dh: subscription.p256dh
      }
    }, JSON.stringify({
      title: "New call",
      body: "Someone is calling you",
      icon: "https://cdn.iconscout.com/icon/free/png-256/video-call-1865351-1583140.png"
    })).catch(async (err) => {
      if (err.statusCode === 410) {
        await db.subscription.delete({
          where: {
            endpoint: subscription.endpoint
          }
        });
      }
    });
  });

  res.json();
});

export default userRouter;
