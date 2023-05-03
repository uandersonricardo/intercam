import fs from "fs";
import sharp from "sharp";

import db from "../config/db";

export type CreatePersonParams = {
  name: string;
  defaultAnswer: boolean | null;
  image: string | null;
  userId: string;
}

export const createPerson = async (params: CreatePersonParams) => {
  const person = await db.person.create({
    data: {
      name: params.name,
      defaultAnswer: params.defaultAnswer,
      image: params.image,
      user: {
        connect: {
          id: params.userId
        }
      }
    }
  });

  return person.id;
};

export type FindPeopleParams = {
  userId: string;
};

export const findPeople = async (params: FindPeopleParams) => {
  const people = await db.person.findMany({
    where: {
      userId: params.userId
    },
    orderBy: {
      name: "desc"
    }
  });

  return people;
}
