import fs from "fs";
import sharp from "sharp";
import path from "path";

import db from "../config/db";
import webpush from "../config/notification";
import fog from "../config/fog";

export type CreateCallParams = {
  imageBase64: string;
  location: number[];
  confidence: number;
  personId: string | null;
  userId: string;
}

export const createCall = async (params: CreateCallParams) => {
  let person: any = undefined;
  
  if (params.personId) {
    person = await db.person.findUnique({
      where: {
        id: params.personId
      }
    });
  }

  const call = await db.call.create({
    data: {
      confidence: params.confidence,
      answer: person?.defaultAnswer,
      answeredAt: person?.defaultAnswer ? new Date() : null,
      person: person ? {
        connect: {
          id: person.id,
        }
      } : undefined,
      user: {
        connect: {
          id: params.userId
        }
      }
    }
  });

  const relativePath = `public/images/${call.id}.jpg`;
  const fixedPath = path.join(__dirname, '..', relativePath);
  fs.writeFile(fixedPath, params.imageBase64, "base64", (err) => { console.log(err); });

  const top = params.location[0];
  const left = params.location[3];
  const width = params.location[1] - left;
  const height = params.location[2] - top;
  const marginX = Math.ceil(width * 0.2);
  const marginY = Math.ceil(height * 0.3);

  const croppedRelativePath = `public/cropped/${call.id}.jpg`;
  const croppedPath = path.join(__dirname, '..', croppedRelativePath);

  await sharp(fixedPath).extract({ left: left - marginX, top: top - marginY, width: width + 2 * marginX, height: height + 2 * marginY })
    .toFile(croppedPath).catch((err) => { console.log(err); });

  await db.call.update({
    where: {
      id: call.id
    },
    data: {
      image: relativePath,
      croppedImage: croppedRelativePath
    }
  });

  if (!person || person.defaultAnswer === null) {
    const subscriptions = await db.subscription.findMany({
      where: {
        userId: params.userId
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
        title: "Nova chamada",
        body: `${person?.name || "Alguém"} está na porta!`,
        icon: "https://raw.githubusercontent.com/uandersonricardo/intercam/main/frontend/public/pwa-512x512.png",
        data: {
          id: call.id
        }
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
  } else {
    await fog.post("/answer", { answer: person.defaultAnswer, image: null }).catch((err) => { console.log(err); });
  }

  return call.id;
};

export type FindCallsParams = {
  userId: string;
};

export const findCalls = async (params: FindCallsParams) => {
  const calls = await db.call.findMany({
    where: {
      userId: params.userId
    },
    orderBy: [
      {
        answer: { sort: "desc", nulls: "first" },
      },
      {
        createdAt: "desc"
      }
    ],
    include: {
      person: true
    }
  });

  return calls;
}

export type FindCallParams = {
  id: string;
};

export const findCall = async (params: FindCallParams) => {
  const call = await db.call.findUnique({
    where: {
      id: params.id
    },
    include: {
      person: true
    }
  });

  return call;
}

export type UpdateCallParams = {
  id: string;
  answer: boolean;
  person: any;
};

export const updateCall = async (params: UpdateCallParams) => {
  let personId = params.person?.id || null;

  if (params.person && !params.person.id) {
    const person = await db.person.create({
      data: {
        name: params.person.name,
        image: params.person.image,
        defaultAnswer: params.person.defaultAnswer,
        user: {
          connect: {
            id: params.person.userId
          }
        }
      }
    });

    personId = person.id;
  }

  await db.call.update({
    where: {
      id: params.id,
    },
    data: {
      answer: params.answer,
      answeredAt: new Date(),
      personId
    }
  });

  const body: Record<string, any> = {
    answer: params.answer,
    image: null
  };

  if (params.person && !params.person.id) {
    const newRelativePath = `public/people/${personId}.jpg`;
    const newPath = path.join(__dirname, '..', newRelativePath);
    fs.copyFile(params.person.image, newPath, (err) => { console.log(err); });

    body.image = newRelativePath;
  }

  await fog.post("/answer", body).catch((err) => { console.log(err); });
}
