import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer'
import { compareSync, hash } from 'bcrypt';

import { UserRequestDTO } from './dto/user-request.dto';
import { UsersRepository } from './users.repository';
import { UserResponseDTO } from './dto/user-response.dto';
import { User } from 'generated/prisma';
import { UserRelateToLocationDTO } from './dto/user-relate-to-location-request.dto';
import { UserEditRequestDTO } from './dto/user-edit-request.dto';

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

    async findById(userId: number): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new NotFoundException("Usuário não encontrado")
        }

        return user
    }

    async insert(userRequestDTO: UserRequestDTO): Promise<UserResponseDTO> {
        const hashedPassword = await hash(userRequestDTO.password, 10);

        if (userRequestDTO.roles.length == 0) {
            throw new BadRequestException('Tipo de usuário não enviado')
        }

        userRequestDTO.roles.map((role) => {
            if (role != 'ADMIN' && role != 'USER') {
                throw new BadRequestException('Tipo de usuário inválido')
            }
        })

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

    async update(userId: number, data: UserEditRequestDTO) {
        await this.findById(userId)

        return await this.usersRepository.update(userId, data)
    }

    async delete(userId: number) {
        return await this.usersRepository.delete(userId)
    }

    async updatePassword(userId: number, newPassword: string, oldPassword: string) {

        if (oldPassword == undefined) {
            throw new UnauthorizedException("Informe a senha antiga");
        }

        const user = await this.findById(userId)

        if (compareSync(oldPassword, user.password) == false) {
            throw new UnauthorizedException("Senha antiga incorreta");
        }

        const hashedPassword = await hash(newPassword, 10);

        return await this.usersRepository.updatePassword(userId, hashedPassword)
    }
}
