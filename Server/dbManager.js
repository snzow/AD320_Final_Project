import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {}

export async function makeReservationDb(reservation) {
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

export async function getReservationsByVenue(venueName) {
  const venue = await prisma.venue.findFirst({
    where: {
      venueName: venueName,
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

export async function getReservationsByBand(bandName) {
  const band = await prisma.band.findFirst({
    where: {
      bandName: bandName,
    },
  });
  if (!band) {
    return 'No Band';
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      bandId: band.id,
    },
  });
  return reservations;
}

export async function getReservations() {
  return await prisma.reservation.findMany();
}

export async function createUser(username, password) {
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
  });
  main();
  return user;
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