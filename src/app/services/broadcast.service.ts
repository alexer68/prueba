import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})

export class BroadcastService {
  hubConnection: HubConnection;

  constructor() {}

  startSignalR(){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://webschooldaleg.azurewebsites.net/vortexhub')
      .build();


    this.hubConnection.on('ReceiveMessage', data => {
      console.log(data.user);
      console.log(data.message);
    });

    // connection.start()
    //   .then(() => connection.invoke('SendMessage', 'alex', 'Hola mundo !'));

  }

}
