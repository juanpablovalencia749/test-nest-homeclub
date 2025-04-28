import { Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ConfigModule } from '@nestjs/config';
import { ApartmentsModule } from './apartments/apartments.module';
import { ApartmentsExtraModule } from './apartments-extra/apartments-extra.module';
import { DatabaseConnectionsModule } from './db/db-connections.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ApartmentsExtraModule,
    ApartmentsModule,
  ],
  controllers: [],
  providers: [DatabaseConnectionsModule],
})
export class AppModule {}

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.listen(3001);
  } catch (error) {
    console.error('Error al iniciar la aplicación:', error);
  }
}
void bootstrap();
