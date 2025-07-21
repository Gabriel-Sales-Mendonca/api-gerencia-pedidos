import { Injectable } from "@nestjs/common";
import { Prisma, ServiceOrder } from "generated/prisma";
import { PrismaService } from "src/database/prisma/prisma.service";
import { ServiceOrderRequestDTO } from "./dto/service-order-request.dto";

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

  async insertMany(objects: ServiceOrderRequestDTO[]) {
    return await this.prisma.serviceOrder.createManyAndReturn({
      data: objects
    })
  }

  async findById(seviceOrderId: number) {
    return await this.prisma.serviceOrder.findUnique({
      where: { id: seviceOrderId }
    })
  }

  async findAll(
    page: number,
    limit: number,
    sortBy: 'delivery_date' | 'company_name' | 'qtd_product' = 'delivery_date',
    sortDirection: 'asc' | 'desc' = 'asc'
  ) {
    const skip = (page - 1) * limit;

    // 1. Group by (sem ordenação ainda)
    const grouped = await this.prisma.serviceOrder.groupBy({
      by: ['order_id', 'company_id'],
      _count: {
        product_id: true
      }
    });

    const total = grouped.length;

    const orderKeys = grouped.map(item => ({
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

    // 2. Juntar dados em um array completo
    const combined = grouped.map(item => {
      const deliveryDate = deliveryMap.get(`${item.order_id}-${item.company_id}`);
      const companyName = companyMap.get(item.company_id);

      return {
        order_id: item.order_id,
        company_id: item.company_id,
        company_name: companyName || '',
        delivery_date: deliveryDate ? new Date(deliveryDate) : null,
        qtd_product: item._count.product_id
      };
    });

    // 3. Ordenação dinâmica
    const sorted = combined.sort((a, b) => {
      let aValue: string | number | Date | null;
      let bValue: string | number | Date | null;

      if (sortBy === 'delivery_date') {
        aValue = a.delivery_date;
        bValue = b.delivery_date;
        const aTime = aValue ? new Date(aValue).getTime() : 0;
        const bTime = bValue ? new Date(bValue).getTime() : 0;
        return sortDirection === 'asc' ? aTime - bTime : bTime - aTime;
      }

      if (sortBy === 'company_name') {
        aValue = a.company_name || '';
        bValue = b.company_name || '';
        return sortDirection === 'asc'
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      }

      if (sortBy === 'qtd_product') {
        aValue = a.qtd_product;
        bValue = b.qtd_product;
        return sortDirection === 'asc'
          ? (aValue) - (bValue)
          : (bValue) - (aValue);
      }

      return 0;
    });


    // 4. Paginação
    const paginated = sorted.slice(skip, skip + limit);

    // 5. Formatação final
    const data = paginated.map(item => ({
      order_id: item.order_id,
      company_id: item.company_id,
      company_name: item.company_name,
      delivery_date: item.delivery_date
        ? new Intl.DateTimeFormat('pt-BR').format(item.delivery_date)
        : null,
      qtd_product: item.qtd_product
    }));

    return {
      data,
      total,
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

  async findByOrderIdAndCompanyId(orderId: number, companyId: number) {
    return await this.prisma.serviceOrder.findMany({
      where: {
        order_id: orderId,
        company_id: companyId
      },
      select: {
        id: true
      }
    })
  }

  async findByOrderIdAndCompanyIdToFinalize(orderId: number, companyId: number) {
    return await this.prisma.serviceOrder.findMany({
      where: {
        order_id: orderId,
        company_id: companyId
      },
      select: {
        finished: true
      }
    })
  }

  async findByOrderId(orderId: number) {
    // 1. Agrupar por order_id + company_id
    const grouped = await this.prisma.serviceOrder.groupBy({
      by: ['order_id', 'company_id'],
      where: {
        order_id: orderId
      },
      _count: {
        product_id: true
      }
    });

    if (grouped.length === 0) {
      return [];
    }

    // 2. Mapas auxiliares
    const companyIds = [...new Set(grouped.map(item => item.company_id))];

    const companies = await this.prisma.company.findMany({
      where: { id: { in: companyIds } },
      select: { id: true, name: true }
    });

    const companyMap = new Map(companies.map(c => [c.id, c.name]));

    const orders = await this.prisma.order.findMany({
      where: {
        id: orderId,
        company_id: { in: companyIds }
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

    // 3. Combinar os dados
    return grouped.map(item => {
      const deliveryDate = deliveryMap.get(`${item.order_id}-${item.company_id}`);
      const companyName = companyMap.get(item.company_id);

      return {
        order_id: item.order_id,
        company_id: item.company_id,
        company_name: companyName || '',
        delivery_date: deliveryDate
          ? new Intl.DateTimeFormat('pt-BR').format(new Date(deliveryDate))
          : null,
        qtd_product: item._count.product_id
      };
    });
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

  async delete(serviceOrderId: number) {
    await this.prisma.serviceOrder.delete({
      where: {
        id: serviceOrderId
      }
    })
  }

  async deleteManyWithTx(serviceOrderIds: number[], tx: Prisma.TransactionClient) {
    await tx.serviceOrder.deleteMany({
      where: {
        id: { in: serviceOrderIds }
      }
    })
  }

  async finish(serviceOrderId: number) {
    return await this.prisma.serviceOrder.update({
      where: { id: serviceOrderId },
      data: {
        finished: true
      }
    })
  }

}