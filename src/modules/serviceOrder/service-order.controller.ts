/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, Request } from "@nestjs/common";
import { ServiceOrderService } from "./service-order.service";
import { PaginationDTO } from "src/common/dto/pagination.dto";

@Controller('service-orders')
export class ServiceOrderController {
    constructor(private serviceOrderService: ServiceOrderService) { }

    @Post()
    async insert() {

    }

    @Get()
    async findAll(@Query() pagination: PaginationDTO) {
        return await this.serviceOrderService.findAll(pagination)
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
        return await this.serviceOrderService.updateLocation(Number(req.user.sub), serviceOrderId)
    }

    @Patch('/update-destination/:id')
    async updateDestination(
        @Param('id', ParseIntPipe) serviceOrderId: number,
        @Query('location_id', ParseIntPipe) location_id: number,
        @Request() req
    ) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return await this.serviceOrderService.updateDestination(Number(req.user.sub), serviceOrderId, location_id)
    }

    @Patch('/update-location-delivery-date/:id')
    async updateLocationDeliveryDate(
        @Param('id', ParseIntPipe) serviceOrderId: number,
        @Body('locationDeliveryDate') dateString: string
    ) {
        const locationDeliveryDate = new Date(dateString)

        if (isNaN(locationDeliveryDate.getTime())) {
            throw new BadRequestException('Invalid date format');
        }

        return await this.serviceOrderService.updateLocationDeliveryDate(serviceOrderId, locationDeliveryDate)
    }
}