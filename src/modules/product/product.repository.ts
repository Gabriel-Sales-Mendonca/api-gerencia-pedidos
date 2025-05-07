import { Injectable } from "@nestjs/common";
import { Product } from "generated/prisma";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class ProductRepository {
    constructor(private prisma: PrismaService) {}

    async findById(idRequest: string): Promise<Product | null> {
        return await this.prisma.product.findUnique({
            where: {
                id: idRequest
            }
        })
    }

    async insert(product: Product): Promise<Product> {
        return await this.prisma.product.create({
            data: {
                id: product.id
            }
        })
    }
}