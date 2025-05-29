import { Controller, Get, Post, Body, Query, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { LocationRequestDTO } from './dto/location-request.dto';
import { LocationService } from './location.service';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('locations')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Get()
    async findAll(@Query() pagination: PaginationDTO) {
        return await this.locationService.findAll(pagination);
    }

    @Roles('ADMIN')
    @Post()
    async insert(@Body() locationRequestDTO: LocationRequestDTO) {
        return await this.locationService.insert(locationRequestDTO);
    }

    @Roles('ADMIN')
    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() locationRequestDTO: LocationRequestDTO
    ) {
        return this.locationService.update(id, locationRequestDTO)
    }

    @Roles('ADMIN')
    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.locationService.delete(id)
    }
}
