-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Venue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "venueName" TEXT NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "Venue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Venue" ("id", "userId", "venueName") SELECT "id", "userId", "venueName" FROM "Venue";
DROP TABLE "Venue";
ALTER TABLE "new_Venue" RENAME TO "Venue";
CREATE UNIQUE INDEX "Venue_venueName_key" ON "Venue"("venueName");
CREATE UNIQUE INDEX "Venue_userId_key" ON "Venue"("userId");
CREATE TABLE "new_Band" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bandName" TEXT NOT NULL,
    "gigsPlayed" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER,
    CONSTRAINT "Band_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Band" ("bandName", "gigsPlayed", "id", "userId") SELECT "bandName", "gigsPlayed", "id", "userId" FROM "Band";
DROP TABLE "Band";
ALTER TABLE "new_Band" RENAME TO "Band";
CREATE UNIQUE INDEX "Band_bandName_key" ON "Band"("bandName");
CREATE UNIQUE INDEX "Band_userId_key" ON "Band"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
