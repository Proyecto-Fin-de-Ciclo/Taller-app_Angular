// src/app/core/models/vehiculo.dto.ts
import { UserDTO } from './user';
import { CompaniaAseguradora } from './compania-aseguradora';

export interface VehiculoDTO {
  id?: number;
  marca: string;
  modelo: string;
  matricula: string;
  color: string;
  numeroBastidor: string;
  propietarioId: UserDTO;
  companiaAseguradoraId: CompaniaAseguradora;
}
