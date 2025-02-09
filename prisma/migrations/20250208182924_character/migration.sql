/*
  Warnings:

  - You are about to drop the column `Favorites` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "Favorites";

-- CreateTable
CREATE TABLE "Locations" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Characters" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "originId" INTEGER NOT NULL,
    "Userid" INTEGER NOT NULL,

    CONSTRAINT "Characters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Characters" ADD CONSTRAINT "Characters_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Characters" ADD CONSTRAINT "Characters_Userid_fkey" FOREIGN KEY ("Userid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
