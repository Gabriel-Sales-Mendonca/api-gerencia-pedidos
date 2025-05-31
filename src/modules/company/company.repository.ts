import { Injectable } from "@nestjs/common";

import { PrismaService } from "src/database/prisma/prisma.service";
import { CompanyFindAllResponseDTO } from "./dto/company-find-all-response.dto";
import { CompanyResponseDTO } from "./dto/company-response.dto";
import { CompanyRequestDTO } from "./dto/company-request.dto";

@Injectable()
export class CompanyRepository {
    constructor(private prisma: PrismaService) { }

    async findAll(page: number, limit: number): Promise<CompanyFindAllResponseDTO> {

        const skip = (page - 1) * limit

        const [companies, total] = await this.prisma.$transaction([
            this.prisma.company.findMany({
                skip,
                take: limit,
                orderBy: {
                    id: 'asc'
                },
                select: {
                    id: true,
                    name: true
                }
            }),
            this.prisma.company.count()
        ])

        return {
            companies,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        }

    }

    async findById(companyId: number) {
        return await this.prisma.company.findUnique({
            where: {
                id: companyId
            }
        })
    }

    async findByName(name: string) {
        return await this.prisma.company.findUnique({
            where: { name: name }
        })
    }

    async insert(company: CompanyRequestDTO): Promise<CompanyResponseDTO> {
        return await this.prisma.company.create({
            data: company
        })
    }

    async update(companyId: number, data: CompanyRequestDTO): Promise<CompanyResponseDTO> {
        return await this.prisma.company.update({
            where: {
                id: companyId
            },
            data: data
        })
    }

    async delete(companyId: number) {
        return await this.prisma.company.delete({
            where: { id: companyId }
        })
    }

}