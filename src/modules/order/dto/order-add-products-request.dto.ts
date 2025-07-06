import { IsNotEmpty, IsNumber } from "class-validator"
import { ProductForOrderRequestDTO } from "./product-for-order-request.dto"

export class orderAddProductsRequestDTO {

    @IsNotEmpty()
    products: ProductForOrderRequestDTO[]

    @IsNumber()
    @IsNotEmpty()
    company_id: number
}