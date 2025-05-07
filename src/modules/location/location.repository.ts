import { Injectable } from '@nestjs/common';

import { Location } from 'generated/prisma';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { LocationRequestDTO } from './dto/location-request.dto';

@Injectable()
export class LocationRepository {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return await this.prisma.location.findMany();
    }

    async insert(location: LocationRequestDTO): Promise<Location> {
        return await this.prisma.location.create({
            data: {
                name: location.name,
            }
        });
    }
}