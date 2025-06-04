import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { CompanyRepository } from "./company.repository";
import { PaginationDTO } from "src/common/dto/pagination.dto";
import { PrismaClientKnownRequestError } from "generated/prisma/runtime/library";
import { CompanyFindAllResponseDTO } from "./dto/company-find-all-response.dto";
import { CompanyRequestDTO } from "./dto/company-request.dto";
import { CompanyResponseDTO } from "./dto/company-response.dto";

@Injectable()
export class CompanyService {
    constructor(private readonly companyRepository: CompanyRepository) { }

    async findAll(pagination: PaginationDTO): Promise<CompanyFindAllResponseDTO> {

        const page = pagination.page ?? 1
        const limit = pagination.limit ?? 10

        return await this.companyRepository.findAll(page, limit)
    }

    async findById(companyId: number) {
        const company = await this.companyRepository.findById(companyId)

        if (!company) {
            throw new NotFoundException("Empresa não encontrada")
        }

        return companyId
    }

    async insert(data: CompanyRequestDTO): Promise<CompanyResponseDTO> {
        data.name = data.name.trim()

        const companyExist = await this.companyRepository.findByName(data.name)

        if (companyExist) {
            throw new BadRequestException("Nome da empresa já existe")
        }

        return await this.companyRepository.insert(data)
    }

    async update(companyId: number, data: CompanyRequestDTO): Promise<CompanyResponseDTO> {
        data.name = data.name.trim()

        try {
            return await this.companyRepository.update(companyId, data)
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('Empresa não encontrada, ID: ' + companyId);
            }
            throw error;
        }
    }

    async delete(companyId: number) {
        try {
            await this.companyRepository.delete(companyId)
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('Empresa não encontrada, ID: ' + companyId);
            }
            throw error;
        }
    }

}