import { ConflictException, Injectable } from "@nestjs/common";
import { OrderRepository } from "./order.repository";
import { OrderRequestDTO, ProductForOrderRequestDTO } from "./dto/order-request.dto";
import { ProductRepository } from "../product/product.repository";
import { LocationService } from "../location/location.service";
import { ServiceOrderService } from "../serviceOrder/service-order.service";
import { OrderDeleteRequestDTO } from "./dto/order-delete-request.dto";

@Injectable()
export class OrderService {
    constructor(
        private orderRepository: OrderRepository, 
        private productRepository: ProductRepository,
        private locationService: LocationService,
        private serviceOrderService: ServiceOrderService
    ) { }

    async insert(orderRequestDTO: OrderRequestDTO) {

        const order = await this.orderRepository.findByIdAndCompany(
            orderRequestDTO.id,
            orderRequestDTO.company_id
        )

        if (order) {
            throw new ConflictException("Pedido já cadastrado nessa empresa!")
        }

        const orderCreated = await this.orderRepository.insert({ 
                id: orderRequestDTO.id,
                company_id: orderRequestDTO.company_id,
                delivery_date: orderRequestDTO.delivery_date
            })

        for (const product of orderRequestDTO.products) {
            const productDB = await this.searchOrCreateProduct(product)

            productDB.id = productDB.id.trim()

            const locationAlmoxarifado = await this.locationService.findByName({ name: 'almoxarifado' })

            if (!locationAlmoxarifado) {
                throw new Error("Localização 'almoxarifado' não cadastrada")
            }

            await this.serviceOrderService.insert({
                location_id: locationAlmoxarifado.id,
                order_id: orderCreated.id,
                product_id: productDB.id,
                company_id: orderRequestDTO.company_id
            })
        }
    }

    async searchOrCreateProduct(product: ProductForOrderRequestDTO) {
        const productSearched = await this.productRepository.findById(product.id)

        if (productSearched) {
            return productSearched
        } else {
            return await this.productRepository.insert({ id: product.id, name: null })
        }
    }

    async findAll() {
        return await this.orderRepository.findAll()
    }

    async delete(data: OrderDeleteRequestDTO) {
        const serviceOrderIds = await this.serviceOrderService.findByOrderIdAndCompanyId(data.orderId, data.companyId)

        await this.orderRepository.delete(data.orderId, data.companyId, serviceOrderIds)
    }

}