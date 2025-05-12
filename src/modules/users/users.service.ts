import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer'
import { hash } from 'bcrypt';

import { UserRequestDTO } from './dto/user-request.dto';
import { UsersRepository } from './users.repository';
import { UserResponseDTO } from './dto/user-response.dto';
import { User } from 'generated/prisma';
import { UserRelateToLocationDTO } from './dto/user-relate-to-location-request.dto';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}

    async findAll(): Promise<UserResponseDTO[]> {
        const users = await this.usersRepository.findAll();

        return plainToInstance(UserResponseDTO, users, { excludeExtraneousValues: true })
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findByEmail(email);
    }

    async insert(userRequestDTO: UserRequestDTO): Promise<UserResponseDTO> {
        const hashedPassword = await hash(userRequestDTO.password, 10);

        const createdUser = await this.usersRepository.insert(
            {
                name: userRequestDTO.name,
                email: userRequestDTO.email,
                password: hashedPassword,
                roles: userRequestDTO.roles
            }
        );

        return {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            roles: createdUser.roles
        }
    }

    async relateToLocation(data: UserRelateToLocationDTO) {
        return await this.usersRepository.relateToLocation(data.userId, data.locationId)
    }
}
