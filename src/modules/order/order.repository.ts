import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { Order } from "generated/prisma";

@Injectable()
export class OrderRepository {
    constructor(private prisma: PrismaService) {}

    async insert(order: Order): Promise<Order> {
        return await this.prisma.order.create({
            data: {
                id: order.id
            }
        });
    }

    async findById(idRequest: number) {
        return await this.prisma.order.findUnique({
            where: {
                id: idRequest
            }
        })
    }

}