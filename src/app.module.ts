import { Module } from '@nestjs/common';

// Módulos
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { LocationModule } from './modules/location/location.module';
import { ServiceOrderModule } from './modules/serviceOrder/service-order.module';
import { OrderModule } from './modules/order/order.module';
import { ProductModule } from './modules/product/product.module';

// Controllers
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';

@Module({
    imports: [UsersModule, AuthModule, LocationModule, ServiceOrderModule, OrderModule, ProductModule],
    controllers: [AppController],
    providers: [AppService],
    exports: [],
})
export class AppModule { }
