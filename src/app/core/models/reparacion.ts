// src/app/features/reparacion/reparacion.model.ts
import { Trabajador } from '../models/trabajador';  // asumiendo que tienes modelo Trabajador
import { Pieza } from '../models/pieza';
import { User } from '../models/user';                  // asumiendo que tienes modelo Pieza

export interface Reparacion {
  id?: number;
  descripcion: string;
  trabajador?: Trabajador;           // opción nullable, o puedes usar solo id si prefieres
  horaInicio: string;                // ISO string para fechas en JSON
  horaFin: string;
  user: User;
  piezas?: Pieza[];
  estado:string;                  // lista de piezas
}
