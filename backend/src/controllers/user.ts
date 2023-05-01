import bcrypt from "bcrypt";

import db from "../config/db";

export type CreateUserParams = {
  name: string;
  email: string;
  password: string;
}

export const createUser = async (params: CreateUserParams) => {
  const hashedPassword = await bcrypt.hash(params.password, 10);

  const user = await db.user.create({
    data: {
      name: params.name,
      email: params.email,
      password: hashedPassword,
    }
  });

  return user.id;
};

export type LoginUserParams = {
  email: string;
  password: string;
}

export const loginUser = async (params: LoginUserParams) => {
  const user = await db.user.findUnique({
    where: {
      email: params.email
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const passwordMatch = await bcrypt.compare(params.password, user.password);

  if (!passwordMatch) {
    throw new Error("Incorrect password");
  }

  return user;
}

export type FindUserParams = {
  id: string;
}

export const findUser = async (params: FindUserParams) => {
  const user = await db.user.findUnique({
    where: {
      id: params.id
    },
    select: {
      id: true,
      name: true,
      email: true,
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
