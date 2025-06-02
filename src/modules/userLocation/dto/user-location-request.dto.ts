import { IsInt, IsNotEmpty } from "class-validator"

export class UserLocationRequestDTO {
    @IsInt()
    @IsNotEmpty()
    userId: number

    @IsInt()
    @IsNotEmpty()
    locationId: number
}