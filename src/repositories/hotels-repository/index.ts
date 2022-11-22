import { prisma } from "@/config";

async function findAllHotels() {
  return prisma.hotel.findMany();
}

async function findAvailableRoomsWithHotelId(hotelId: number) {
  return prisma.booking.findMany({
    where: { Room: { hotelId } },
    select: { roomId: true },
  });
}

const hotelsRepository = {
  findAllHotels,
  findAvailableRoomsWithHotelId,
};

export default hotelsRepository;
