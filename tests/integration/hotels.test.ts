import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { createSession, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if user without token", async () => {
    const resp = await server.get("/hotels");
    expect(resp.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if token is invalid", async () => {
    const token = "invalidToken";

    const resp = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    expect(resp.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", async () => {
    const token = await generateValidToken();

    it("should respond with status 404 if user have no ticket", async () => {
      const resp = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(resp.status).toBe(httpStatus.NOT_FOUND);
    });
  });
});
