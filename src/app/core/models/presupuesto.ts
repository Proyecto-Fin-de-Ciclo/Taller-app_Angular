import { Pieza } from './pieza';
import { Vehiculo } from './vehiculo';
import { User } from './user';

export interface Presupuesto {
  id?: number;
  nombreTaller: string;
  direccionTaller: string;
  telefonoTaller: string;
  descripcionTrabajo: string;
  subtotalPiezas: number;
  totalConIVA: number;
  aceptado: boolean;
  matricula: string;
  piezas: Pieza[];
  vehiculo: Vehiculo;
  user: User;
}
