import { IsArray, IsInt, IsNotEmpty, IsString } from "class-validator";

export class ProductForOrderRequestDTO {
    @IsString()
    @IsNotEmpty()
    id: string
}

export class OrderRequestDTO {
    @IsInt()
    @IsNotEmpty()
    id: number

    @IsArray()
    products: ProductForOrderRequestDTO[]

    @IsInt()
    company_id: number

    delivery_date?: Date
}