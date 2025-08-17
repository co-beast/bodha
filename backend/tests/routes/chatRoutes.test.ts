import { HttpStatusCode } from "axios";
import request from "supertest";
import express, { Application } from "express";
import chatRoutes from "../../src/routes/chatRoutes";

jest.mock("../../src/controllers/chatController", () => ({
  handleChatMessage: jest.fn((_req, res) => { res.status(HttpStatusCode.Ok).json({ mocked: "chatMessage" }); }),
  handleClearChat: jest.fn((_req, res) => { res.status(HttpStatusCode.Ok).json({ mocked: "clearChat" }); }),
}));
import * as chatController from "../../src/controllers/chatController";

describe("chatRoutes", () => {
    let app: Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use("/api/chat", chatRoutes);
    });

    test("POST /api/chat/message calls handleChatMessage", async () => {
        const response = await request(app)
            .post("/api/chat/message")
            .send({ message: "hello" });
        
        expect(chatController.handleChatMessage).toHaveBeenCalled();
        expect(response.status).toBe(HttpStatusCode.Ok);
        expect(response.body).toEqual({ mocked: "chatMessage" });
    });

    test("DELETE /api/chat calls handleClearChat", async () => {
        const response = await request(app).delete("/api/chat");

        expect(chatController.handleClearChat).toHaveBeenCalled();
        expect(response.status).toBe(HttpStatusCode.Ok);
        expect(response.body).toEqual({ mocked: "clearChat" });
    });
});