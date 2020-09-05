import { Component, OnInit, ViewChild  } from '@angular/core';
import { IParameters } from '../../../services/data.model';
import { IUsr, IRelAlumnos } from '../../../interfaces/interfaces';
import { DataService } from '../../../services/data.service';
import { ToastController, IonInfiniteScroll, IonList } from '@ionic/angular';
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType } from '@microsoft/signalr';

@Component({
  selector: 'app-entrega',
  templateUrl: './entrega.page.html',
  styleUrls: ['./entrega.page.scss'],
})

export class EntregaPage implements OnInit {

  @ViewChild('lista', {static: false}) lista: IonList;
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  private sParam: IParameters = new IParameters();
  relusers: IUsr[] = [];
  relalumnos: IRelAlumnos[] = [];
  totdata = 0;
  private hubConnection: HubConnection;

  constructor(private dataService: DataService,
              private toastCtrl: ToastController
              ) { }

  ngOnInit() {
    this.loadBD();
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

    this.hubConnection.on('ReceiveMessage', (usuario, mensaje) => {
      console.log('Message received : ');
      console.log(usuario);
      console.log(mensaje);
    });

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

    this.hubConnection.on('displayRegistraEntrega', idusr => {
      console.log('Aviso del usuario: ' + idusr.toString());
      alert('Aviso del usuario: ' + idusr.toString());
    });

    this.hubConnection.start();
  }


  loadBD(): boolean {
    let existenDatos = false;
    this.sParam.op = 25;
    this.sParam.topi = this.totdata;
    this.sParam.idorg = this.dataService.idorg;
    this.sParam.idusr = this.dataService.idusr;
    this.dataService.getDataLoad(this.sParam).subscribe( res => {
      if (res.Result[0].usr !== undefined) {
        this.totdata += res.Result[0].usr.length;
        this.relusers.push ( ...res.Result[0].usr );
        this.relalumnos.push ( ...res.Result[0].relalumnos );
        // this.relusers = res.Result[0].usr;
        // this.relalumnos = res.Result[0].relalumnos;
        existenDatos = true;
      } else {
        existenDatos = false;
      }
    });
    return existenDatos;
  }

  loadData( event ) {
    setTimeout(() => {
      this.infiniteScroll.disabled = !this.loadBD();
      event.target.complete();
    }, 1000);
  }

  doRefresh(event) {
    setTimeout(() => {
      this.relusers = [];
      this.relalumnos = [];
      this.totdata = 0;
      this.loadBD();
      event.target.complete();  // Finaliza recarga
    }, 1500);
  }

  mostrarFoto(foto: string) {
  }

  registrarSalida(usr: IUsr) {
    this.sParam.op = 26;
    this.sParam.idusr = usr.idusr;
    this.sParam.idusrmaster = this.dataService.idusrmaster;
    this.dataService.getDataLoad(this.sParam).subscribe( res => {
      if (res.CodeNumber === 201) {
        this.relalumnos.filter( x => {
          const index =  this.relalumnos.findIndex(xx => xx.idusr === usr.idusr);
          this.relalumnos.splice(index, 1);
        });
        const index2 =  this.relusers.findIndex(xx => xx.idusr === usr.idusr);
        this.relusers.splice(index2, 1);
        // Reindexando IDCVO
        this.totdata --;
        let ii = 1;
        this.relusers.filter( cvo => {
          cvo.idcvo = ii;
          ii++;
        });
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
