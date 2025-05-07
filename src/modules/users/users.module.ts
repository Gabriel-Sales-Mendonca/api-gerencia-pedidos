import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';

// Controllers
import { UsersController } from './users.controller';

// Services
import { UsersService } from './users.service';

// Repositories
import { UsersRepository } from './users.repository';

@Module({
    imports: [DatabaseModule],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
    exports: [UsersService]
})
export class UsersModule {}
