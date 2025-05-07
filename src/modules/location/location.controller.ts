import { Controller, Get, Post, Body } from '@nestjs/common';
import { LocationRequestDTO } from './dto/location-request.dto';
import { LocationService } from './location.service';

@Controller('locations')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    @Get()
    async findAll() {
        return await this.locationService.findAll();
    }

    @Post()
    async insert(@Body() locationRequestDTO: LocationRequestDTO) {
        return await this.locationService.insert(locationRequestDTO);
    }
}
