import faker from "@faker-js/faker";
import { prisma } from "@/config";
import { TicketStatus } from "@prisma/client";

export async function createTicketType(isRemote: boolean, includesHotel: boolean) {
  const _isRemote = isRemote === undefined ? faker.datatype.boolean() : isRemote;
  const _includesHotel = includesHotel === undefined ? faker.datatype.boolean() : includesHotel;

  return prisma.ticketType.create({
    data: {
      name: faker.name.findName(),
      price: faker.datatype.number(),
      isRemote: _isRemote,
      includesHotel: _includesHotel,
    },
  });
}

export async function createTicket(enrollmentId: number, ticketTypeId: number, status: TicketStatus) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status,
    },
  });
}
