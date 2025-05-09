/*
  Warnings:

  - You are about to drop the column `company_id` on the `tb_order` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "tb_order" DROP CONSTRAINT "tb_order_company_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_service_order" DROP CONSTRAINT "tb_service_order_company_id_fkey";

-- AlterTable
ALTER TABLE "tb_order" DROP COLUMN "company_id";

-- CreateTable
CREATE TABLE "tb_company_order" (
    "company_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,

    CONSTRAINT "tb_company_order_pkey" PRIMARY KEY ("company_id","order_id")
);

-- AddForeignKey
ALTER TABLE "tb_company_order" ADD CONSTRAINT "tb_company_order_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "tb_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_company_order" ADD CONSTRAINT "tb_company_order_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "tb_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
