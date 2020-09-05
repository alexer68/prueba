import { Component, OnInit, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { IParameters } from '../../../services/data.model';
import { IRelAlumnos, IUsr } from '../../../interfaces/interfaces';
import { ToastController, ModalController } from '@ionic/angular';
import { MostrarfotoPage } from '../mostrarfoto/mostrarfoto.page';
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';

@Component({
  selector: 'app-scanrfid',
  templateUrl: './scanrfid.page.html',
  styleUrls: ['./scanrfid.page.scss'],
})
export class ScanrfidPage implements OnInit {

  swiperOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  // @ViewChild('inputId', {static: false}) ionInput: { setFocus: () => void; };
  private sParam: IParameters = new IParameters();
  relusers: IUsr[] = [];
  relalumnos: IRelAlumnos[] = [];
  public message = '';
  public codeData: number;
  opvista = 1;
  sitmodo = true;
  desmodo = 'ENTRADA';
  icomodo = 'enter-outline';
  clrmodo = 'primary';
  private hubConnection: HubConnection;

  constructor(private dataService: DataService,
              private toastCtrl: ToastController,
              private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
     this.initHub();
  }

  ionViewDidLeave() {
    this.hubConnection.stop();
  }

  initHub()
  {
    const signalrBaseUri = 'https://webschooldaleg.azurewebsites.net/vortexhub';
    this.hubConnection = new HubConnectionBuilder()
    .configureLogging(LogLevel.Debug)
    .withUrl(signalrBaseUri, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    })
    .build();

    this.hubConnection.on('displayOnConnected', connectionId => {
      console.log('> Conectado: ', connectionId);
      this.sParam.op = 1;
      this.sParam.idusr = this.dataService.idusr;
      this.sParam.connectionId = connectionId;
      this.dataService.getDataHub(this.sParam).subscribe( res => {
        console.log('res > ', res);
      });
    });

    this.hubConnection.on('displayOffConnected', connectionId => {
      console.log('> Desconectado: ', connectionId);
    });

    this.hubConnection.start();
  }


  loadBD() {
    this.message = '';
    this.sParam.op = 24;
    this.sParam.idorg = this.dataService.idorg;
    this.sParam.dato = this.codeData.toString();
    this.sParam.idusr = this.dataService.idusr;
    this.sParam.sitmodo = this.sitmodo;
    // this.codeData = undefined;
    this.dataService.getDataLoad(this.sParam).subscribe( res => {
      if (res.CodeNumber === 201) {
        this.relusers = res.Result[0].usr;
        this.relalumnos = res.Result[0].relalumnos;
        this.opvista = 2;
      }
      this.message = res.Message;
    });
  }

  scanRFID() {
    this.loadBD();
  }

  modoRegistro() {
    if ( this.sitmodo === true ) {
      this.sitmodo = false;
      this.desmodo = 'SALIDA';
      this.icomodo = 'megaphone-outline';
      this.clrmodo = 'warning'; }
    else {
      this.sitmodo = true;
      this.desmodo = 'ENTRADA';
      this.icomodo = 'enter-outline';
      this.clrmodo = 'primary'; }
    if (this.opvista === 2) {
      console.log('>>>loadBD RFID');
      this.loadBD();
    }
  }

  aceptar() {
    this.codeData = undefined;
    let opsel = 2;  // Entrada
    if (this.sitmodo === false) {
      opsel = 3;    // Aviso - Salida
    }
    const pdata3: { idusrmaster: number, idusr: number, idmatricula: number, idua: number, selected: boolean }[] = [];
    let i = 0;
    this.relalumnos.filter(x => {
      pdata3[i] = { idusrmaster: this.dataService.idusr,
                    idusr: x.idusr,
                    idmatricula: x.idmatricula,
                    idua: x.idua,
                    selected: x.selected };
      i++;
    });
    const param: any = {
      op: opsel,
      data3: pdata3
      };
    this.dataService.getData(param).subscribe( res => {
      if (res.CodeNumber === 201) {
        if (opsel === 3) {
          this.hubConnection.invoke('avisoSalida', this.dataService.idusr);
        }
        this.message = '';
        this.opvista = 1;
        this.openMessage(res.Message);
      }
    });
  }

  cancelar() {
    this.codeData = undefined;
    this.message = '';
    this.opvista = 1;
  }

  async mostrarFoto(foto: string) {
    const modal = await this.modalCtrl.create({
      component: MostrarfotoPage,
      componentProps: {
        fotodata: foto
      }
    });
    await modal.present();
    await modal.onDidDismiss();
  }

  async openMessage( message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000
    });
    toast.present();
  }


}
