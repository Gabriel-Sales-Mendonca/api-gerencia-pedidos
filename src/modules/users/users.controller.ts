import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserRequestDTO } from './dto/user-request.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserEditRequestDTO } from './dto/user-edit-request.dto';
import { UserEditPasswordRequestDTO } from './dto/user-edit-password-request.dto';

interface IEmailRequest {
    email: string
}

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Roles('ADMIN', 'USER')
    @Get()
    async findAll(): Promise<UserResponseDTO[]> {
        return await this.usersService.findAll();
    }

    @Get("email")
    async findByEmail(@Body() req: IEmailRequest) {
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

    @Roles('ADMIN')
    @Patch("/update-password/:id")
    async updatePassword(
        @Param('id', ParseIntPipe) userId: number,
        @Body() userEditPasswordRequestDTO: UserEditPasswordRequestDTO
    ) {
        return await this.usersService.updatePassword(
            userId,
            userEditPasswordRequestDTO.newPassword,
            userEditPasswordRequestDTO.oldPassword
        )
    }

    @Roles('ADMIN')
    @Patch("/edit-location/:id")
    async relateToLocation(
        @Param('id', ParseIntPipe) userId: number,
        @Body('locationId') locationId: number
    ) {
        return await this.usersService.relateToLocation({ userId: userId, locationId: locationId })
    }
}
