import { IsNotEmpty, IsString } from "class-validator";

export class ProductForOrderRequestDTO {
    @IsString()
    @IsNotEmpty()
    id: string
}