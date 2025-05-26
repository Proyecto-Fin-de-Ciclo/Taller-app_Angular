// src/app/core/models/cita.dto.ts
import { User } from './user';
import { Vehiculo } from './vehiculo';

export interface Cita {
  id?: number;
  user: User;
  vehiculoCita: Vehiculo;
  fecha: string;  // formato ISO string para fecha y hora
}
