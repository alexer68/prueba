import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { IParameters } from '../../../services/data.model';
import { IRelAlumnos } from 'src/app/interfaces/interfaces';
import { ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.page.html',
  styleUrls: ['./estudiante.page.scss'],
})
export class EstudiantePage implements OnInit {

  constructor(private dataService: DataService,
              private toastCtrl: ToastController,
              private alertController: AlertController,
              private actionSheetCtrl: ActionSheetController,
              private socialSharing: SocialSharing) { }

  swiperOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  private sParam: IParameters = new IParameters();
  relalumnos: IRelAlumnos[] = [];
  sitmaster: boolean;
  idusr: number;
  opvista = 1;
  cveinvitado = '';

  ngOnInit() {
    this.sitmaster = this.dataService.sitmaster;
    this.idusr = this.dataService.idusr;
    this.loadBD();
  }

  loadBD() {
    this.sParam.op = 15;
    this.sParam.idusr = this.dataService.idusr;
    this.sParam.idusrmaster = this.dataService.idusrmaster;
    this.dataService.getDataLoad(this.sParam).subscribe( res => {
      console.log('>>>res: ', res);
      if (res.CodeNumber === 201) {
        this.relalumnos = res.Result[0].relalumnos;
      }
    });
  }

  menuContextual( op, alumno) {
    if (op === 1) {  // Generar Clave
      this.sParam.op = 19;
      this.sParam.idmatricula = alumno.idmatricula;
      this.dataService.getDataLoad(this.sParam).subscribe( res => {
        if (res.CodeNumber === 201) {
          this.relalumnos.find(x => x.matricula === alumno.matricula ).cveinvitado = res.Message;
          this.openMessage('CLAVE: ' + res.Message);
        }
      });
    }
    if (op === 2) {  // Cancelar Clave
      this.sParam.op = 20;
      this.sParam.idusr = this.dataService.idusr;
      this.sParam.idmatricula = alumno.idmatricula;
      this.dataService.getDataLoad(this.sParam).subscribe( res => {
        if (res.CodeNumber === 201) {
          this.relalumnos.find(x => x.matricula === alumno.matricula ).cveinvitado = undefined;
          this.openMessage(res.Message);
        }
      });
    }
    if (op === 4) {  // Eliminar alumno
      this.sParam.op = 18;
      this.sParam.idusr = this.dataService.idusr;
      this.sParam.idmatricula = alumno.idmatricula;
      this.dataService.getDataLoad(this.sParam).subscribe( res => {
        if (res.CodeNumber === 201) {
          const idx = this.relalumnos.findIndex(x => x.matricula === alumno.matricula);
          this.relalumnos.splice(idx, 1);
        }
        this.openMessage(res.Message);
      });
    }
  }

  async addAlumno(){
    const input = await this.alertController.create({
      header: 'Agregar alumno',
      inputs: [
        {
          name: 'txtdato',
          type: 'text',
          placeholder: 'CURP / Matrícula',
          value: ''
        }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        }, {
          text: 'Aceptar',
          handler: ( data ) => {
            this.sParam.op = 16;
            this.sParam.idusr = this.dataService.idusr;
            this.sParam.idusrmaster = this.dataService.idusrmaster;
            this.sParam.idorg = this.dataService.idorg;
            this.sParam.dato = data.txtdato;
            this.dataService.getDataLoad(this.sParam).subscribe( res => {
              if (res.CodeNumber === 201) {
                if (this.relalumnos === undefined) {
                  this.relalumnos = res.Result[0].relalumnos;
                } else {
                  const irelAlumnos: IRelAlumnos[] = res.Result[0].relalumnos;
                  this.relalumnos.push(...irelAlumnos);
                }
              }
              this.openMessage(res.Message);
            });
          }
      }]
    });
    await input.present();
  }

  onInputcveinvitado(eventcode) {
    this.cveinvitado = eventcode;  // .toUpperCase();
    this.cveinvitado = this.cveinvitado.replace('Clave Invitado: ', '');
    this.cveinvitado = this.cveinvitado.replace('\n', '');
    this.cveinvitado = this.cveinvitado.replace('https://dalegmx.com', '');
  }

  onclick_cveinvitado() {
      this.sParam.op = 17;
      this.sParam.idorg = this.dataService.idorg;
      this.sParam.idusr = this.dataService.idusr;
      this.sParam.dato = this.cveinvitado;
      this.dataService.getDataLoad(this.sParam).subscribe( res => {
        if (res.CodeNumber === 201) {
          if (this.relalumnos === undefined) {
            this.relalumnos = res.Result[0].relalumnos;
          } else {
            const irelAlumnos: IRelAlumnos[] = res.Result[0].relalumnos;
            this.relalumnos.push(...irelAlumnos);
          }
          this.opvista = 1;
        }
        this.openMessage(res.Message);
      });
  }

  onclick_cveinvitado_cancel() {
    this.opvista = 1;
  }

  async addInvitado() {
    this.opvista = 2;
  }


  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Agregar',
      backdropDismiss: true,
      buttons: [
        {
        text: 'Agregar alumno',
        icon: 'person-circle-outline',
        handler: () => {
          this.addAlumno();
        }
      }, {
        text: 'Agregar alumno invitado',
        icon: 'git-branch-outline',
        handler: () => {
          this.addInvitado();
        }
      }]
    });
    await actionSheet.present();
  }

  shareCode(alumno: IRelAlumnos) {
    this.socialSharing.share('Clave Invitado: ' + alumno.cveinvitado + '\n' , null, '', 'https://dalegmx.com')
    .then(() => {
    }).catch(() => {
    });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.relalumnos = [];
      this.loadBD();
      event.target.complete();  // Finaliza recarga
    }, 1500);
  }

  async openMessage( message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }

}
