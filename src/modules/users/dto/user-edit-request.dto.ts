import { IsString, IsNotEmpty, Length, IsEnum, ArrayNotEmpty } from 'class-validator';

import { UserRole } from '../../../../generated/prisma';

export class UserEditRequestDTO {
    @IsString()
    @IsNotEmpty()
    @Length(2, 50)
    name: string;

    @IsEnum(UserRole, { each: true })
    @IsNotEmpty()
    @ArrayNotEmpty()
    roles: UserRole[];
}
