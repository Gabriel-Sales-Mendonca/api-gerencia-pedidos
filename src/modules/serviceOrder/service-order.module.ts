import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ServiceOrderController } from './service-order.controller';
import { ServiceOrderService } from './service-order.service';
import { ServiceOrderRepository } from './service-order.repository';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [DatabaseModule, UsersModule],
    controllers: [ServiceOrderController],
    providers: [ServiceOrderService, ServiceOrderRepository],
    exports: [ServiceOrderService]
})
export class ServiceOrderModule { }
