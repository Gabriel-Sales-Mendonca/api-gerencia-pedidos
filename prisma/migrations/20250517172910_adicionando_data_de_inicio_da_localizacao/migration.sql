/*
  Warnings:

  - You are about to drop the column `observation` on the `tb_service_order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_service_order" DROP COLUMN "observation",
ADD COLUMN     "location_start_date" TIMESTAMP(3);
