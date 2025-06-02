import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CitaService } from '../../core/services/cita.service';
import { Cita } from '../../core/models/cita';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth/auth-service.service';
import { UserService } from '../../core/services/user.service';
import { VehiculoService } from '../../core/services/vehiculo.service';
import { Vehiculo } from '../../core/models/vehiculo';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, DialogModule, HttpClientModule],
  templateUrl: './gestion-citas.component.html',
  styleUrls: ['./gestion-citas.component.css']
})
export class GestionCitasComponent implements OnInit {
  @Input() usuario!: User;

  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;

  citasPorDia: { [dia: number]: Cita[] } = {};
  diasDelMes: { numero: number; esDeOtroMes: boolean }[] = [];

  dialogVisible = false;
  citaSeleccionada: Cita | null = null;
  usuarioRol: string[] = [];
  formVisible = false;
  nuevaCitaDia: number | null = null;
  nuevaCitaHora: string = '';

  nuevoUsuario: User = {
    nombre: '',
    apellidos: '',
    dni: '',
    telefono: 0,
    email: '',
    direccion: '',
    ciudad: '',
    provincia: '',
    cp: '',
    pais: '',
    nombreUsuarioApp: '',
    password: 'temporal123',
    vehiculos: []
  };
  mostrarFormularioUsuario = false;

