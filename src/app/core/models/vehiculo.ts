// src/app/core/models/vehiculo.dto.ts
import { User } from './user';
import { CompaniaAseguradora } from './compania-aseguradora';

export interface Vehiculo {
  id?: number;
  marca: string;
  modelo: string;
  matricula: string;
  color: string;
  numeroBastidor: string;
  propietario: User;
  companiaAseguradora: CompaniaAseguradora;
}
