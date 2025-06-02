import { Injectable } from "@nestjs/common";

import { PaginationDTO } from "src/common/dto/pagination.dto";
import { UserLocationRepository } from "./userLocation.repository";
import { UserLocationRequestDTO } from "./dto/user-location-request.dto";
import { UsersService } from "../users/users.service";
import { LocationService } from "../location/location.service";
import { UserLocationDeleteRequestDTO } from "./dto/user-location-delete-request.dto";

@Injectable()
export class UserLocationService {
    constructor(
        private userLocationRepository: UserLocationRepository,
        private usersService: UsersService,
        private locationService: LocationService
    ) { }

    async findAllRelationshipsWithLocations(pagination: PaginationDTO) {

        const page = pagination.page ?? 1
        const limit = pagination.limit ?? 10

        return await this.userLocationRepository.findAllRelationshipsWithLocations(page, limit)
    }

    async insert(data: UserLocationRequestDTO) {
        await this.usersService.findById(data.userId)
        await this.locationService.findById(data.locationId)

        return await this.userLocationRepository.insert(data.userId, data.locationId)
    }

    async delete(userLocationId: UserLocationDeleteRequestDTO) {
        await this.usersService.findById(userLocationId.userId)
        await this.locationService.findById(userLocationId.locationId)

        await this.userLocationRepository.delete(userLocationId)
    }

}