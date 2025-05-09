/*
  Warnings:

  - You are about to drop the `tb_company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_company_order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tb_order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tb_company_order" DROP CONSTRAINT "tb_company_order_company_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_company_order" DROP CONSTRAINT "tb_company_order_order_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_service_order" DROP CONSTRAINT "tb_service_order_order_id_fkey";

-- DropTable
DROP TABLE "tb_company";

-- DropTable
DROP TABLE "tb_company_order";

-- DropTable
DROP TABLE "tb_order";

-- CreateTable
CREATE TABLE "Order" (
    "id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id","company_id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tb_service_order" ADD CONSTRAINT "tb_service_order_order_id_company_id_fkey" FOREIGN KEY ("order_id", "company_id") REFERENCES "Order"("id", "company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_service_order" ADD CONSTRAINT "tb_service_order_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
