import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";

import { CompanyService } from "./company.service";
import { PaginationDTO } from "src/common/dto/pagination.dto";
import { Roles } from "src/decorators/roles.decorator";
import { CompanyFindAllResponseDTO } from "./dto/company-find-all-response.dto";
import { CompanyRequestDTO } from "./dto/company-request.dto";
import { CompanyResponseDTO } from "./dto/company-response.dto";

@Controller('companies')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Get()
    async findAll(@Query() pagination: PaginationDTO): Promise<CompanyFindAllResponseDTO> {
        return await this.companyService.findAll(pagination)
    }

    @Roles('ADMIN')
    @Post()
    async insert(@Body() data: CompanyRequestDTO): Promise<CompanyResponseDTO> {
        return await this.companyService.insert(data)
    }

    @Roles('ADMIN')
    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) companyId: number,
        @Body() data: CompanyRequestDTO
    ): Promise<CompanyResponseDTO> {
        return this.companyService.update(companyId, data)
    }

    @Roles('ADMIN')
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) companyId: number) {
        await this.companyService.delete(companyId)
    }

}