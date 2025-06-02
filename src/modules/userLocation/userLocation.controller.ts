import { Body, Controller, Delete, Get, ParseIntPipe, Post, Query } from "@nestjs/common";

import { PaginationDTO } from "src/common/dto/pagination.dto";
import { UserLocationService } from "./userLocation.service";
import { UserLocationRequestDTO } from "./dto/user-location-request.dto";
import { Roles } from "src/decorators/roles.decorator";

@Controller('user-location')
export class UserLocationController {
    constructor(private readonly userLocationService: UserLocationService) {}

    @Get()
    async findAllRelationshipsWithLocations(@Query() pagination: PaginationDTO) {
        return await this.userLocationService.findAllRelationshipsWithLocations(pagination)
    }

    @Roles('ADMIN')
    @Post()
    async insert(@Body() data: UserLocationRequestDTO) {
        return await this.userLocationService.insert(data)
    }

    @Roles('ADMIN')
    @Delete()
    async delete(
        @Query('userId', ParseIntPipe) userId: number,
        @Query('locationId', ParseIntPipe) locationId: number
    ) {
        await this.userLocationService.delete({ userId, locationId })
    }

}