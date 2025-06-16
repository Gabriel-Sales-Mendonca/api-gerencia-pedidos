import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ServiceOrderRepository } from "./service-order.repository";
import { ServiceOrderRequestDTO } from "./dto/service-order-request.dto";
import { UsersService } from "../users/users.service";
import { PaginationDTO } from "src/common/dto/pagination.dto";

@Injectable()
export class ServiceOrderService {
    constructor(private serviceOrderRepository: ServiceOrderRepository, private userService: UsersService) { }

    async insert(serviceOrderRequestDTO: ServiceOrderRequestDTO) {
        await this.serviceOrderRepository.insert(
            serviceOrderRequestDTO.location_id,
            serviceOrderRequestDTO.order_id,
            serviceOrderRequestDTO.product_id.trim(),
            serviceOrderRequestDTO.company_id
        )
    }

    async findAll(pagination: PaginationDTO) {

        const page = pagination.page ?? 1;
        const limit = pagination.limit ?? 10;
        
        return await this.serviceOrderRepository.findAll(page, limit)
    }

    async findDetailsByOrderAndCompany(orderId: number, companyId: number) {
        return await this.serviceOrderRepository.findDetailsByOrderAndCompany(orderId, companyId)
    }

    async findByOrderIdAndCompanyId(orderId: number, companyId: number): Promise<number[]> {
        const serviceOrdersIdsObject = await this.serviceOrderRepository.findByOrderIdAndCompanyId(orderId, companyId)

        const serviceOrderIdsArray: number[] = []

        for (const object of serviceOrdersIdsObject) {
            serviceOrderIdsArray.push(object.id)
        }

        return serviceOrderIdsArray
    }

    async findByOrderId(orderId: number) {
        return await this.serviceOrderRepository.findByOrderId(orderId)
    }

    async updateLocation(userId: number, serviceOrderId: number) {
        const serviceOrder = await this.serviceOrderRepository.findById(serviceOrderId)

        if (serviceOrder == null) {
            throw new NotFoundException("Ordem de serviço não encontrada, id: " + serviceOrderId)
        }

        if (serviceOrder.destination_id == null) {
            throw new BadRequestException("A localização não pode ser atualizada pois é necessário informar o destino anteriormente")
        }

        const user = await this.userService.findById(userId)
        if (!user) throw new NotFoundException("Usuário não encontrado!")

        await this.fetchUserLocations(user.id, serviceOrder.destination_id)

        return await this.serviceOrderRepository.updateLocation(serviceOrderId, serviceOrder.destination_id)
    }

    async updateDestination(userId: number, serviceOrderId: number, locationId: number) {
        const serviceOrder = await this.serviceOrderRepository.findById(serviceOrderId)

        if (serviceOrder == null) {
            throw new NotFoundException("Ordem de serviço não encontrada, id: " + serviceOrderId)
        }

        const user = await this.userService.findById(userId)
        if (!user) throw new NotFoundException("Usuário não encontrado!")

        await this.fetchUserLocations(user.id, serviceOrder.location_id)

        return await this.serviceOrderRepository.updateDestination(serviceOrderId, locationId)
    }

    async fetchUserLocations(userId: number, locationId: number) {
        const locations = await this.serviceOrderRepository.fetchUserLocations(userId)

        const hasAccess= locations.some(location => location.location_id == locationId)
        if (!hasAccess) throw new ForbiddenException("Usuário não tem acesso à essa localização.")
    }

    async updateLocationDeliveryDate(serviceOrderId: number, locationDeliveryDate: Date) {
        return await this.serviceOrderRepository.updateLocationDeliveryDate(serviceOrderId, locationDeliveryDate)
    }

}