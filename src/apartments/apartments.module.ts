import { Module } from '@nestjs/common';
import { ApartmentsController } from './apartments.controller';
import { ApartmentsService } from './apartments.service';
import { DatabaseConnectionsService } from 'src/db/db-connections.service';

@Module({
  controllers: [ApartmentsController],
  providers: [ApartmentsService, DatabaseConnectionsService],
})
export class ApartmentsModule {}
