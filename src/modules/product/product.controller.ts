import { Controller, Post } from "@nestjs/common";
import { ProductService } from "./product.service";

@Controller('orders')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Post()
    async insert() {

    }

}