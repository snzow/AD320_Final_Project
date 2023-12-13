-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "time" TEXT NOT NULL,
    "venueId" INTEGER,
    "bandId" INTEGER NOT NULL,
    "reserved" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Reservation_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Reservation_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("bandId", "id", "reserved", "time", "venueId") SELECT "bandId", "id", "reserved", "time", "venueId" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'band'
);
INSERT INTO "new_User" ("id", "password", "username") SELECT "id", "password", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
