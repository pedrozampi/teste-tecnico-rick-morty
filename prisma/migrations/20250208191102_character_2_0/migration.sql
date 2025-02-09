/*
  Warnings:

  - You are about to drop the `Characters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Locations` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Characters" DROP CONSTRAINT "Characters_Userid_fkey";

-- DropForeignKey
ALTER TABLE "Characters" DROP CONSTRAINT "Characters_originId_fkey";

-- DropTable
DROP TABLE "Characters";

-- DropTable
DROP TABLE "Locations";

-- CreateTable
CREATE TABLE "characters" (
    "id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "Userid" INTEGER NOT NULL,

    CONSTRAINT "characters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "characters" ADD CONSTRAINT "characters_Userid_fkey" FOREIGN KEY ("Userid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
