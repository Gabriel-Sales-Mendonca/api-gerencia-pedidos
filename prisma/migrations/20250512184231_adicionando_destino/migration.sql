-- AlterTable
ALTER TABLE "tb_service_order" ADD COLUMN     "destination_id" INTEGER;

-- AddForeignKey
ALTER TABLE "tb_service_order" ADD CONSTRAINT "tb_service_order_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "tb_location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
