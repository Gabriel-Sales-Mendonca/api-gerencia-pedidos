import { Injectable } from '@nestjs/common';

import { UserRequestDTO } from './dto/user-request.dto';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserEditRequestDTO } from './dto/user-edit-request.dto';
import { UserFindAllResponseDTO } from './dto/user-find-all-response.dto';

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService) { }

    async findAll(page: number, limit: number): Promise<UserFindAllResponseDTO> {

        const skip = (page - 1) * limit

        const [users, total] = await this.prisma.$transaction([
            this.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: {
                    id: 'asc'
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    roles: true
                }
            }),
            this.prisma.user.count()
        ])

        return {
            users,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        }
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
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: password
            }
        })
    }

}