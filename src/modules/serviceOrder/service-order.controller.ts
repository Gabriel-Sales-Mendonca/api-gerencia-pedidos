/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Request } from "@nestjs/common";
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
        @Request() req
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return await this.serviceOrderService.updateLocation(req.user.sub, serviceOrderId)
    }

    @Patch('/update-destination/:id')
    async updateDestination(
        @Param('id', ParseIntPipe) serviceOrderId: number,
        @Query('location_id', ParseIntPipe) location_id: number,
        @Request() req
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return await this.serviceOrderService.updateDestination(req.user.sub, serviceOrderId, location_id)
    }

}