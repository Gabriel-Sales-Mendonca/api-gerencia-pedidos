import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    const allowedOrigin = "https://frontend-gerencia-pedidos.vercel.app";
    console.log("🌍 Origin habilitado para CORS:", allowedOrigin);

    app.enableCors({
        origin: allowedOrigin,
        credentials: true
    });


    app.useGlobalPipes(
        new ValidationPipe({
            transform: true
        })
    )

    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
