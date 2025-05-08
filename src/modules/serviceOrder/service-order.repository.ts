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

    async findAll() {
        return await this.prisma.serviceOrder.findMany()
    }

    async findGroupedOrders() {
        const result = await this.prisma.serviceOrder.groupBy({
            by: ["order_id"],
            _count: {
                product_id: true
            }
        })

        return result.map(item => ({
            order_id: item.order_id,
            product_count: item._count.product_id
        }))
    }

    async findByOrderId(orderId: number) {
        return await this.prisma.serviceOrder.findMany({
            where: {
                order_id: orderId
            },
            include: {
                location: true,
                product: true
            }
        })
    }

}