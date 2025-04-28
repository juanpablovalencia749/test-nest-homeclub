import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DatabaseConnectionsService } from '../db/db-connections.service';
import { ResultSetHeader } from 'mysql2/promise';
import { CreateApartmentsExtraDto, UpdateApartmentsExtraDto } from './dto';
import { ApartmentExtra, InsertResult } from 'src/db/interface/db-connections';

@Injectable()
export class ApartmentsExtraService {
  constructor(private readonly databaseService: DatabaseConnectionsService) {}

  async createApartmentExtra(body: CreateApartmentsExtraDto) {
    const { description, image_url } = body;

    try {
      const apartmentResult = await this.databaseService.queryDB<InsertResult>(
        `
        INSERT INTO Apartment (name, address, apartment_type, city, country, latitude, longitude, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        ['', '', 'corporate', '', '', null, null, 'active'],
        'db1',
      );

      const apartmentId = apartmentResult.insertId;

      await this.databaseService.queryDB<InsertResult>(
        `
        INSERT INTO ApartmentExtra (apartment_id, description, image_url)
        VALUES (?, ?, ?)
        `,
        [apartmentId, description, image_url],
        'db2',
      );

      return {
        message: 'Creation successful',
        apartment_id: apartmentId,
        description: description,
        image_url: image_url,
      };
    } catch (error: unknown) {
      console.log('error', error);

      throw new HttpException(
        'Could not create the apartment extra. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllApartmentExtra() {
    try {
      return await this.databaseService.queryDB<ApartmentExtra[]>(
        'SELECT * FROM ApartmentExtra',
        [],
        'db2',
      );
    } catch {
      throw new HttpException(
        'Could not retrieve apartment extras. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOneApartmentExtra(id: number) {
    try {
      const rows = await this.databaseService.queryDB<ApartmentExtra[]>(
        'SELECT * FROM ApartmentExtra WHERE apartment_id = ?',
        [id],
        'db2',
      );

      if (rows.length === 0) {
        throw new HttpException(
          'Apartment extra not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return rows[0];
    } catch (error: unknown) {
      console.log('Error retrieving apartment extra:', error);
      throw new HttpException(
        'Could not retrieve apartment extra. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateApartmentExtra(id: number, body: UpdateApartmentsExtraDto) {
    const { description, image_url } = body;

    try {
      if (!description || !image_url) {
        throw new HttpException(
          'Description and image URL are required',
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.databaseService.queryDB<ResultSetHeader>(
        `UPDATE ApartmentExtra SET description = ?, image_url = ? WHERE apartment_id = ?`,
        [description, image_url, id],
        'db2',
      );

      return { message: 'Updated successfully' };
    } catch (error: unknown) {
      console.log('Error updating apartment extra:', error);
      throw new HttpException(
        'Could not update apartment extra. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeApartmentExtra(id: number) {
    try {
      const existing = await this.databaseService.queryDB<ApartmentExtra[]>(
        'SELECT * FROM ApartmentExtra WHERE apartment_id = ?',
        [id],
        'db2',
      );

      if (existing.length === 0) {
        throw new HttpException(
          'Apartment extra not found',
          HttpStatus.NOT_FOUND,
        );
      }

      await this.databaseService.queryDB<ResultSetHeader>(
        'DELETE FROM ApartmentExtra WHERE apartment_id = ?',
        [id],
        'db2',
      );

      return { message: 'Deleted successfully' };
    } catch (error: unknown) {
      console.log('Error removing apartment extra:', error);
      throw new HttpException(
        'Could not remove apartment extra. Please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
