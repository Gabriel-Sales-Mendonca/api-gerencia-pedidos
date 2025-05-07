import { Injectable } from '@nestjs/common';
import { LocationRepository } from './location.repository';
import { LocationRequestDTO } from './dto/location-request.dto';

@Injectable()
export class LocationService {
    constructor(private locationRepository: LocationRepository) { }

    async findAll() {
        return this.locationRepository.findAll();
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
}
