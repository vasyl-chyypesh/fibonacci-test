import { Router } from "express";
import input from "./input";
import output from "./output";

const router = Router();

router.post("/input", input);

router.get("/output/:id", output);

router.use((req, res, next) => {
  res.status(404).type("txt").send("PAGE NOT FOUND");
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
router.use((err, req, res, next) => {
  console.error(err);

  res.status(500).type("txt").send("INTERNAL SERVER ERROR");
});

export default router;
