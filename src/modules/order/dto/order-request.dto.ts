import { IsArray, IsInt, IsNotEmpty } from "class-validator";
import { ProductForOrderRequestDTO } from "./product-for-order-request.dto";


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