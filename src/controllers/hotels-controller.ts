import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotels = await hotelsService.getHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getAvailableRoomsByHotelId(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.hotelId);

  try {
    const rooms = await hotelsService.getAvailableRoomsByHotelId(hotelId);
    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}
