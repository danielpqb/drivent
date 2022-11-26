import { AuthenticatedRequest } from "@/middlewares";
import hotelsService from "@/services/hotels-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;

  try {
    const userHasPaidHotelTicket = await hotelsService.checkIfUserHasPaidHotelTicket(userId);
    if (!userHasPaidHotelTicket) return res.sendStatus(httpStatus.PAYMENT_REQUIRED);

    const hotels = await hotelsService.getHotels();
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getRoomsWithHotelId(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.hotelId);

  try {
    const rooms = await hotelsService.getRoomsWithHotelId(hotelId);

    if (rooms.length === 0) {
      return res.sendStatus(httpStatus.NO_CONTENT);
    }

    return res.status(httpStatus.OK).send(rooms);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
