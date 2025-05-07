-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "tb_user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" "UserRole"[],

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tb_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_location" (
    "user_id" INTEGER NOT NULL,
    "location_id" INTEGER NOT NULL,

    CONSTRAINT "tb_user_location_pkey" PRIMARY KEY ("user_id","location_id")
);

-- CreateTable
CREATE TABLE "tb_service_order" (
    "id" SERIAL NOT NULL,
    "location_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "tb_service_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_order" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "tb_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_product" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "tb_product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_email_key" ON "tb_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_location_name_key" ON "tb_location"("name");

-- AddForeignKey
ALTER TABLE "tb_user_location" ADD CONSTRAINT "tb_user_location_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_location" ADD CONSTRAINT "tb_user_location_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "tb_location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_service_order" ADD CONSTRAINT "tb_service_order_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "tb_location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_service_order" ADD CONSTRAINT "tb_service_order_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "tb_order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_service_order" ADD CONSTRAINT "tb_service_order_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tb_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
