import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'mysql2';
import * as mysql from 'mysql2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConnectionsService
  implements OnModuleInit, OnModuleDestroy
{
  private db1Connection: Pool;
  private db2Connection: Pool;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await Promise.resolve();

    this.db1Connection = mysql.createPool({
      host: this.configService.get<string>('DB_HOST'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASS'),
      database: this.configService.get<string>('DB1_NAME'),
    });

    this.db2Connection = mysql.createPool({
      host: this.configService.get<string>('DB_HOST'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASS'),
      database: this.configService.get<string>('DB2_NAME'),
    });
  }

  onModuleDestroy() {
    this.db1Connection.end();
    this.db2Connection.end();
  }

  queryDB<T extends mysql.RowDataPacket[] | mysql.ResultSetHeader>(
    query: string,
    params: any[],
    dbConnection: 'db1' | 'db2',
  ): Promise<T> {
    const connection =
      dbConnection === 'db1' ? this.db1Connection : this.db2Connection;

    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, rows) => {
        if (err) {
          reject(new Error(`Database query failed: ${err.message}`));
        } else {
          resolve(rows as T);
        }
      });
    });
  }
}
