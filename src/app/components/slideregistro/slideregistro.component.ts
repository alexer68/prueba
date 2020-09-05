import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ToastController } from '@ionic/angular';
import { AppComponent } from '../../app.component';
import { IParameters } from '../../services/data.model';
import { IUsr } from 'src/app/interfaces/interfaces';
import { IData, ISendEmail } from '../../interfaces/interfaces';

@Component({
  selector: 'app-slideregistro',
  templateUrl: './slideregistro.component.html',
  styleUrls: ['./slideregistro.component.scss'],
})
export class SlideregistroComponent implements OnInit {
  rfid = '';
  idtag = 0;
  idorg = 0;
  nombre = '';
  apellidos = '';
  email = '';
  cel = '';
  cveacceso = 0;
  disabledslide1 = false;
  disabledslide2 = true;
  disabledslide3 = true;

 @Output() opingresoEvent = new EventEmitter();
 @Input() userId: string;
  opingreso: number;

  private sParam: IParameters = new IParameters();
  usr: IUsr[] = [];

  constructor(private dataService: DataService,
              private toastCtrl: ToastController,
              // private pushService: PushService,
              private appComponent: AppComponent) { }

  ngOnInit() {}

  onClick_Empezar() {
    this.opingresoEvent.emit();
  }

  onclick_Registrar() {
    this.sParam.op = 2;
    this.sParam.rfid = this.rfid;
    this.dataService.getDataLoad(this.sParam).subscribe( res => {
      switch ( res.CodeNumber ) {
        case 201:
          this.idtag = res.Result[0].usr[0].idtag;
          this.idorg = res.Result[0].usr[0].idorg;
          this.disabledslide1 = true;
          this.disabledslide2 = false;
          break;
        case 402:
          this.rfid = '';
          this.openMessage(res.Message);
          break;
      }
    });
  }

  onInputrfid( eventcode ) {
    this.rfid = eventcode.toString();
  }

  onInputnombre( eventcode ) {
    this.nombre = eventcode.toString();
  }

  onInputapellidos( eventcode ) {
    this.apellidos = eventcode.toString();
  }

  onInputcel( eventcode ) {
    this.cel = eventcode.toString();
  }

  onInputcveacceso( eventcode ) {
    // Condicionar a que el primer dígito no sea igual a cero
    this.cveacceso = eventcode.toString();
  }

  onInputemail( eventcode ) {
    this.email = eventcode.toString();
  }

  guardaDatos() {
    const msg = this.validarDatos();
    if (msg.length === 0) {
      this.disabledslide2 = true;
      this.disabledslide3 = false;
      //
      this.sParam.op = 3;
      this.sParam.nombre = this.nombre.toUpperCase();
      this.sParam.apellidos = this.apellidos.toUpperCase();
      this.sParam.email = this.email.toLowerCase();
      this.sParam.cel = this.cel;
      this.sParam.cveacceso = Number(this.cveacceso);
      this.sParam.userId = this.userId;
      this.sParam.idtag = this.idtag;
      this.sParam.idorg = this.idorg;
      this.dataService.getDataLoad(this.sParam).subscribe( res => {
        switch ( res.CodeNumber ) {
          case 201:
            this.ingresoAPP(res);
            // this.envioEmail();
            break;
          case 402:
            this.rfid = '';
            this.openMessage(res.Message);
            break;
        }
      });
    } else { this.openMessage(msg); }
  }

  ingresoAPP(res: IData) {
    this.appComponent.imenu = res.Result[0].menu;
    this.dataService.idusr = res.Result[0].usr[0].idusr;
    this.dataService.nombre = res.Result[0].usr[0].nombre;
    this.dataService.apellidos = res.Result[0].usr[0].apellidos;
    this.dataService.foto = res.Result[0].usr[0].foto;
    this.dataService.idtag = res.Result[0].usr[0].idtag;
    this.dataService.idorg = res.Result[0].usr[0].idorg;
    this.dataService.userId = res.Result[0].usr[0].userId;
    this.dataService.sitmaster = res.Result[0].usr[0].sitmaster;
    this.dataService.idusrmaster = res.Result[0].usr[0].idusrmaster;
  }

  validarDatos(): string {
    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    if (emailRegex.test(this.email) === false) {
      return 'Correo no válido !';
    }
    if (this.nombre.length <= 1) {
      return 'Requiere capturar el campo de NOMBRE !';
    }
    if (this.apellidos.length <= 0) {
      return 'Requiere capturar el campo de APELLIDOS !';
    }
    if (this.cveacceso < 1000) {
      return 'Clave inválida !';
    }
    return '';
  }

  envioEmail() {
    const param: ISendEmail = {
        emailTo: this.email,
        subject: 'Confirmación de correo.',
        body: this.dataService.cadenaemail
     };
    this.dataService.sendEmail(param).subscribe( res => {
    });
  }

  async openMessage( message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
