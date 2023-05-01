import fs from "fs";

import db from "../config/db";

export type CreateCallParams = {
  imageBase64: string;
  confidence: number;
  personId: string | null;
  userId: string;
}

export const createCall = async (params: CreateCallParams) => {
  let person = null;
  
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
      person: {
        connect: {
          id: person?.id,
        }
      },
      user: {
        connect: {
          id: params.userId
        }
      }
    }
  });

  const path = `public/${call.id}.jpg`;
  fs.writeFile(path, params.imageBase64, "base64", (err) => { console.log(err); });

  await db.call.update({
    where: {
      id: call.id
    },
    data: {
      image: path
    }
  });

  return call.id;
};
