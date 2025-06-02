// src/app/features/trabajador/trabajador.model.ts
export interface Trabajador {
  id?: number;
  nombreCompleto: string;
  codigoEmpleado: string;
  imagen?: string;
  telefono: string;
  urlImagen?: string;
  nombreUsuarioApp:string;
  // añade más campos si tienes, o los que quieras
}
