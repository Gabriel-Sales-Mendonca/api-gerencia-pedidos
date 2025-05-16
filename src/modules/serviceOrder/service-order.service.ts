import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ServiceOrderRepository } from "./service-order.repository";
import { ServiceOrderRequestDTO } from "./dto/service-order-request.dto";
import { UsersService } from "../users/users.service";

@Injectable()
export class ServiceOrderService {
    constructor(private serviceOrderRepository: ServiceOrderRepository, private userService: UsersService) { }

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

    async updateLocation(userEmail: string, serviceOrderId: number) {
        const serviceOrder = await this.serviceOrderRepository.findById(serviceOrderId)

        if (serviceOrder == null) {
            throw new NotFoundException("Ordem de serviço não encontrada, id: " + serviceOrderId)
        }

        if (serviceOrder.destination_id == null) {
            throw new BadRequestException("A localização não pode ser atualizada pois é necessário informar o destino anteriormente")
        }

        const user = await this.userService.findByEmail(userEmail)
        if (!user) throw new NotFoundException("Usuário não encontrado!")

        await this.fetchUserLocations(user.id, serviceOrder.destination_id)

        return await this.serviceOrderRepository.updateLocation(serviceOrderId, serviceOrder.destination_id)
    }

    async updateDestination(userEmail: string, serviceOrderId: number, locationId: number) {
        const serviceOrder = await this.serviceOrderRepository.findById(serviceOrderId)

        if (serviceOrder == null) {
            throw new NotFoundException("Ordem de serviço não encontrada, id: " + serviceOrderId)
        }

        const user = await this.userService.findByEmail(userEmail)
        if (!user) throw new NotFoundException("Usuário não encontrado!")

        await this.fetchUserLocations(user.id, locationId)

        return await this.serviceOrderRepository.updateDestination(serviceOrderId, locationId)
    }

    async fetchUserLocations(userId: number, locationId: number) {
        const locations = await this.serviceOrderRepository.fetchUserLocations(userId)

        const hasAccess= locations.some(location => location.location_id == locationId)
        if (!hasAccess) throw new ForbiddenException("Usuário não tem acesso à localização do destino.")
    }

}