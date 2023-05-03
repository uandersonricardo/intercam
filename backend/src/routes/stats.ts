import { Router } from "express";
import { StatsParams, stats } from "../controllers/stats";

const statsRouter = Router();

statsRouter.get('/', async (req, res) => {
  const params: StatsParams = {
    userId: req.query['user']?.toString() ?? ""
  };

  const allStats = await stats(params);

  res.json({ ...allStats });
});

export default statsRouter;
