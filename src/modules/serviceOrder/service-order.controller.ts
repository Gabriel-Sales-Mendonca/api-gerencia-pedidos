import { Controller, Post } from "@nestjs/common";
import { ServiceOrderService } from "./service-order.service";

@Controller('service-orders')
export class ServiceOrderController {
    constructor(private serviceOrderService: ServiceOrderService) { }

    @Post()
    async insert() {

    }

}