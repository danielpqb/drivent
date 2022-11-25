import { prisma } from "@/config";

async function findAllHotels() {
  return prisma.hotel.findMany();
}

async function checkIfUserHasPaidHotelTicket(userId: number) {
  return prisma.payment.findFirst({
    where: { Ticket: { TicketType: { includesHotel: true, isRemote: false }, Enrollment: { userId } } },
  });
}

async function getRoomsWithHotelId(hotelId: number) {
  return prisma.room.findMany({
    where: { hotelId },
    include: { Hotel: true },
  });
}

const hotelsRepository = {
  findAllHotels,
  getRoomsWithHotelId,
  checkIfUserHasPaidHotelTicket,
};

export default hotelsRepository;
