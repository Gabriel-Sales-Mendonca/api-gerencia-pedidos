/*
  Warnings:

  - Added the required column `company_id` to the `tb_service_order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_service_order" ADD COLUMN     "company_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "tb_company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tb_company_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_service_order" ADD CONSTRAINT "tb_service_order_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "tb_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
