import { Body, Controller, Delete, Get, ParseIntPipe, Post, Query } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderRequestDTO } from "./dto/order-request.dto";

@Controller('orders')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @Post()
    async insert(@Body() orderRequestDTO: OrderRequestDTO) {
        await this.orderService.insert(orderRequestDTO);
    }

    @Get()
    async findAll() {
        return await this.orderService.findAll()
    }

    @Delete()
    async delete(
        @Query('orderId', ParseIntPipe) orderId: number,
        @Query('companyId', ParseIntPipe) companyId: number
    ) {
        await this.orderService.delete({ orderId, companyId })
    }

}