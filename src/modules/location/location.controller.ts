import { Controller, Get, Post, Body, Query, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { LocationRequestDTO } from './dto/location-request.dto';
import { LocationService } from './location.service';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Controller('locations')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Get()
    async findAll(@Query() pagination: PaginationDTO) {
        return await this.locationService.findAll(pagination);
    }

    @Post()
    async insert(@Body() locationRequestDTO: LocationRequestDTO) {
        return await this.locationService.insert(locationRequestDTO);
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() locationRequestDTO: LocationRequestDTO
    ) {
        return this.locationService.update(id, locationRequestDTO)
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        await this.locationService.delete(id)
    }
}
