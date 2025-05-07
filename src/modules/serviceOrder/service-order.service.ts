import { Injectable } from "@nestjs/common";
import { ServiceOrderRepository } from "./service-order.repository";

@Injectable()
export class ServiceOrderService {
    constructor(private serviceOrderRepository: ServiceOrderRepository) { }

}