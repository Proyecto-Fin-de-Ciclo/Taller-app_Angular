import { Pieza } from './pieza';
import { Vehiculo } from './vehiculo';
import { User } from './user';
import { Trabajador } from './trabajador';

export interface OrdenDeTrabajo {
  id?: number;
  trabajadores: Trabajador[];
  vehiculo: Vehiculo;
  descripcionTrabajo: string;
  estadoOrdenDeTrabajo:string;
  piezas: Pieza[];
  user: User;
}
