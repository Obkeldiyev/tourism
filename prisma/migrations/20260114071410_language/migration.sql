/*
  Warnings:

  - You are about to drop the column `info_description` on the `additional_info` table. All the data in the column will be lost.
  - You are about to drop the column `info_title` on the `additional_info` table. All the data in the column will be lost.
  - Added the required column `info_description_en` to the `additional_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `info_description_kaa` to the `additional_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `info_description_ru` to the `additional_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `info_description_uz` to the `additional_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `info_title_en` to the `additional_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `info_title_kaa` to the `additional_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `info_title_ru` to the `additional_info` table without a default value. This is not possible if the table is not empty.
  - Added the required column `info_title_uz` to the `additional_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "additional_info" DROP COLUMN "info_description",
DROP COLUMN "info_title",
ADD COLUMN     "info_description_en" TEXT NOT NULL,
ADD COLUMN     "info_description_kaa" TEXT NOT NULL,
ADD COLUMN     "info_description_ru" TEXT NOT NULL,
ADD COLUMN     "info_description_uz" TEXT NOT NULL,
ADD COLUMN     "info_title_en" TEXT NOT NULL,
ADD COLUMN     "info_title_kaa" TEXT NOT NULL,
ADD COLUMN     "info_title_ru" TEXT NOT NULL,
ADD COLUMN     "info_title_uz" TEXT NOT NULL;
