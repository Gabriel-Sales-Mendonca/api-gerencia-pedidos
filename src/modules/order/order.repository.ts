import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { Order } from "generated/prisma";

interface IOrder {
    id: number;
    company_id: number,
    delivery_date?: Date;
}

@Injectable()
export class OrderRepository {
    constructor(private prisma: PrismaService) {}

    async insert(order: IOrder): Promise<Order> {
        return await this.prisma.order.create({
            data: {
                id: order.id,
                company_id: order.company_id,
                delivery_date: order.delivery_date
            }
        });
    }

    async findAll(): Promise<Order[]> {
        return await this.prisma.order.findMany()
    }

    async findById(idRequest: number) {
        return await this.prisma.order.findFirst({
            where: {
                id: idRequest
            }
        })
    }

    async findByIdAndCompany(id: number, company_id: number) {
        return await this.prisma.order.findFirst({
            where: {
                id,
                company_id
            }
        });
    }

}