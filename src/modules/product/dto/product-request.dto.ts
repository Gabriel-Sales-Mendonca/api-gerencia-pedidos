import { IsNotEmpty, IsString } from "class-validator";

export class ProductRequestDTO {
    @IsString()
    @IsNotEmpty()
    id: string
}