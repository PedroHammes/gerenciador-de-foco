/*
  Warnings:

  - Added the required column `userId` to the `FocusSession` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FocusSession" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "description" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "FocusSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FocusSession" ("createdAt", "description", "duration", "endTime", "id", "startTime") SELECT "createdAt", "description", "duration", "endTime", "id", "startTime" FROM "FocusSession";
DROP TABLE "FocusSession";
ALTER TABLE "new_FocusSession" RENAME TO "FocusSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
