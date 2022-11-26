import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createHotel,
  createPayment,
  createRoom,
  createTicket,
  createTicketType,
  createUser,
} from "../factories";
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
    const resp = await server.get("/hotels").set("Authorization", `Bearer ${"invalidToken"}`);
    expect(resp.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 402 if user doesnt have a hotel ticket paid", async () => {
      const token = await generateValidToken();
      const resp = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(resp.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 200 if user have a hotel ticket paid and return all hotels", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const ticketTypeId = (await createTicketType(false, true)).id;
      const enrollmentId = (await createEnrollmentWithAddress(user)).id;
      const ticketId = (await createTicket(enrollmentId, ticketTypeId, "PAID")).id;
      await createPayment(ticketId, 100);
      const hotels = await createHotel();

      const resp = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      expect(resp.status).toBe(httpStatus.OK);
      expect(resp.body).toEqual([
        {
          ...hotels,
          createdAt: hotels.createdAt.toISOString(),
          updatedAt: hotels.updatedAt.toISOString(),
        },
      ]);
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  it("should respond with status 401 if user without token", async () => {
    const hotelId = (await createHotel()).id;
    const resp = await server.get(`/hotels/${hotelId}`);
    expect(resp.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if token is invalid", async () => {
    const hotelId = (await createHotel()).id;
    const resp = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${"invalidToken"}`);
    expect(resp.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 204 if hotelId doesnt exist", async () => {
      const token = await generateValidToken();
      const resp = await server.get("/hotels/0").set("Authorization", `Bearer ${token}`);
      expect(resp.status).toBe(httpStatus.NO_CONTENT);
    });

    it("should respond with status 204 if doesnt have rooms for hotelId", async () => {
      const token = await generateValidToken();
      const hotelId = (await createHotel()).id;
      const resp = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);
      expect(resp.status).toBe(httpStatus.NO_CONTENT);
    });

    describe("and hotelId exists", () => {
      it("should respond with status 200 and a list of rooms including hotels", async () => {
        const token = await generateValidToken();
        const hotelId = (await createHotel()).id;
        const room = await createRoom(hotelId);
        const resp = await server.get(`/hotels/${hotelId}`).set("Authorization", `Bearer ${token}`);
        expect(resp.status).toBe(httpStatus.OK);
        expect(resp.body).toEqual([
          {
            ...room,
            Hotel: {
              ...room.Hotel,
              createdAt: room.Hotel.createdAt.toISOString(),
              updatedAt: room.Hotel.updatedAt.toISOString(),
            },
            createdAt: room.createdAt.toISOString(),
            updatedAt: room.updatedAt.toISOString(),
          },
        ]);
      });
    });
  });
});
