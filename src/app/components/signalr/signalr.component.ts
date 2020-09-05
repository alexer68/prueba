import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel, HttpTransportType, HubConnectionState } from '@microsoft/signalr';
import { DataService } from '../../services/data.service';
import { IParameters } from '../../services/data.model';

@Component({
  selector: 'app-signalr',
  templateUrl: './signalr.component.html',
  styleUrls: ['./signalr.component.scss'],
})
export class SignalrComponent implements OnInit {

  @Output() public sendmsgEvent = new EventEmitter<string>();
  @Output() public sendmsgEventII = new EventEmitter<string>();

  private sParam: IParameters = new IParameters();
  private hubConnection: HubConnection;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    if (this.hubConnection === undefined ) {
      console.log('>>> initHub undefined');
      this.initHub();
    } else {
        if (this.hubConnection.state === HubConnectionState.Disconnected) {
          console.log('>>> initHub Disconnected');
          this.initHub();
        }
    }
  }

  public onExitSR() {
    console.log('>>>>> onExitSR');
    this.hubConnection.stop();
  }

  public onChange = (rating: number) => {
    console.log(rating);
  }


  initHub()
  {
    const signalrBaseUri = 'https://webschooldaleg.azurewebsites.net/vortexhub';
    this.hubConnection = new HubConnectionBuilder()
    .configureLogging(LogLevel.Information)
    .withAutomaticReconnect()
    .withUrl(signalrBaseUri, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets
    })
    .build();

    // this.start();

    this.hubConnection.onclose( e => {
      console.log('>>>>>>>>>>>>>>>>>> Close SignalR ', e);
    });

    this.hubConnection.on('ReceiveMessage', (usuario, mensaje) => {
      // console.log('Message received : ');
      // console.log(usuario);
      // console.log(mensaje);
      this.sendMsgEvent(mensaje);
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

    this.hubConnection.start();
  }

  // async start() {
  //   try {
  //       await this.hubConnection.start();
  //       console.log('conectado a SignalR !!');
  //   } catch (err) {
  //       console.log(err);
  //       setTimeout(() => this.start(), 5000);
  //   }
  // }

  sendMsgEvent(mensaje: string) {
    if (mensaje.length >= 10) {
      this.sendmsgEvent.emit(mensaje);
    } else {
      this.sendmsgEventII.emit(mensaje);
    }
  }



  startHub() {
    this.hubConnection.invoke('SendMessage', 'Móvil', 'Mensaje desde mi Android !');
  }

}
