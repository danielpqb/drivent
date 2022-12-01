import { notFoundError } from "@/errors";
import bookingsRepository from "@/repositories/bookings-repository";

async function getBooking(userId: number) {
  const booking = await bookingsRepository.getBooking(userId);

  if (!booking) throw notFoundError();

  return booking;
}

const bookingssService = {
  getBooking,
};

export default bookingssService;
