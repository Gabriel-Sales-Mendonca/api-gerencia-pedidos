import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete, Req, Query } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserRequestDTO } from './dto/user-request.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserEditRequestDTO } from './dto/user-edit-request.dto';
import { UserEditPasswordRequestDTO } from './dto/user-edit-password-request.dto';
import { AuthenticatedRequest } from '../../interfaces/authenticated-request.interface'
import { UserFindAllResponseDTO } from './dto/user-find-all-response.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Roles('ADMIN', 'USER')
    @Get()
    async findAll(@Query() pagination: PaginationDTO): Promise<UserFindAllResponseDTO> {
        return await this.usersService.findAll(pagination);
    }

    @Get('/all')
    async findAllWithoutPagination() {
        return await this.usersService.findAllWithoutPagination()
    }

    @Get("email")
    async findByEmail(@Body() req: { email: string }) {
        return await this.usersService.findByEmail(req.email);
    }

    @Roles('ADMIN')
    @Post()
    async insert(@Body() userRequestDTO: UserRequestDTO): Promise<UserResponseDTO> {
        return await this.usersService.insert(userRequestDTO);
    }

    @Roles('ADMIN')
    @Patch("/:id")
    async update(
        @Param('id', ParseIntPipe) userId: number,
        @Body() userEditRequestDTO: UserEditRequestDTO
    ) {
        return await this.usersService.update(userId, userEditRequestDTO)
    }

    @Roles('ADMIN')
    @Delete("/:id")
    async delete(
        @Param('id', ParseIntPipe) userId: number,
    ) {
        return await this.usersService.delete(userId)
    }

    @Roles('ADMIN', 'USER')
    @Patch("/update-password/:id")
    async updatePassword(
        @Param('id', ParseIntPipe) userId: number,
        @Body() userEditPasswordRequestDTO: UserEditPasswordRequestDTO,
        @Req() request: AuthenticatedRequest
    ) {
        await this.usersService.updatePassword(
            request.user,
            userId,
            userEditPasswordRequestDTO.newPassword,
            userEditPasswordRequestDTO.oldPassword
        )
    }

}
