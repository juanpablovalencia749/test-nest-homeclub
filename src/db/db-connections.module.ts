import { Module } from '@nestjs/common';
import { DatabaseConnectionsService } from './db-connections.service';

@Module({
  providers: [DatabaseConnectionsService],
  exports: [DatabaseConnectionsService],
})
export class DatabaseConnectionsModule {}
