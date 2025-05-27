import { Pieza } from './pieza';
import { Vehiculo } from './vehiculo';
import { User } from './user';
import { Trabajador } from './trabajador';

export interface OrdenDeTrabajoDTO {
  id?: number;
  trabajadores: Trabajador[];
  vehiculoDTO: Vehiculo;
  descripcionTrabajo: string;
 estado:string;
  piezas: Pieza[];
  user: User;
}
