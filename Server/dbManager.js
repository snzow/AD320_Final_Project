import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {}

export async function makeReservationDb(timeId, venueName) {
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

export async function getReservationsByVenue(venueName, available = false) {
  const venue = await prisma.venue.findFirst({
    where: {
      venueName: venueName,
      reserved: !available,
    },
  });
  if (!venue) {
    return 'No Venue';
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      venueId: venue.id,
    },
  });
  return reservations;
}

export async function getReservationsByBand(bandName, available = false) {
  const band = await prisma.band.findUnique({
    where: {
      bandName: bandName,
    },
  });
  if (!band) {
    return 'No Band';
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      reserved: !available,
      band: {
        bandName: bandName,
      }
    },
  });
  return reservations;
}

export async function getReservations(available = false) {
  return await prisma.reservation.findMany({
    where: {
      reserved: !available,
    },
  });
}

export async function createBandAvailability(bandId, time) {
  return await prisma.reservation.create({
    data: {
      time: time,
      band: { connect: { bandName: bandId, } },
    },
  });
}

export async function createReservation(bandId, venueId, time) {
  const reservation = await prisma.reservation.findFirst({
    where: {
      bandId: bandId,
      time: time,
    },
  });
  if ((reservation.reserved = false)) {
    const newReservation = await prisma.reservation.update({
      where: {
        id: reservation.id,
      },
      update: {
        reserved: true,
        venueId : venueId,
      },
    });
    return newReservation;
  } else {
    return 'time slot not available';
  }
}

export async function createUser(username, password, type, name) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });
  if (user) {
    return 'Username Taken';
  }
  const result = await prisma.user.create({
    data: {
      username: username,
      password: password,
      type: type
    },
  });
  return result;
}

export async function login(username, password) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    main();
    if (!user) {
      console.log('no user');
      return 'Invalid Username';
    }
    if (user.password != password) {
      console.log('bad password');
      return 'Invalid Password';
    }
    console.log('here');
    return user;
  } catch {
    console.log('error caught');
    return 'Invalid Username';
  }
}

export async function getUserByUsername(username) {
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
    include: {
        band: {
          select: { bandName: true,
                    id: true}
        },
        venue: {
          select: { venueName: true,
                    id: true}
        }
      },
    });
  main();
  return user;
}

export async function getBands(){
  const bands = await prisma.band.findMany();
  return bands;
}

export async function getVenues(){
  const venues = await prisma.venue.findMany();
  return venues;
}

export async function createVenue(venueName, username = null) {
  if (username) {
    const user = getUserByUsername(username);
    if (!user) {
      return 'user not found';
    }
    const venue = await prisma.venue.create({
      data: {
        venueName: venueName,
        userId: user.id,
      },
    });
    return venue;
  }
  const venue = await prisma.venue.create({
    data: {
      venueName: venueName,
    },
  });
  return venue;
}

export async function createBand(bandName, username = null) {
  if (username) {
    const user = getUserByUsername(username);
    if (!user) {
      return 'user not found';
    }
    const band = await prisma.band.create({
      data: {
        bandName: bandName,
        userId: user.id,
      },
    });
    return band;
  }
  const band = await prisma.band.create({
    data: {
      bandName: bandName,
    },
  });
  return band;
}

export async function searchBands(keyword){
  const bands = await getBands();
  const retVal = bands.filter(item => item.bandName.includes(keyword) || item.gigsPlayed > keyword || item.location.includes(keyword));
  return retVal;
}

export async function init() {}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
