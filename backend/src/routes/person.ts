import { Router } from "express";
import { CreatePersonParams, FindPeopleParams, createPerson, findPeople } from "../controllers/person";

const personRouter = Router();

personRouter.post('/', async (req, res) => {
  const params: CreatePersonParams = {
    name: req.body['name']?.toString(),
    defaultAnswer: req.body['defaultAnswer'] ?? null,
    image: req.body['image']?.toString() ?? null,
    userId: req.body['user']?.toString() ?? ""
  };

  const id = await createPerson(params);

  res.json({ id });
});

personRouter.get('/', async (req, res) => {
  const params: FindPeopleParams = {
    userId: req.query['user']?.toString() ?? ""
  };

  const people = await findPeople(params);

  res.json({ people });
});

export default personRouter;
