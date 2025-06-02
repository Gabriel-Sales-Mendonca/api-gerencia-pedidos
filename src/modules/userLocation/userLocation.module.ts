import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { UserLocationController } from "./userLocation.controller";
import { UserLocationService } from "./userLocation.service";
import { UserLocationRepository } from "./userLocation.repository";
import { UsersModule } from "../users/users.module";
import { LocationModule } from "../location/location.module";

@Module({
    imports: [DatabaseModule, UsersModule, LocationModule],
    controllers: [UserLocationController],
    providers: [UserLocationService, UserLocationRepository],
    exports: [],
})
export class UserLocationModule {}