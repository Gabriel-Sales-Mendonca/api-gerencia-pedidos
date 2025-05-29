import { Injectable, NotFoundException } from '@nestjs/common';
import { LocationRepository } from './location.repository';
import { LocationRequestDTO } from './dto/location-request.dto';
import { LocationFindAllResponseDTO } from './dto/location-find-all-response.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Injectable()
export class LocationService {
    constructor(private locationRepository: LocationRepository) { }

    async findAll(pagination: PaginationDTO): Promise<LocationFindAllResponseDTO> {

        const page = pagination.page ?? 1;
        const limit = pagination.limit ?? 10;

        return this.locationRepository.findAll(page, limit);
    }

    async findById(locationId: number) {
        const location = await this.locationRepository.findById(locationId)

        if (!location) {
            throw new NotFoundException("Localização não encontrada")
        }

        return location
    }

    async findByName(location: LocationRequestDTO) {
        return await this.locationRepository.findByName(location.name)
    }

    async insert(locationRequestDTO: LocationRequestDTO) {

        const createdLocation = await this.locationRepository.insert(
            {
                name: locationRequestDTO.name,
            }
        );

        return {
            id: createdLocation.id,
            name: createdLocation.name,
        }
    }

    async update(locationId: number, data: LocationRequestDTO) {
        await this.findById(locationId)

        return this.locationRepository.update(locationId, data)
    }

    async delete(locationId: number) {
        await this.findById(locationId)

        return await this.locationRepository.delete(locationId)
    }
}
