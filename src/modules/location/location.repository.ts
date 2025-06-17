import { Injectable } from '@nestjs/common';

import { Location } from 'generated/prisma';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { LocationRequestDTO } from './dto/location-request.dto';
import { LocationFindAllResponseDTO } from './dto/location-find-all-response.dto';

@Injectable()
export class LocationRepository {
    constructor(private prisma: PrismaService) { }

    async findAll(page: number, limit: number): Promise<LocationFindAllResponseDTO> {

        const skip = (page - 1) * limit

        const [locations, total] = await this.prisma.$transaction([
            this.prisma.location.findMany({
                skip,
                take: limit,
                orderBy: {
                    id: 'asc'
                },
                select: {
                    id: true,
                    name: true
                }
            }),
            this.prisma.location.count()
        ])

        return {
            locations,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        }

    }

    async findAllWithoutPagination() {
        return await this.prisma.location.findMany()
    }

    async findById(locationId: number): Promise<Location | null> {
        return await this.prisma.location.findUnique({
            where: {
                id: locationId
            }
        })
    }

    async findByName(nameRequest: string): Promise<Location | null> {
        return await this.prisma.location.findUnique({
            where: {
                name: nameRequest
            }
        })
    }

    async insert(location: LocationRequestDTO): Promise<Location> {
        return await this.prisma.location.create({
            data: {
                name: location.name,
            }
        });
    }

    async update(locationId: number, data: LocationRequestDTO) {
        return await this.prisma.location.update({
            where: {
                id: locationId
            },
            data: data
        })
    }

    async delete(locationId: number) {
        return await this.prisma.location.delete({
            where: {
                id: locationId
            }
        })
    }
}