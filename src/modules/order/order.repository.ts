import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/database/prisma/prisma.service";
import { Order } from "generated/prisma";
import { ServiceOrderRepository } from "../serviceOrder/service-order.repository";

interface IOrder {
    id: number;
    company_id: number,
    delivery_date?: Date;
}

@Injectable()
export class OrderRepository {
    constructor(private prisma: PrismaService, private serviceOrderRepository: ServiceOrderRepository) { }

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

    async delete(orderId: number, companyId: number, serviceOrderIds: number[]) {
        await this.prisma.$transaction(async tx => {
            await this.serviceOrderRepository.deleteManyWithTx(serviceOrderIds, tx)

            await tx.order.deleteMany({
                where: {
                    id: orderId,
                    company_id: companyId
                }
            })
        })
    }

    async finish(orderId: number, companyId: number) {
        await this.prisma.order.update({
            where: {
                id_company_id: {
                    id: orderId,
                    company_id: companyId
                }
            },
            data: {
                finished: true
            }
        })
    }

    async unfinish(orderId: number, companyId: number) {
        await this.prisma.order.update({
            where: {
                id_company_id: {
                    id: orderId,
                    company_id: companyId
                }
            },
            data: {
                finished: false
            }
        })
    }

}