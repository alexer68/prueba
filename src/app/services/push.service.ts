import { Injectable, EventEmitter } from '@angular/core';
import { IParameters } from './data.model';
import { OSNotificationPayload, OneSignal, OSNotification } from '@ionic-native/onesignal/ngx';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class PushService {

  private sParam: IParameters = new IParameters();
  mensajes: OSNotificationPayload [] = [];
  userId: string;

  pushListener = new EventEmitter<OSNotificationPayload> ();
  constructor(private oneSignal: OneSignal,
              private dataService: DataService) {}

  async getMensajes() {
    // await this.cargarMensajes();
    return [...this.mensajes];
  }

  async configuracionInicial() {
    // Los parámetros se obtienen de OneSignal
    // this.oneSignal.startInit('035f8167-2743-4ae6-8fbd-d51ff7741593', '967764503444');
    this.oneSignal.startInit('5e5e287d-fb27-49b5-a1a1-3952f6d5f963', '783055605273');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe(( noti ) => {
     // do something when notification is received
     this.notificacionRecibida( noti );
    });

    this.oneSignal.handleNotificationOpened().subscribe( async ( noti ) => {
      await this.notificacionRecibida( noti.notification );
    });

    // Obtener ID del suscriptor
    this.oneSignal.getIds().then(async info => {
      this.userId = await info.userId;
    });

    this.oneSignal.endInit();
  }

  async notificacionRecibida( noti: OSNotification ) {
    // await this.cargarMensajes();
    let payload = noti.payload;

    const existePush = this.mensajes.find( mensaje => mensaje.notificationID === payload.notificationID);
    if ( existePush ) {
      return;
    }
    payload = this.almacenaNotificacion(payload);
    this.mensajes.unshift( payload );
    this.pushListener.emit( payload );
    // await this.guardarMensajes();
  }

  almacenaNotificacion(payload: OSNotificationPayload): OSNotificationPayload {
    this.sParam.op = 107;
    this.sParam.title = payload.title;
    this.sParam.body = payload.body;
    this.sParam.notificationID = payload.notificationID;
    this.sParam.idusr = this.dataService.idusr;
    this.sParam.idusremisor = payload.additionalData.idusr;
    this.dataService.getDataLoad(this.sParam).subscribe( res => {
      if (res.CodeNumber === 201) {
        payload.additionalData.idnotificacion = res.Result[0].notificaciones[0].idnotificacion;  //  Number(res.Message);
      }
    });
    return payload;
  }
  
}
