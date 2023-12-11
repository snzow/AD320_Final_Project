/*
  Warnings:

  - Added the required column `userId` to the `Venue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Band` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Venue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "venueName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Venue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Venue" ("id", "venueName") SELECT "id", "venueName" FROM "Venue";
DROP TABLE "Venue";
ALTER TABLE "new_Venue" RENAME TO "Venue";
CREATE UNIQUE INDEX "Venue_venueName_key" ON "Venue"("venueName");
CREATE UNIQUE INDEX "Venue_userId_key" ON "Venue"("userId");
CREATE TABLE "new_Band" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bandName" TEXT NOT NULL,
    "gigsPlayed" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Band_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Band" ("bandName", "gigsPlayed", "id") SELECT "bandName", "gigsPlayed", "id" FROM "Band";
DROP TABLE "Band";
ALTER TABLE "new_Band" RENAME TO "Band";
CREATE UNIQUE INDEX "Band_bandName_key" ON "Band"("bandName");
CREATE UNIQUE INDEX "Band_userId_key" ON "Band"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
