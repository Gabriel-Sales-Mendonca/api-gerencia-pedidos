import { Module } from '@nestjs/common';

// Módulos
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { LocationModule } from './modules/location/location.module';

// Controllers
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';

@Module({
    imports: [UsersModule, AuthModule, LocationModule],
    controllers: [AppController],
    providers: [AppService],
    exports: [],
})
export class AppModule { }
