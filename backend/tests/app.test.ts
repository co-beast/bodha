import request from 'supertest';

jest.mock("@/routes/chatRoutes", () => require("./__mocks__/chatRoutes").default);
import app from '@/app';

import { HttpStatusCode } from 'axios';
import { CLIENT_ORIGIN } from '@/config/appConfig';

const DUMMY_ENDPOINT = "/api/whatever";

describe("Health check", () => {
    test("should return 200 and { status: 'ok' }", async () => {
        const response = await request(app).get("/api/health");
        expect(response.status).toBe(HttpStatusCode.Ok);
        expect(response.body).toEqual({ status: "ok" });
    });
});

describe("CORS middleware", () => {
    test("should allow requests from configured origin", async () => {
        const response = await request(app)
            .options(DUMMY_ENDPOINT)
            .set("Origin", CLIENT_ORIGIN);

        expect(response.headers["access-control-allow-origin"]).toBe(CLIENT_ORIGIN);
    });

    test("should reject requests from unconfigured origins", async () => {
        const fakeOrigin = "http://evil.com";
        const response = await request(app)
            .options(DUMMY_ENDPOINT)
            .set("Origin", fakeOrigin);

        expect(response.headers["access-control-allow-origin"]).not.toBe(fakeOrigin);
    });
});

describe("Session Middleware", () => {
    test("should set a session cookie", async () => {
        const response = await request(app).get(DUMMY_ENDPOINT);
        
        expect(response.headers["set-cookie"]).toBeDefined();
        expect(response.headers["set-cookie"][0]).toMatch(/connect.sid/)
    });
});

describe("Chat routes mounting", () => {
    test("should hit mocked chat route", async () => {
        const response = await request(app).get("/api/chat");
        expect(response.status).toBe(HttpStatusCode.Ok);
        expect(response.body).toEqual({ message: "mocked chat route" });
    });
});