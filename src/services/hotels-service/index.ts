import { notFoundError } from "@/errors";
import hotelsRepository from "@/repositories/hotels-repository";

async function getHotels() {
  const hotels = await hotelsRepository.findAllHotels();

  if (!hotels) throw notFoundError();

  return hotels;
}

async function getAvailableRoomsByHotelId(hotelId: number) {
  const rooms = await hotelsRepository.findAvailableRoomsWithHotelId(hotelId);

  if (!rooms) throw notFoundError();

  return rooms;
}

const hotelsService = {
  getHotels,
  getAvailableRoomsByHotelId,
};

export default hotelsService;
