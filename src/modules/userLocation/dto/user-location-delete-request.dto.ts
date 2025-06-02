import { IsInt, IsNotEmpty } from "class-validator"

export class UserLocationDeleteRequestDTO {
    @IsInt()
    @IsNotEmpty()
    userId: number

    @IsInt()
    @IsNotEmpty()
    locationId: number
}