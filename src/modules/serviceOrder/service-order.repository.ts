import { Injectable } from "@nestjs/common";
import { ServiceOrder } from "generated/prisma";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class ServiceOrderRepository {
    constructor(private prisma: PrismaService) {}

    async insert(location_id: number, order_id: number, product_id: string): Promise<ServiceOrder> {
        return await this.prisma.serviceOrder.create({
            data: {
                location_id: location_id,
                order_id: order_id,
                product_id: product_id
            }
        })
    }
}