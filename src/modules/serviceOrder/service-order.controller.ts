import { Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { ServiceOrderService } from "./service-order.service";

@Controller('service-orders')
export class ServiceOrderController {
    constructor(private serviceOrderService: ServiceOrderService) { }

    @Post()
    async insert() {

    }

    @Get()
    async findAll() {
        return await this.serviceOrderService.findAll()
    }

    @Get('/by-order/:id')
    async findDetailsByOrderAndCompany(
        @Param('id') orderId: number,
        @Query('company_id') companyId: number
    ) {
        return await this.serviceOrderService.findDetailsByOrderAndCompany(orderId, companyId)
    }

    @Patch('/update-location/:id')
    async updateLocation(
        @Param('id', ParseIntPipe) serviceOrderId: number,
        @Query('location_id', ParseIntPipe) locationId: number
    ) {
        return await this.serviceOrderService.updateLocation(serviceOrderId, locationId)
    }

}