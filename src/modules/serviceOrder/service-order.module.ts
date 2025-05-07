import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ServiceOrderController } from './service-order.controller';
import { ServiceOrderService } from './service-order.service';
import { ServiceOrderRepository } from './service-order.repository';

@Module({
    imports: [DatabaseModule],
    controllers: [ServiceOrderController],
    providers: [ServiceOrderService, ServiceOrderRepository],
    exports: []
})
export class ServiceOrderModule { }
