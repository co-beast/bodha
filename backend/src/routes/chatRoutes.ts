import { Router } from "express";
import { streamMessage, clearChat } from "../controllers/chatController";

const router = Router();

router.post('/message/stream', streamMessage);
router.delete('/', clearChat);

export = router;