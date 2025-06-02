import { ConflictException, Injectable } from "@nestjs/common";

import { PrismaService } from "src/database/prisma/prisma.service";
import { UserLocationDeleteRequestDTO } from "./dto/user-location-delete-request.dto";

@Injectable()
export class UserLocationRepository {
    constructor(private prisma: PrismaService) { }

    async findAllRelationshipsWithLocations(page: number, limit: number) {

        const skip = (page - 1) * limit

        const [usersLocations, total] = await this.prisma.$transaction([
            this.prisma.userLocation.findMany({
                skip,
                take: limit,
                select: {
                    user: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    location: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }),
            this.prisma.user.count()
        ])

        return {
            usersLocations,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        }

    }

    async insert(userId: number, locationId: number) {
        const alreadyRelated = await this.prisma.userLocation.findUnique({
            where: {
                user_id_location_id: { user_id: userId, location_id: locationId }
            }
        })

        if (alreadyRelated != null) {
            throw new ConflictException("Relacionamento já existe!")
        }

        return await this.prisma.userLocation.create({
            data: {
                user_id: userId,
                location_id: locationId
            }
        })
    }

    async delete(userLocationId: UserLocationDeleteRequestDTO) {
        await this.prisma.userLocation.delete({
            where: {
                user_id_location_id: {
                    user_id: userLocationId.userId,
                    location_id: userLocationId.locationId
                }
            }
        })
    }

}