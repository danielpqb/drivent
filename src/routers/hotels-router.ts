import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getHotels, getAvailableRoomsByHotelId } from "@/controllers";

const hotelsRouter = Router();

hotelsRouter
  //.all("/*", authenticateToken)
  .get("/", getHotels)
  .get("/:hotelId", getAvailableRoomsByHotelId);

export { hotelsRouter };
