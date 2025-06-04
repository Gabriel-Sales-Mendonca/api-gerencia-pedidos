/*
  Warnings:

  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_company_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_service_order" DROP CONSTRAINT "tb_service_order_company_id_fkey";

-- DropForeignKey
ALTER TABLE "tb_service_order" DROP CONSTRAINT "tb_service_order_order_id_company_id_fkey";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "Order";

-- CreateTable
CREATE TABLE "tb_order" (
    "id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "delivery_date" TIMESTAMP(3),

    CONSTRAINT "tb_order_pkey" PRIMARY KEY ("id","company_id")
);

-- CreateTable
CREATE TABLE "tb_company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tb_company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_company_name_key" ON "tb_company"("name");

-- AddForeignKey
ALTER TABLE "tb_service_order" ADD CONSTRAINT "tb_service_order_order_id_company_id_fkey" FOREIGN KEY ("order_id", "company_id") REFERENCES "tb_order"("id", "company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_service_order" ADD CONSTRAINT "tb_service_order_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "tb_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_order" ADD CONSTRAINT "tb_order_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "tb_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
