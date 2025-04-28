import { Module } from '@nestjs/common';
import { ApartmentsExtraService } from './apartments-extra.service';
import { ApartmentsExtraController } from './apartments-extra.controller';
import { DatabaseConnectionsService } from 'src/db/db-connections.service';

@Module({
  controllers: [ApartmentsExtraController],
  providers: [ApartmentsExtraService, DatabaseConnectionsService],
})
export class ApartmentsExtraModule {}
