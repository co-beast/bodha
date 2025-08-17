import { HttpStatusCode } from "axios";
import { Router } from "express";

const router = Router();

router.get("/", (_request, response) => {
    response
        .status(HttpStatusCode.Ok)
        .json({ message: "mocked chat route" });
});

export default router;