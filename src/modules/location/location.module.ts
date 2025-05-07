import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { LocationRepository } from './location.repository';

@Module({
    imports: [DatabaseModule],
    controllers: [LocationController],
    providers: [LocationService, LocationRepository],
    exports: [LocationService]
})
export class LocationModule {}
