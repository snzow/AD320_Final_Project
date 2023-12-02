import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {}

interface Reservation {
  bandName: string;
  venueName: string;
  dateTime: Date;
}

export async function makeReservationDb(reservation: Reservation) {
  const venue = await prisma.venue.findFirst({
    where: {
      venueName: reservation.venueName,
    },
  });
  if (!venue) {
    return 'No Venue';
  }
  const band = await prisma.band.upsert({
    where: {
      bandName: reservation.bandName,
    },
    update: {},
    create: {
      bandName: reservation.bandName,
    },
  });
  const existingReservation = await prisma.reservation.findFirst({
    where: {
      time: reservation.dateTime,
      venueId: venue.id,
    },
  });
  if (existingReservation) {
    return 'Time Unavailable';
  }
  const result = await prisma.reservation.create({
    data: {
      time: reservation.dateTime,
      venueId: venue.id,
      bandId: band.id,
    },
  });
  return result;
}

export async function getReservationsByVenue(venueName : string){
    const venue = await prisma.venue.findFirst({
        where: {
          venueName: venueName
        },
      });
      if (!venue) {
        return 'No Venue';
      }

    const reservations = await prisma.reservation.findMany({
        where : {
            venueId : venue.id
        }
    });
    return reservations;
}

export async function getReservations(){
    return await prisma.reservation.findMany();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
