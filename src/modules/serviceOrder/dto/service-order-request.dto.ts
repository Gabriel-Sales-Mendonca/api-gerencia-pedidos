import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class ServiceOrderRequestDTO {
    @IsNumber()
    @IsNotEmpty()
    location_id: number

    @IsNumber()
    @IsNotEmpty()
    order_id: number

    @IsString()
    @IsNotEmpty()
    product_id: string

    @IsNumber()
    @IsNotEmpty()
    company_id: number
}