import { Component, OnInit } from '@angular/core';
import { IParameters } from '../../../services/data.model';
import { IUsr } from '../../../interfaces/interfaces';
import { ToastController, ActionSheetController, AlertController } from '@ionic/angular';
import { DataService } from '../../../services/data.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-familiar',
  templateUrl: './familiar.page.html',
  styleUrls: ['./familiar.page.scss'],
})
export class FamiliarPage implements OnInit {

  constructor(private dataService: DataService,
              private toastCtrl: ToastController,
              private camera: Camera,
              private actionSheetCtrl: ActionSheetController,
              private alertController: AlertController,
              private socialSharing: SocialSharing) { }

  private sParam: IParameters = new IParameters();
  users: IUsr[] = [];
  sitmaster: boolean;
  idusr: number;

  ngOnInit() {
    this.sitmaster = this.dataService.sitmaster;
    this.idusr = this.dataService.idusr;
    this.loadBD();
  }

  loadBD() {
    this.sParam.op = 6;
    this.sParam.idusr = this.dataService.idusr;
    this.sParam.userId = this.dataService.userId;
    this.dataService.getDataLoad(this.sParam).subscribe( res => {
      if (res.CodeNumber === 201) {
        this.users = res.Result[0].usr;
      }
    });
  }

  menuContextual(op: number, usr: IUsr) {
    if (op === 1) {  // Activar / Desactivar
      this.sParam.op = 7;
      this.sParam.idusr = usr.idusr;
      this.sParam.idusrmaster = this.idusr;
      this.dataService.getDataLoad(this.sParam).subscribe( res => {
        if (res.CodeNumber === 201) {
          this.users.filter( sel => {
            if (sel.idusr === usr.idusr) {
              sel.sitactivo = res.Result[0].usr[0].sitactivo;
              sel.trest = res.Result[0].usr[0].trest;
              sel.sitrfid = res.Result[0].usr[0].sitrfid;
              return;
            }
          });
        }
      });
    }
    if (op === 2 || op === 3) {  // Capturar foto del usuario
      this.takePhoto(op - 2, usr);
    }
    if (op === 4) {  // Solicitar TAG
      this.confirmarSolTAG(usr);
    }
    if (op === 5) {  // Editar
      this.updFamiliar(usr);
    }
    if (op === 6) {  // Eliminar
      this.sParam.op = 13;
      this.sParam.idusr = usr.idusr;
      this.sParam.idusrmaster = this.idusr;
      this.dataService.getDataLoad(this.sParam).subscribe( res => {
        if (res.CodeNumber === 201) {
          this.openMessage(res.Message);
          this.loadBD();
        }
      });
    }
  }

