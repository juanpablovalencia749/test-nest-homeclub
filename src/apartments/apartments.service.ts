import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseConnectionsService } from '../db/db-connections.service';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { getDistanceSqlField } from '../utils/geo';
import {
  CreateApartmentDto,
  GetApartmentsNearbyDto,
  UpdateApartmentDto,
} from './dto';
import { Apartment, InsertResult } from 'src/db/interface/db-connections';

@Injectable()
export class ApartmentsService {
  constructor(private readonly databaseService: DatabaseConnectionsService) {}

  async findAllApartments() {
    try {
      const sql = 'SELECT * FROM Apartment';
      const rows = await this.databaseService.queryDB<Apartment[]>(
        sql,
        [],
        'db1',
      );
      return { data: rows };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error al obtener todos los apartamentos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllNearbyApartments(query: GetApartmentsNearbyDto) {
    const { lat, lng, minPrice, maxPrice, type, page = 1, limit = 10 } = query;
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const pageNumber = parseInt(String(page), 10);
    const limitNumber = parseInt(String(limit), 10);
    const offset = (pageNumber - 1) * limitNumber;

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      throw new HttpException(
        'Latitud y longitud inválidas',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new HttpException(
        'Parámetros de paginación inválidos',
        HttpStatus.BAD_REQUEST,
      );
    }

    const where: string[] = ['A.status = "active"'];
    const params: (string | number)[] = [];

    if (type) {
      where.push('A.apartment_type = ?');
      params.push(type);
    }

    const rateTable = type === 'tourist' ? 'TouristRate' : 'CorporateRate';
    const rateField = type === 'tourist' ? 'daily_rate' : 'monthly_rate';

    if (minPrice) {
      where.push(`CR.${rateField} >= ?`);
      params.push(minPrice);
    }

    if (maxPrice) {
      where.push(`CR.${rateField} <= ?`);
      params.push(maxPrice);
    }

    const { sql: distanceSql, params: distanceParams } = getDistanceSqlField(
      parsedLat,
      parsedLng,
    );

    const finalParams = [...distanceParams, ...params, limitNumber, offset];

    const sql = `
      SELECT
        A.id,
        A.name,
        A.latitude,
        A.longitude,
        A.apartment_type,
        CR.${rateField} AS rate,
        AE.description,
        AE.image_url,
        ${distanceSql}
      FROM Apartment A
      LEFT JOIN property_metadata.ApartmentExtra AE ON A.id = AE.apartment_id
      LEFT JOIN ${rateTable} CR ON A.id = CR.apartment_id
      WHERE ${where.join(' AND ')}
      ORDER BY distance ASC
      LIMIT ? OFFSET ?
    `;

    try {
      const rows = await this.databaseService.queryDB<Apartment[]>(
        sql,
        finalParams,
        'db1',
      );
      return { data: rows };
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Error al obtener apartamentos cercanos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async insertRateEntries(type: string, apartmentId: number) {
    try {
      const rateEntries =
        type === 'corporate'
          ? [
              { startDate: '2025-01-01', endDate: '2025-03-31', amount: 3000 },
              { startDate: '2025-04-01', endDate: '2025-12-31', amount: 4000 },
            ]
          : [
              { startDate: '2025-01-01', endDate: '2025-03-31', amount: 50 },
              { startDate: '2025-04-01', endDate: '2025-12-31', amount: 100 },
            ];

      for (const { startDate, endDate, amount } of rateEntries) {
        const table = type === 'corporate' ? 'CorporateRate' : 'TouristRate';
        const priceColumn =
          type === 'corporate' ? 'monthly_rate' : 'daily_rate';

        await this.databaseService.queryDB<ResultSetHeader>(
          `
          INSERT INTO ${table} (apartment_id, start_date, end_date, ${priceColumn})
          VALUES (?, ?, ?, ?)
          `,
          [apartmentId, startDate, endDate, amount],
          'db1',
        );
      }
    } catch {
      throw new HttpException(
        'Error al insertar tarifas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createApartment(body: CreateApartmentDto) {
    const { name, address, type, city, country, latitude, longitude, status } =
      body;

    try {
      const result = await this.databaseService.queryDB<InsertResult>(
        `
        INSERT INTO Apartment (name, address, apartment_type, city, country, latitude, longitude, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [name, address, type, city, country, latitude, longitude, status],
        'db1',
      );

      const apartmentId = result.insertId;
      await this.insertRateEntries(type, apartmentId);

      await this.databaseService.queryDB<InsertResult>(
        `
        INSERT INTO ApartmentExtra (apartment_id, description, image_url)
        VALUES (?, ?, ?)
        `,
        [apartmentId, '', ''],
        'db2',
      );

      return {
        message: 'Apartamento creado exitosamente',
        apartmentId,
      };
    } catch {
      throw new HttpException(
        'Error al crear apartamento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneApartment(id: string): Promise<Apartment> {
    try {
      const rows = await this.databaseService.queryDB<Apartment[]>(
        'SELECT * FROM Apartment WHERE id = ?',
        [id],
        'db1',
      );
      if (rows.length === 0) {
        throw new HttpException(
          'Apartamento no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }
      return rows[0];
    } catch {
      throw new HttpException(
        'Error al obtener el apartamento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateApartment(id: string, body: UpdateApartmentDto) {
    const {
      name,
      address,
      apartment_type,
      city,
      country,
      latitude,
      longitude,
      status,
    } = body;

    if (!apartment_type) {
      throw new HttpException(
        'El tipo de apartamento no puede ser nulo',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const [apartment]: Apartment[] = await this.databaseService.queryDB<
        Apartment[]
      >('SELECT apartment_type FROM Apartment WHERE id = ?', [id], 'db1');

      if (!apartment) {
        throw new HttpException(
          'Apartamento no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }
      if (apartment_type) {
        const currentApartmentType = apartment.apartment_type;

        if (currentApartmentType !== apartment_type) {
          if (currentApartmentType === 'corporate') {
            await this.databaseService.queryDB<ResultSetHeader>(
              'DELETE FROM CorporateRate WHERE apartment_id = ?',
              [id],
              'db1',
            );
          } else if (currentApartmentType === 'tourist') {
            await this.databaseService.queryDB<ResultSetHeader>(
              'DELETE FROM TouristRate WHERE apartment_id = ?',
              [id],
              'db1',
            );
          }

          await this.insertRateEntries(apartment_type, Number(id));
        }
      }

      await this.databaseService.queryDB<ResultSetHeader>(
        `UPDATE Apartment
        SET name = ?, address = ?, apartment_type = ?, city = ?, country = ?, latitude = ?, longitude = ?, status = ?
        WHERE id = ?`,
        [
          name,
          address,
          apartment_type,
          city,
          country,
          latitude,
          longitude,
          status,
          id,
        ],
        'db1',
      );

      return { message: 'Apartamento actualizado exitosamente' };
    } catch {
      throw new HttpException(
        'Error al actualizar apartamento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeApartment(id: string) {
    try {
      const [apartment] = await this.databaseService.queryDB<RowDataPacket[]>(
        'SELECT apartment_type FROM Apartment WHERE id = ?',
        [id],
        'db1',
      );

      if (!apartment) {
        throw new HttpException(
          'Apartamento no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      const { apartment_type } = apartment;

      if (apartment_type === 'corporate') {
        await this.databaseService.queryDB<ResultSetHeader>(
          'DELETE FROM CorporateRate WHERE apartment_id = ?',
          [id],
          'db1',
        );
      } else if (apartment_type === 'tourist') {
        await this.databaseService.queryDB<ResultSetHeader>(
          'DELETE FROM TouristRate WHERE apartment_id = ?',
          [id],
          'db1',
        );
      }
      await this.databaseService.queryDB<ResultSetHeader>(
        'DELETE FROM ApartmentExtra WHERE apartment_id = ?',
        [id],
        'db2',
      );

      await this.databaseService.queryDB<ResultSetHeader>(
        'DELETE FROM Apartment WHERE id = ?',
        [id],
        'db1',
      );

      return {
        message: 'Apartamento eliminado exitosamente',
      };
    } catch {
      throw new HttpException(
        'Error al eliminar apartamento',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
