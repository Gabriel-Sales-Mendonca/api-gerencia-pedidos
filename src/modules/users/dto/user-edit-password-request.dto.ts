import { IsNotEmpty, IsString, Length } from "class-validator";

export class UserEditPasswordRequestDTO {
    @IsString()
    @IsNotEmpty()
    @Length(4, 100)
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    @Length(4, 100)
    oldPassword: string;
}