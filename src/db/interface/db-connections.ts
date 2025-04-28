import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface Apartment extends RowDataPacket {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  apartment_type: string;
  rate?: number;
  description?: string;
  image_url?: string;
  distance?: number;
}
export interface ApartmentExtra extends RowDataPacket {
  apartment_id: number;
  description: string;
  image_url: string;
}

export interface InsertResult extends ResultSetHeader {
  insertId: number;
}
