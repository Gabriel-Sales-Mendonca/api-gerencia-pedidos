import { Injectable } from "@nestjs/common";
import { ServiceOrderRepository } from "./service-order.repository";
import { ServiceOrderRequestDTO } from "./dto/service-order-request.dto";

@Injectable()
export class ServiceOrderService {
    constructor(private serviceOrderRepository: ServiceOrderRepository) { }

    async insert(serviceOrderRequestDTO: ServiceOrderRequestDTO) {
        await this.serviceOrderRepository.insert(
            serviceOrderRequestDTO.location_id,
            serviceOrderRequestDTO.order_id,
            serviceOrderRequestDTO.product_id
        )
    }

    async findAll() {
        return await this.serviceOrderRepository.findAll()
    }

    async findGroupedOrders() {
        return await this.serviceOrderRepository.findGroupedOrders()
    }

    async findByOrderId(orderId: number) {
        return await this.serviceOrderRepository.findByOrderId(orderId)
    }
}