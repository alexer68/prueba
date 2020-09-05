import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IData, ISendEmail } from '../interfaces/interfaces';
import { IParameters } from './data.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor( private http: HttpClient ) {}
  op: number;
  idusr: number;
  nombre: string;
  apellidos: string;
  foto: string;
  idtag: number;
  idorg: number;
  userId: string;
  cadenaemail: string;
  sitmaster: boolean;
  idusrmaster: number;

  getDataLoad(param: IParameters) {
    console.log('>>> getDataLoad :', JSON.stringify(param));
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
     };
    return this.http.post<IData>('https://webschooldaleg.azurewebsites.net/api/appDataLoad', JSON.stringify(param), options);
  }

  getData(param: any) {
    // console.log('>>> getData :', JSON.stringify(param));
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
     };
    return this.http.post<IData>('https://webschooldaleg.azurewebsites.net/api/appData', JSON.stringify(param), options);
  }

  getDataHub(param: any) {
    // console.log('>>> getData :', JSON.stringify(param));
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
     };
    return this.http.post<IData>('https://webschooldaleg.azurewebsites.net/api/hubData', JSON.stringify(param), options);
  }

  sendEmail(param: ISendEmail) {
    const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
     };
    return this.http.post<string>('https://webvortex.azurewebsites.net/api/SendEmail', JSON.stringify(param), options);
  }

  sendNotification(param: any) {
    try {
      const options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
                                .set('Authorization', 'Basic ZmQyN2FiZTctYzM1OS00ZTY3LThiNzgtOWExYTcxYjczYjU3')
      };
      return this.http.post<any>('https://onesignal.com/api/v1/notifications', JSON.stringify(param), options );
    } catch { console.error(); }
  }

}
