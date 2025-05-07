import { Body, Controller, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderRequestDTO } from "./dto/order-request.dto";

@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Post()
    async insert(@Body() orderRequestDTO: OrderRequestDTO) {
        await this.orderService.insert(orderRequestDTO);
    }

}