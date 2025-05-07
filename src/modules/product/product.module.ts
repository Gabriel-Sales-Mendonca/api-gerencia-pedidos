import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';

@Module({
    imports: [DatabaseModule],
    controllers: [ProductController],
    providers: [ProductService, ProductRepository],
    exports: []
})
export class ProductModule { }
