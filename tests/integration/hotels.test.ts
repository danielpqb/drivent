import app, { init } from "@/app";
import { getHotels } from "@/controllers";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createEnrollmentWithAddress, createHotel, createTicket, createTicketType, createUser } from "../factories";
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
    const token = faker;

    const resp = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    expect(resp.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    it("should respond with status 402 if user doesnt have a hotel ticket paid", async () => {
      const resp = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(resp.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 200 if user have a hotel ticket paid and return all hotels", async () => {
      const ticketTypeId = (await createTicketType()).id;
      const enrollmentId = (await createEnrollmentWithAddress(user)).id;
      await createTicket(enrollmentId, ticketTypeId, "PAID");

      const resp = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(resp.status).toBe(httpStatus.OK);
    });
  });
});

describe("GET /hotels/:hotelId", async () => {
  const hotel = await createHotel();

  it("should respond with status 401 if user without token", async () => {
    const resp = await server.get("/hotels").query({ hotelId: hotel.id });
    expect(resp.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if token is invalid", async () => {
    const resp = await server
      .get("/hotels")
      .set("Authorization", `Bearer ${"invalidToken"}`)
      .query({ hotelId: hotel.id });
    expect(resp.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    it("should respond with status 404 if hotelId doesnt exist", async () => {
      const resp = await server.get("/hotels").set("Authorization", `Bearer ${token}`).query({ hotelId: 0 });
      expect(resp.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 200 if hotelId exists and token is valid", async () => {
      const resp = await server.get("/hotels").set("Authorization", `Bearer ${token}`).query({ hotelId: hotel.id });
      expect(resp.status).toBe(httpStatus.OK);
    });
  });
});