  async confirmarSolTAG(usr: IUsr) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmar!',
      message: '¿Desea confirmar la solicitud de un <strong>nuevo TAG</strong> ?. El TAG actual será <strong>CANCELADO</strong>.',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {}
        }, {
          text: 'Si',
          handler: () => {
            this.sParam.op = 8;
            this.sParam.idusr = usr.idusr;
            this.sParam.idusrmaster = this.idusr;
            this.dataService.getDataLoad(this.sParam).subscribe( res => {
              if (res.CodeNumber === 201) {
                this.users.filter( sel => {
                  if (sel.idusr === usr.idusr) {
                    sel.sitactivo = res.Result[0].usr[0].sitactivo;
                    sel.sitrfid = res.Result[0].usr[0].sitrfid;
                    return;
                  }
                });
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async updFamiliar(usr: IUsr) {
    const input = await this.alertController.create({
      header: 'Agregar Familiar',
      subHeader: 'Ingrese Datos:',
      inputs: [
        {
          name: 'txtNombre',
          type: 'text',
          placeholder: 'NOMBRE',
          value: usr.nombre
        },
        {
          name: 'txtApellidos',
          type: 'text',
          placeholder: 'APELLIDOS',
          value: usr.apellidos
        },
        {
          name: 'txtphone',
          type: 'tel',
          placeholder: 'CELULAR ',
          value: usr.cel
        },
        {
          name: 'txtemail',
          type: 'text',
          placeholder: 'CORREO',
          value: usr.email
        }],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        }, {
          text: 'Aceptar',
          handler: ( data ) => {
            if (data.txtNombre.length > 0 && data.txtApellidos.length > 0) {
              this.sParam.op =  4;
              this.sParam.idusr = usr.idusr;
              this.sParam.nombre = data.txtNombre;
              this.sParam.apellidos = data.txtApellidos;
              this.sParam.cel = data.txtphone;
              this.sParam.email = data.txtemail;
              this.dataService.getDataLoad(this.sParam).subscribe( res => {
                if (res.CodeNumber === 201) {
                  this.loadBD();
                }
                this.openMessage(res.Message);
              });
            } else { this.openMessage('Datos incompletos !'); }

          }
      }]
    });
    await input.present();
  }

  async updCodigoAcceso(usr: IUsr){
    const input = await this.alertController.create({
      header: 'Código de Acceso',
      inputs: [
        {
          name: 'txtCve',
          type: 'number',
          placeholder: '4 dígitos',
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
            this.sParam.op =  14;
            this.sParam.idusr = usr.idusr;
            this.sParam.cveacceso = Number(data.txtCve);
            this.dataService.getDataLoad(this.sParam).subscribe( res => {
              this.openMessage(res.Message);
            });
          }
      }]
    });
    await input.present();
  }

  async addFamiliar() {
    const input = await this.alertController.create({
      header: 'Agregar Familiar',
      subHeader: 'Ingrese Datos:',
      inputs: [
        {
          name: 'txtNombre',
          type: 'text',
          placeholder: 'NOMBRE',
          value: ''
        },
        {
          name: 'txtApellidos',
          type: 'text',
          placeholder: 'APELLIDOS',
          value: ''
        },
        {
          name: 'txtphone',
          type: 'tel',
          placeholder: 'CELULAR ',
          value: ''
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {}
        }, {
          text: 'Aceptar',
          handler: ( data ) => {
            if (data.txtNombre.length > 0 && data.txtApellidos.length > 0) {
              this.sParam.op =  11;
              this.sParam.idusrmaster = this.dataService.idusr;
              this.sParam.idorg = this.dataService.idorg;
              this.sParam.nombre = data.txtNombre;
              this.sParam.apellidos = data.txtApellidos;
              this.sParam.cel = data.txtphone;
              this.dataService.getDataLoad(this.sParam).subscribe( res => {
                if (res.CodeNumber === 201) {
                  this.loadBD();
                }
                this.openMessage(res.Message);
              });
            } else { this.openMessage('Datos incompletos !'); }

          }
      }]
    });
    await input.present();
  }

  // async addInvitado() {
  //   const input = await this.alertController.create({
  //     header: 'Agregar Invitado',
  //     subHeader: 'Ingrese CODIGO:',
  //     inputs: [
  //       {
  //         name: 'txtTAG',
  //         type: 'text',
  //         placeholder: 'Código del TAG',
  //         value: ''
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Cancelar',
  //         role: 'cancel',
  //         handler: () => {}
  //       }, {
  //         text: 'Aceptar',
  //         handler: ( data ) => {
  //           if (data.txtTAG.length > 0) {
  //             this.sParam.op =  12;
  //             this.sParam.idusrmaster = this.dataService.idusr;
  //             this.sParam.idorg = this.dataService.idorg;
  //             this.sParam.rfid = data.txtTAG;
  //             this.dataService.getDataLoad(this.sParam).subscribe( res => {
  //               if (res.CodeNumber === 201) {
  //                 this.loadBD();
  //               }
  //               this.openMessage(res.Message);
  //             });
  //           } else { this.openMessage('Favor de teclear el código del TAG !'); }
  //         }
  //       }]
  //   });
  //   await input.present();
  // }

  // async presentActionSheet() {
  //   const actionSheet = await this.actionSheetCtrl.create({
  //     header: 'Agregar',
  //     backdropDismiss: true,
  //     buttons: [
  //       {
  //       text: 'Familiar',
  //       icon: 'people-circle-outline',
  //       handler: () => {
  //         this.addFamiliar();
  //       }
  //     }, {
  //       text: 'Invitado',
  //       icon: 'git-branch-outline',
  //       handler: () => {
  //         this.addInvitado();
  //       }
  //     }]
  //   });
  //   await actionSheet.present();
  // }

  takePhoto(sType: number, usr: IUsr) {
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sType,
    };
    this.camera.getPicture(options).then((imageData) => {
      // Guardar a la Base de Datos (UPDATE)
      this.sParam.op = 9;
      this.sParam.idusr = usr.idusr;
      this.sParam.foto = 'data:image/jpeg;base64,' + imageData;
      this.dataService.getDataLoad(this.sParam).subscribe( res => {
        if (res.CodeNumber === 201) {
          this.users.filter(usro => usro.idusr === usr.idusr)[0].foto = 'data:image/jpeg;base64,' + imageData;
        }
      });
    }, (err) => {
      // Handle error
    });
  }

  shareCodeQR(usr: IUsr) {
    this.socialSharing.share('Código de TAG: [ ' + usr.rfid + ' ] \n' +
      'https://dalegmx.com')
      .then(() => {}).catch(() => {
  });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.users = [];
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
