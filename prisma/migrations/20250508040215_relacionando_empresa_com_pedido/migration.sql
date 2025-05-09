/*
  Warnings:

  - Added the required column `company_id` to the `tb_order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_order" ADD COLUMN     "company_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "tb_order" ADD CONSTRAINT "tb_order_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "tb_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
