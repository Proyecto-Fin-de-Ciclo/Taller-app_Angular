import { Pieza } from './pieza';
import { User } from './user';
import { Vehiculo } from './vehiculo';

export interface Presupuesto {
  id: number;
  nombreTaller: string;
  direccionTaller: string;
  telefonoTaller: string;
  descripcionTrabajo: string;
  subtotalPiezas: number;
  totalConIVA: number;
  aceptado: boolean;
  piezas: Pieza[];
  vehiculo: Vehiculo;
}
