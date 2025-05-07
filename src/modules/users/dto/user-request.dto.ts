import { IsString, IsEmail, IsNotEmpty, Length, IsEnum } from 'class-validator';

import { UserRole } from '../../../../generated/prisma';

export class UserRequestDTO {
    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(4, 100)
    password: string;

    @IsEnum(UserRole, { each: true })
    @IsNotEmpty()
    roles: UserRole[];
}
