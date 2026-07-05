import express from "express";
import * as commitInfo from "shared/appVersion";

const router = express.Router();

router.get("/", (req, res) => {
  res.json(commitInfo);
});

export const healthRouter = router;
