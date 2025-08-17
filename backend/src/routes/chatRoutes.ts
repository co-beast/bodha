import { Router } from "express";
import { handleChatMessage, handleClearChat } from "@/controllers/chatController";

const router = Router();

router.post('/message', handleChatMessage);
router.delete('/', handleClearChat);

export = router;