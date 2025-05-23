// src/app/core/models/user.dto.ts
export interface UserDTO {
  id?: number;
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
  password?: string;
}