  constructor(
    private citaService: CitaService,
    private authService: AuthService,
    private userService: UserService,
    private vehiculoService: VehiculoService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      const userInfo = this.authService.getUsername();
  console.log('Datos del usuario desde Keycloak:', userInfo);

  if (userInfo) {
    this.usuario = {
      nombreUsuarioApp: userInfo,
      email:  '',
      nombre:  '',
      apellidos:  '',
      dni: '',
      telefono: 0,
      direccion: '',
      ciudad: '',
      provincia: '',
      cp: '',
      pais: '',
      password: '',
      vehiculos: []
    };
  } else {
    console.error('No se pudo obtener el nombre de usuario desde Keycloak');
  }
    this.cargarCitasDelMes();
    this.usuarioRol = this.authService.getRoles();
  }, 500); // este retraso depende de tu red y servidor, por eso es inestable
}

  cargarCitasDelMes() {
    const year = this.selectedYear;
    const month = this.selectedMonth;
    const fechaInicio = `${year}-${month.toString().padStart(2, '0')}-01`;
    const ultimoDia = new Date(year, month, 0).getDate();
    const fechaFin = `${year}-${month.toString().padStart(2, '0')}-${ultimoDia.toString().padStart(2, '0')}`;

    this.generarDiasDelMes(year, month);

    this.citaService.getCitasPorRango(fechaInicio, fechaFin).subscribe({
      next: (citas) => this.organizarCitasPorDia(citas),
      error: (err) => {
        console.error('Error cargando citas:', err);
        this.citasPorDia = {};
      }
    });
  }

  generarDiasDelMes(year: number, month: number) {
    const dias: { numero: number; esDeOtroMes: boolean }[] = [];
    const primerDia = new Date(year, month - 1, 1);
    const primerDiaSemana = (primerDia.getDay() + 6) % 7;

    const ultimoDiaMesAnterior = new Date(year, month - 1, 0).getDate();
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      dias.push({ numero: ultimoDiaMesAnterior - i, esDeOtroMes: true });
    }

    const diasEnEsteMes = new Date(year, month, 0).getDate();
    for (let i = 1; i <= diasEnEsteMes; i++) {
      dias.push({ numero: i, esDeOtroMes: false });
    }

    while (dias.length % 7 !== 0) {
      dias.push({ numero: dias.length - diasEnEsteMes + 1, esDeOtroMes: true });
    }

    this.diasDelMes = dias;
  }

  organizarCitasPorDia(citas: Cita[]) {
    this.citasPorDia = {};
    citas.forEach(cita => {
      const dia = new Date(cita.fecha).getDate();
      if (!this.citasPorDia[dia]) {
        this.citasPorDia[dia] = [];
      }
      this.citasPorDia[dia].push(cita);
    });
  }

  onChangeFecha() {
    this.cargarCitasDelMes();
  }

  abrirDetalleCita(cita: Cita): void {
    this.citaSeleccionada = cita;
    this.dialogVisible = true;
  }

  getCitasDelDia(diaNumero: number): Cita[] {
    return this.citasPorDia[diaNumero] || [];
  }

  obtenerColorDia(dia: number): string {
    if (this.esFinDeSemana(this.selectedYear, this.selectedMonth, dia)) return 'transparent';
    const citas = this.getCitasDelDia(dia);
    return citas.length >= 6 ? 'red' : 'green';
  }

  esFinDeSemana(year: number, month: number, day: number): boolean {
    const fecha = new Date(year, month - 1, day);
    const diaSemana = fecha.getDay();
    return diaSemana === 0 || diaSemana === 6;
  }

  seleccionarDia(dia: number) {
    this.nuevaCitaDia = dia;
    this.formVisible = true;
  }

  anadirCita() {
    const [hora, minuto] = this.nuevaCitaHora.split(':').map(Number);
  const horaValida = hora >= 9 && hora < 19;
    console.log('Buscando usuario en BD:', this.usuario);
  if (!this.nuevaCitaDia || !this.nuevaCitaHora) {
    console.warn('Faltan datos para crear la cita');
    return;
  }

  if (!this.usuario?.nombreUsuarioApp) {
    console.error('Usuario no autenticado o sin nombreUsuarioApp');
    return;
  }
  if (!horaValida) {
    alert('Por favor, selecciona una hora entre las 09:00 y las 19:00.');
    return;
  }

  const fecha = this.generarFechaCita();



  this.citaService.getUserByUsername(this.usuario.nombreUsuarioApp).subscribe({
  next: (userFromDb) => {
    console.log('Respuesta de getUserByUsername:', userFromDb);

    if (userFromDb) {
      const nuevaCita: Cita = {
        fecha: fecha.toISOString(),
        user: userFromDb,
      };
      this.crearCita(nuevaCita);
    } else {
      console.warn('Usuario no encontrado, mostrando formulario...');
      this.mostrarFormularioNuevoUsuario(this.usuario!.nombreUsuarioApp);
    }
  },
  error: (e) => {
    console.error('Error inesperado al buscar usuario:', e);
    this.mostrarFormularioNuevoUsuario(this.usuario!.nombreUsuarioApp);
  }
});
}


  crearCita(cita: Cita) {
    this.citaService.crearCita(cita).subscribe({
      next: () => {
        this.formVisible = false;
        this.mostrarFormularioUsuario = false;
        this.cargarCitasDelMes();
      },
      error: (err) => console.error('Error al crear la cita:', err)
    });
  }

  generarFechaCita(): Date {
    const fecha = new Date(this.selectedYear, this.selectedMonth - 1, this.nuevaCitaDia!);
    const [h, m] = this.nuevaCitaHora.split(':');
    fecha.setHours(+h, +m);
    return fecha;
  }

  mostrarFormularioNuevoUsuario(username: string) {
    this.nuevoUsuario.nombreUsuarioApp = username;
    this.mostrarFormularioUsuario = true;
  }

guardarNuevoUsuarioYCrearCita() {
  this.userService.create(this.nuevoUsuario).subscribe({
    next: () => {
      // ✅ El usuario ya se ha guardado, ahora lo volvemos a buscar por username
      this.citaService.getUserByUsername(this.nuevoUsuario.nombreUsuarioApp).subscribe({
        next: (usuarioConId) => {
          console.log('Usuario creado y recuperado con ID:', usuarioConId.id);

          const nuevaCita: Cita = {
            fecha: this.generarFechaCita().toISOString(),
            user: usuarioConId // ✅ Este usuario sí tiene ID
          };

          this.crearCita(nuevaCita);
        },
        error: (e) => {
          console.error('Error al recuperar el usuario tras crearlo:', e);
        }
      });
    },
    error: (e) => console.error('Error al crear usuario:', e)
  });
}
esDiaSeleccionable(dia: { numero: number; esDeOtroMes: boolean }): boolean {
  const diaNumero = dia.numero;
  return (
    !dia.esDeOtroMes &&
    !this.esFinDeSemana(this.selectedYear, this.selectedMonth, diaNumero) &&
    (this.getCitasDelDia(diaNumero).length < 6)
  );
}


}
