import { IsInt, IsNotEmpty } from "class-validator"

export class UserRelateToLocationDTO {
    @IsInt()
    @IsNotEmpty()
    userId: number

    @IsInt()
    @IsNotEmpty()
    locationId: number
}