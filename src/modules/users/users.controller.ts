import { Controller, Get, Post, Body } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserRequestDTO } from './dto/user-request.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Public } from 'src/decorators/public.decorator';

interface IEmailRequest {
    email: string
}

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Roles('ADMIN')
    @Get()
    async findAll(): Promise<UserResponseDTO[]> {
        return await this.usersService.findAll();
    }

    @Get("email")
    async findByEmail(@Body() req: IEmailRequest) {
        return await this.usersService.findByEmail(req.email);
    }

    @Public()
    @Post()
    async insert(@Body() userRequestDTO: UserRequestDTO): Promise<UserResponseDTO> {
        return await this.usersService.insert(userRequestDTO);
    }
}
