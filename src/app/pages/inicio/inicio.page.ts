import { Component, OnInit, Input } from '@angular/core';
import { Platform, IonRouterOutlet, ToastController } from '@ionic/angular';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

import { AppComponent } from '../../app.component';
import { DataService } from '../../services/data.service';
import { IParameters } from '../../services/data.model';
import { PushService } from '../../services/push.service';


@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  opingreso = 2;
  private sParam: IParameters = new IParameters();
  @Input() totnotificaciones = 0;
  segundos = 2;
  message = '';
  userId = '';
  cveacceso = '';
  encodeData: any;
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor( private appComponent: AppComponent,
               private dataService: DataService,
               private pushService: PushService,
               private platform: Platform,
               private routerOutlet: IonRouterOutlet,
               private toastCtrl: ToastController,
               private barcodeScanner: BarcodeScanner
                ) {
                // BackButton físico, para salir del App()
                this.backButtonEvent();
                // Options
                this.barcodeScannerOptions = {
                  showTorchButton: true,
                  showFlipCameraButton: true
                };
               }

  swiperOpts = {
  allowSlidePrev: false,
  allowSlideNext: false
  };

  ngOnInit() {
    if (this.pushService.userId !== undefined) {
      this.opingreso = 2;
      this.loadBD();
    } else {
        this.opingreso = 2;
        this.segundos = 2;
        this.tiempoRegresivo();
    }
  }

  loadBD() {
    if (this.dataService.userId === undefined && this.pushService.userId !== undefined) {


      this.sParam.op = 0;
      this.sParam.userId = this.pushService.userId;

      this.dataService.getDataLoad(this.sParam).subscribe( res => {

        console.log(res);

        this.userId = this.pushService.userId;
        if (res.CodeNumber === 201) { this.opingreso = 3; }
        else { this.opingreso = 0; }
      });


    } else {
      if (this.dataService.userId === undefined) {
        this.segundos = 2;
        this.tiempoRegresivo();
      }
    }
  }

  onInput4digitos( eventcode ) {
    this.cveacceso = eventcode;
    if (this.cveacceso.toString().length === 4) {
      this.sParam.op = 1;
      this.sParam.userId = this.pushService.userId;
      this.sParam.cveacceso = Number(this.cveacceso);
      this.dataService.getDataLoad(this.sParam).subscribe( res => {
        if (res.CodeNumber === 201) {
          console.log(res);
          this.appComponent.imenu = res.Result[0].menu;
          this.dataService.userId = res.Result[0].usr[0].userId;
          this.dataService.idusr = res.Result[0].usr[0].idusr;
          this.dataService.nombre = res.Result[0].usr[0].nombre;
          this.dataService.apellidos = res.Result[0].usr[0].apellidos;
          this.dataService.foto = res.Result[0].usr[0].foto;
          this.dataService.idtag = res.Result[0].usr[0].idtag;
          this.dataService.idorg = res.Result[0].usr[0].idorg;
          this.dataService.sitmaster = res.Result[0].usr[0].sitmaster;
          this.dataService.idusrmaster = res.Result[0].usr[0].idusrmaster;
          this.opingreso = 1;
          this.cveacceso = '';
          // this.totnotificaciones = res.Result[0].usuarios[0].totnotificaciones;
        } else {
          if (res.ErrorNumber === 2) {
            this.openMessage(res.Message);
            this.cveacceso = '';
          } else { this.opingreso = 0; }
        }
      });
    }
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(() => {
      if (!this.routerOutlet.canGoBack()) {
        navigator[ 'app'.toString() ].exitApp();
      }
    });
  }

  //
  opIngresoEmitido() {
    this.opingreso = 1;
  }

  async tiempoRegresivo() {
    if (this.segundos > 0) { this.segundos = this.segundos - 1; } // Date.parse(this.futuro.toString()) - Date.parse(ahora);

    if (this.segundos > 0) {
         const minutos = Math.floor(this.segundos / 60);
         const intervalId2 = setInterval(() => {
            clearInterval(intervalId2);
            this.tiempoRegresivo();
            return;
         }, 1000);

    } else {
        this.loadBD();
        return;
    }
  }

  async encodedText() {
    this.sParam.op = 10;
    this.sParam.idusr = this.dataService.idusr;
    this.dataService.getDataLoad(this.sParam).subscribe( res => {
      if (res.CodeNumber === 201) {
        this.encodeData = res.Message;
        this.barcodeScanner
          .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodeData)
          .then(
            encodedData => {
              this.encodeData = encodedData;
            },
            err => {
              console.log('Error occured : ' + err);
            }
        );
      }
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
