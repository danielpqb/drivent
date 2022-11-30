import app, { init } from "@/app";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createBookingWithRoom, createHotel, createRoomWithHotelId, createUser } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 404 when user has no booking", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const hotel = await createHotel();
    await createRoomWithHotelId(hotel.id);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
    expect(response.body).toEqual([]);
  });

  it("should respond with status 200 if user has a booking", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    const booking = await createBookingWithRoom(room.id, user.id);

    const response = await server.get("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual({
      ...booking,
      createdAt: booking.createdAt.toISOString(),
      updatedAt: booking.updatedAt.toISOString(),
    });
  });
});

describe("POST /booking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/booking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 404 when roomId doesnt exist", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);

    const body = { roomId: 0 };

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it("should respond with status 403 when out of business rules", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);

    const body = { roomId: room.id };

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it("should respond with status 403 when room is full", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);

    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);
    await createBookingWithRoom(room.id, 0);
    await createBookingWithRoom(room.id, 0);
    await createBookingWithRoom(room.id, 0);

    const body = { roomId: room.id };

    const response = await server.post("/booking").set("Authorization", `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.FORBIDDEN);
  });

  it("should respond with status 200 if user has a booking", async () => {
    return;
  });
});
