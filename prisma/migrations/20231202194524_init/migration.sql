-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" DATETIME NOT NULL,
    "venueId" INTEGER NOT NULL,
    "bandId" INTEGER NOT NULL,
    CONSTRAINT "Reservation_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Band" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bandName" TEXT NOT NULL,
    "gigsPlayed" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Venue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "venueName" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Band_bandName_key" ON "Band"("bandName");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_venueName_key" ON "Venue"("venueName");
