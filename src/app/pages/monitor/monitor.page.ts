import { Component, OnInit, EventEmitter } from '@angular/core';
import { IUsr, IRelua } from '../../interfaces/interfaces';
import { IParameters } from '../../services/data.model';
import { DataService } from '../../services/data.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.page.html',
  styleUrls: ['./monitor.page.scss'],
})
export class MonitorPage implements OnInit {

  private sParam: IParameters = new IParameters();
  opvista = 1;
  relusers: IUsr[] = [];
  relua: IRelua[] = [];
  exitSR = 0;

  constructor(private dataService: DataService,
              private modalCtrl: ModalController) { }


  ngOnInit() {
    this.loadBD();
    // this.initHub();
  }

  ionViewWillLeave() {
    // this.hubConnection.stop();
  }



  loadBD() {
    this.sParam.op = 22;
    this.sParam.idusr = this.dataService.idusr;
    this.sParam.idorg = this.dataService.idorg;
    this.dataService.getDataLoad(this.sParam).subscribe( res => {
      if (res.CodeNumber === 201) {
        this.relusers = res.Result[0].usr;
        this.relua = res.Result[0].relua;
      }
    });
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

  // startHub() {
  //   this.hubConnection.invoke('SendMessage', 'Móvil', 'Mensaje desde mi Android !');
  // }


  selfiltro() {
    this.opvista = 2;
  }

  almacenaParametros() {
    const pdata1: { idusr: number, idua: number, selected: boolean }[] = [];
    const pdata2: { idusrorig: number, idusrdest: number, idorg: number, selected: boolean }[] = [];
    let i = 0;
    this.relua.filter(x => {
      pdata1[i] = { idusr: this.dataService.idusr,
                    idua: x.idua,
                    selected: x.selected };
      i++;
    });
    let ii = 0;
    this.relusers.filter(x => {
      pdata2[ii] = { idusrorig: this.dataService.idusr,
                      idusrdest: x.idusr,
                      idorg: this.dataService.idorg,
                      selected: x.selected };
      ii++;
    });
    const param: any = {
      op: 1,
      data1: pdata1,
      data2: pdata2
      };
    this.dataService.getData(param).subscribe( res => {
      if (res.CodeNumber === 201) {
        this.opvista = 1;
      }
    });
  }

}
