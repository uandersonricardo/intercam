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
  const subscription = await db.subscription.upsert({
    where: {
      endpoint: params.endpoint
    },
    update: {
      auth: params.keys.auth,
      p256dh: params.keys.p256dh,
      user: {
        connect: {
          id: params.userId
        }
      }
    },
    create: {
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
