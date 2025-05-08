import { Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ServiceOrderService } from "./service-order.service";

@Controller('service-orders')
export class ServiceOrderController {
    constructor(private serviceOrderService: ServiceOrderService) { }

    @Post()
    async insert() {

    }

    
    async findAll() {
        return await this.serviceOrderService.findAll()
    }

    @Get()
    async findGroupedOrders() {
        return await this.serviceOrderService.findGroupedOrders()
    }

    @Get('by-order/:order_id')
    async findByOrderId(@Param('order_id', ParseIntPipe) orderId: number) {
        return this.serviceOrderService.findByOrderId(orderId)
    }

}