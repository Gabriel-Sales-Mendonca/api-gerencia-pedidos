import { Injectable } from '@nestjs/common';

import { UserRequestDTO } from './dto/user-request.dto';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class UsersRepository {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<User[]> {
        return await this.prisma.user.findMany()
    }

    async findByEmail(emailRequest: string): Promise<User | null> {
        return await this.prisma.user.findUnique({
            where: {
                email: emailRequest
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
}