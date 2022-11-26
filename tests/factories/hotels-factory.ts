import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel() {
  return prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
    },
  });
}

export async function createRoom(hotelId: number) {
  return prisma.room.create({
    data: {
      hotelId,
      name: faker.company.companyName(),
      capacity: faker.datatype.number(),
    },
    include: { Hotel: true },
  });
}

export async function getHotels() {
  return prisma.hotel.findMany();
}
