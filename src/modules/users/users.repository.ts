import { ConflictException, Injectable } from '@nestjs/common';

import { UserRequestDTO } from './dto/user-request.dto';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserEditRequestDTO } from './dto/user-edit-request.dto';

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<User[]> {
        return await this.prisma.user.findMany({
            orderBy: {
                id: 'asc'
            }
        })
    }

    async findByEmail(emailRequest: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                email: emailRequest
            }
        })
    }

    async findById(userId: number): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                id: userId
            }
        })
    }

    async insert(user: UserRequestDTO): Promise<User> {
        return await this.prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password,
                roles: user.roles
            }
        });
    }

    async update(userId: number, data: UserEditRequestDTO) {
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: data.name,
                roles: data.roles
            }
        })
    }

    async delete(userId: number) {
        await this.prisma.user.delete({
            where: {
                id: userId
            }
        })
    }

    async updatePassword(userId: number, password: string) {
        return await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: password
            }
        })
    }

    async relateToLocation(userId: number, locationId: number) {
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
}