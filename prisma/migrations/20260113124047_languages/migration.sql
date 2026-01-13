/*
  Warnings:

  - You are about to drop the column `description` on the `Turs` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Turs` table. All the data in the column will be lost.
  - Added the required column `description_en` to the `Turs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_kaa` to the `Turs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_ru` to the `Turs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description_uz` to the `Turs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_en` to the `Turs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_kaa` to the `Turs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_ru` to the `Turs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title_uz` to the `Turs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Turs" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "description_en" TEXT NOT NULL,
ADD COLUMN     "description_kaa" TEXT NOT NULL,
ADD COLUMN     "description_ru" TEXT NOT NULL,
ADD COLUMN     "description_uz" TEXT NOT NULL,
ADD COLUMN     "title_en" TEXT NOT NULL,
ADD COLUMN     "title_kaa" TEXT NOT NULL,
ADD COLUMN     "title_ru" TEXT NOT NULL,
ADD COLUMN     "title_uz" TEXT NOT NULL;
