
export interface IMenu {
  icon: string;
  name: string;
  redirectTo: string;
}

export interface IUsr {
  idusr: number;
  nombre: string;
  nombreabr: string;
  apellidos: string;
  foto: string;
  email: string;
  cel: string;
  cveacceso: number;
  userId: string;
  idtag: number;
  idorg: number;
  sitactivo: number;
  sitmaster: boolean;
  sitbloqueo: boolean;
  idusrmaster: number;
  rfid: string;
  sitrfid: string;
  // trestsit: boolean;
  trest: string;
  selected: boolean;
  idcvo: number;
}

export interface IRelAlumnos {
  idmatricula: number;
  matricula: string;
  nombre: string;
  apellidos: string;
  desua: string;
  foto: string;
  timerest: string;
  fecinvitado: string;
  cveinvitado: string;
  sitinvitado: boolean;
  selected: boolean;
  desgpo: string;
  idgpo: number;
  idua: number;
  alumno: string;
  sitasistencia: number;
  desasistencia: string;
  idusr: number;
}

export interface IRelua {
  idua: number;
  desua: string;
  selected: boolean;
}

export interface IData {
  Result: {
    menu: { IMenu };
    usr: { IUsr };
    relalumnos: { IRelAlumnos };
    relua: { IRelua };
  };
  Message: string;
  CodeNumber: number;
  ErrorNumber: number;
}

export interface ISendEmail {
  emailTo: string;
  subject: string;
  body: string;
}


