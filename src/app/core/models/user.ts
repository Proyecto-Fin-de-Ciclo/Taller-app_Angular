// src/app/core/models/user.dto.ts
import { Vehiculo } from './vehiculo';

export interface User {
  id?: number;                 // Opcional porque al crear no existe aún
  nombre: string;
  apellidos: string;
  dni: string;
  telefono: number;
  email: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  cp: string;
  pais: string;
  nombreUsuarioApp: string;
  password: string;
  vehiculos: Vehiculo[];
}

