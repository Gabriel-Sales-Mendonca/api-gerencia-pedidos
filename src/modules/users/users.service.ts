import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { compareSync, hash } from 'bcrypt';

import { UserRequestDTO } from './dto/user-request.dto';
import { UsersRepository } from './users.repository';
import { UserResponseDTO } from './dto/user-response.dto';
import { User } from 'generated/prisma';
import { UserEditRequestDTO } from './dto/user-edit-request.dto';
import { JwtPayload } from 'src/interfaces/authenticated-request.interface';
import { UserFindAllResponseDTO } from './dto/user-find-all-response.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) { }

    async findAll(pagination: PaginationDTO): Promise<UserFindAllResponseDTO> {

        const page = pagination.page ?? 1;
        const limit = pagination.limit ?? 10;

        return await this.usersRepository.findAll(page, limit);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.usersRepository.findByEmail(email.trim());
    }

    async findById(userId: number): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new NotFoundException("Usuário não encontrado")
        }

        return user
    }

    async insert(userRequestDTO: UserRequestDTO): Promise<UserResponseDTO> {
        const hashedPassword = await hash(userRequestDTO.password.trim(), 10);

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
                name: userRequestDTO.name.trim(),
                email: userRequestDTO.email.trim(),
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

    async update(userId: number, data: UserEditRequestDTO) {
        await this.findById(userId)

        data.name = data.name.trim()

        return await this.usersRepository.update(userId, data)
    }

    async delete(userId: number) {
        return await this.usersRepository.delete(userId)
    }

    async updatePassword(payload: JwtPayload, userId: number, newPassword: string, oldPassword: string | undefined) {

        const hashedPassword = await hash(newPassword.trim(), 10);

        if (!payload.roles.includes('ADMIN')) {

            if (oldPassword == undefined) {
                throw new UnauthorizedException("Informe a senha antiga");
            }

            oldPassword = oldPassword.trim()
            
            const payloadUserId = parseInt(payload.sub)

            if (payloadUserId !== userId) {
                throw new UnauthorizedException("Somente um ADMIN pode atualizar a senha de outro usuário")
            }

            const payloadUser = await this.findById(payloadUserId)

            if (compareSync(oldPassword, payloadUser.password) == false) {
                throw new UnauthorizedException("Senha antiga incorreta");
            }

            await this.usersRepository.updatePassword(payloadUser.id, hashedPassword)

        }

        await this.findById(userId)

        await this.usersRepository.updatePassword(userId, hashedPassword)
    }

}
