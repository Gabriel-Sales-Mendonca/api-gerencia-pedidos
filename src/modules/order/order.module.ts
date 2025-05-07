import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';
import { ProductModule } from '../product/product.module';
import { LocationModule } from '../location/location.module';
import { ServiceOrderModule } from '../serviceOrder/service-order.module';

@Module({
    imports: [DatabaseModule, ProductModule, LocationModule, ServiceOrderModule],
    controllers: [OrderController],
    providers: [OrderService, OrderRepository],
    exports: []
})
export class OrderModule { }
