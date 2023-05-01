import db from "../config/db";

export type CreateSubscriptionParams = {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  userId: string;
}

export const createSubscription = async (params: CreateSubscriptionParams) => {
  const subscription = await db.subscription.create({
    data: {
      auth: params.keys.auth,
      endpoint: params.endpoint,
      p256dh: params.keys.p256dh,
      user: {
        connect: {
          id: params.userId
        }
      }
    }
  });

  return subscription.endpoint;
};
