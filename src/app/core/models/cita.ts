// src/app/core/models/cita.dto.ts
import { UserDTO } from './user';
import { VehiculoDTO } from './vehiculo';

export interface Cita {
  id?: number;
  user: UserDTO;
  vehiculoCita: VehiculoDTO;
  fecha: string;  // formato ISO string para fecha y hora
}
