import { Injectable } from "@nestjs/common";
import { ServiceOrder } from "generated/prisma";
import { PrismaService } from "src/database/prisma/prisma.service";

@Injectable()
export class ServiceOrderRepository {
  constructor(private prisma: PrismaService) { }

  async insert(location_id: number, order_id: number, product_id: string, company_id: number): Promise<ServiceOrder> {
    return await this.prisma.serviceOrder.create({
      data: {
        location_id: location_id,
        order_id: order_id,
        product_id: product_id,
        company_id: company_id
      }
    })
  }

  async findById(seviceOrderId: number) {
    return await this.prisma.serviceOrder.findUnique({
      where: { id: seviceOrderId }
    })
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit; // 🧮 Cálculo do início da página

    const grouped = await this.prisma.serviceOrder.groupBy({
      by: ['order_id', 'company_id'],
      _count: {
        product_id: true
      }
    });

    const total = grouped.length; // 📊 Total de grupos antes da paginação

    const paginatedGrouped = grouped.slice(skip, skip + limit); // 🧾 Paginação manual (slice)

    const orderKeys = paginatedGrouped.map(item => ({
      id: item.order_id,
      company_id: item.company_id,
    }));

    const companyIds = [...new Set(orderKeys.map(item => item.company_id))];

    const companies = await this.prisma.company.findMany({
      where: { id: { in: companyIds } },
      select: { id: true, name: true }
    });

    const companyMap = new Map(companies.map(c => [c.id, c.name]));

    const orders = await this.prisma.order.findMany({
      where: {
        OR: orderKeys
      },
      select: {
        id: true,
        company_id: true,
        delivery_date: true
      }
    });

    const deliveryMap = new Map(
      orders.map(o => [`${o.id}-${o.company_id}`, o.delivery_date])
    );

    const data = paginatedGrouped.map(item => {
      const deliveryDate = deliveryMap.get(`${item.order_id}-${item.company_id}`);

      return {
        order_id: item.order_id,
        company_id: item.company_id,
        company_name: companyMap.get(item.company_id),
        delivery_date: deliveryDate
          ? new Intl.DateTimeFormat('pt-BR').format(new Date(deliveryDate))
          : null,
        qtd_product: item._count.product_id
      };
    });

    return {
      data, // 🔁 Os dados paginados
      total, // 📊 Total de registros
      page,
      lastPage: Math.ceil(total / limit)
    };
  }


  async findDetailsByOrderAndCompany(orderId: number, companyId: number) {
    return await this.prisma.serviceOrder.findMany({
      where: {
        order_id: Number(orderId),
        company_id: Number(companyId)
      },
      include: {
        location: true,
        destinationLocation: true
      },
      orderBy: {
        product_id: "asc"
      }
    })
  }

  async updateLocation(serviceOrderId: number, locationId: number) {
    return await this.prisma.serviceOrder.update({
      where: { id: serviceOrderId },
      data: {
        location_id: locationId,
        destination_id: null,
        location_start_date: new Date()
      }
    })
  }

  async updateDestination(serviceOrderId: number, locationId: number) {
    return await this.prisma.serviceOrder.update({
      where: { id: serviceOrderId },
      data: { destination_id: locationId }
    })
  }

  async fetchUserLocations(userId: number) {
    return await this.prisma.userLocation.findMany({
      where: { user_id: userId },
      select: { location_id: true }
    })
  }

  async updateLocationDeliveryDate(serviceOrderId: number, locationDeliveryDate: Date) {
    return await this.prisma.serviceOrder.update({
      where: {
        id: serviceOrderId
      },
      data: {
        location_delivery_date: locationDeliveryDate
      }
    })
  }

}