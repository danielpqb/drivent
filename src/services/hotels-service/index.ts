import { notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";

async function getHotels() {
  const hotels = await hotelsRepository.findAllHotels();

  if (!hotels) throw notFoundError();

  return hotels;
}

async function checkIfUserHasPaidHotelTicket(userId: number) {
  const userHasPaidHotelTicket = await hotelsRepository.checkIfUserHasPaidHotelTicket(userId);
  if (!userHasPaidHotelTicket) return false;

  return true;
}

async function getRoomsWithHotelId(hotelId: number) {
  const rooms = await hotelsRepository.getRoomsWithHotelId(hotelId);

  if (!rooms) throw notFoundError();

  return rooms;
}

const hotelsService = {
  getHotels,
  checkIfUserHasPaidHotelTicket,
  getRoomsWithHotelId,
};

export default hotelsService;
