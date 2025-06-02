import { OrdenDeTrabajo } from './ordenDeTrabajo';

export interface FinalizarOrdenDeTrabajoDTO {
  id: number;
  fechaFin: string; // en formato ISO (ej. '2025-05-27T15:30:00')
  ordenDeTrabajoDTO: OrdenDeTrabajo;
}
