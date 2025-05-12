import { Injectable, NotFoundException } from "@nestjs/common";
import { ServiceOrderRepository } from "./service-order.repository";
import { ServiceOrderRequestDTO } from "./dto/service-order-request.dto";

@Injectable()
export class ServiceOrderService {
    constructor(private serviceOrderRepository: ServiceOrderRepository) { }

    async insert(serviceOrderRequestDTO: ServiceOrderRequestDTO) {
        await this.serviceOrderRepository.insert(
            serviceOrderRequestDTO.location_id,
            serviceOrderRequestDTO.order_id,
            serviceOrderRequestDTO.product_id,
            serviceOrderRequestDTO.company_id
        )
    }

    async findAll() {
        return await this.serviceOrderRepository.findAll()
    }

    async findDetailsByOrderAndCompany(orderId: number, companyId: number) {
        return await this.serviceOrderRepository.findDetailsByOrderAndCompany(orderId, companyId)
    }

    async updateLocation(serviceOrderId: number, locationId: number) {
        const serviceOrder = await this.serviceOrderRepository.findById(serviceOrderId)

        if (serviceOrder == null) {
            throw new NotFoundException("Ordem de serviço não encontrada, id: " + serviceOrderId)
        }

        return await this.serviceOrderRepository.updateLocation(serviceOrderId, locationId)
    }

    async updateDestination(serviceOrderId: number, locationId: number) {
        const serviceOrder = await this.serviceOrderRepository.findById(serviceOrderId)

        if (serviceOrder == null) {
            throw new NotFoundException("Ordem de serviço não encontrada, id: " + serviceOrderId)
        }

        return await this.serviceOrderRepository.updateDestination(serviceOrderId, locationId)
    }

}