import fs from "fs";
import sharp from "sharp";

import db from "../config/db";

export type StatsParams = {
  userId: string;
};

/*
  total de chamadas
  total de pessoas
  total de aprovações
  total de recusas
  total de pendentes
  chamadas x dia do mês
  chamadas aprovadas x recusadas x pendentes (pizza)
  chamadas x pessoa
*/

export const stats = async (params: StatsParams) => {
  const [
    callsCount,
    peopleCount,
    approvedCount,
    rejectedCount,
    pendingCount,
    rawCallsByDay,
    rawCallsByAnswer,
    rawCallsByPerson
  ] = await Promise.all([
    db.call.count({ where: { userId: params.userId } }),
    db.person.count({ where: { userId: params.userId } }),
    db.call.count({ where: { userId: params.userId, answer: true } }),
    db.call.count({ where: { userId: params.userId, answer: false } }),
    db.call.count({ where: { userId: params.userId, answer: null } }),
    db.$queryRaw`
      SELECT
        DATE_FORMAT(createdAt, '%d/%m/%Y') AS createdAt,
        COUNT(id) AS count
      FROM
        intercam.Call
      WHERE
        userId = ${params.userId} AND
        createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY
        DATE_FORMAT(createdAt, '%d/%m/%Y')
      ORDER BY
        createdAt ASC`,
    db.call.groupBy({
      by: ["answer"],
      where: {
        userId: params.userId
      },
      _count: {
        id: true
      }
    }),
    db.call.groupBy({
      by: ["personId"],
      where: {
        userId: params.userId
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: "desc"
        }
      }
    })
  ]);

  // @ts-ignore
  const callsByDay = rawCallsByDay.map((item: any) => ({
    day: item.createdAt,
    count: parseInt(item.count)
  }));

  const callsByAnswer = rawCallsByAnswer.map((item: any) => ({
    answer: item.answer,
    count: item._count.id
  }));

  const people = await db.person.findMany({
    where: {
      id: {
        in: rawCallsByPerson.filter((item: any) => !!item.personId).map((item: any) => item.personId)
      }
    },
    select: {
      id: true,
      name: true
    }
  });

  const callsByPerson = rawCallsByPerson.slice(0, 7).map((item: any) => {
    const person = people.find((person: any) => person.id === item.personId);
    return {
      person: person?.name || "Desconhecido",
      count: item._count.id
    };
  });

  const stats = {
    callsCount,
    peopleCount,
    approvedCount,
    rejectedCount,
    pendingCount,
    callsByDay,
    callsByAnswer,
    callsByPerson
  }

  return stats;
}
