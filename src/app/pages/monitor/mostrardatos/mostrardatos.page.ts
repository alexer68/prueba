import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IParameters } from '../../../services/data.model';
import { IUsr, IRelAlumnos } from '../../../interfaces/interfaces';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-mostrardatos',
  templateUrl: './mostrardatos.page.html',
  styleUrls: ['./mostrardatos.page.scss'],
})
export class MostrardatosPage implements OnInit {

  @Input() codeData;
  @Input() message;
  private sParam: IParameters = new IParameters();
  relusers: IUsr[] = [];
  relalumnos: IRelAlumnos[] = [];

  constructor( private modalCtrl: ModalController,
               private dataService: DataService ) { }

  ngOnInit() {}

  ionViewDidEnter() {
    // console.log('>>> ionViewDidEnter..', this.codeData);
    // this.sParam.op = 23;
    // this.sParam.idorg = this.dataService.idorg;
    // this.sParam.dato = this.codeData;
    // this.dataService.getDataLoad(this.sParam).subscribe( res => {
    //   if (res.CodeNumber === 201) {
    //     console.log('>>> res: ', res);
    //     this.relusers = res.Result[0].usr;
    //     this.relalumnos = res.Result[0].relalumnos;
    //     // this.opvista = 2;
    //   } else {
    //     this.message = res.Message;
    //     this.returnToScan();
    //   }
    // });
  }

  // returnToScan() {
  //   this.modalCtrl.dismiss({
  //     message: this.message
  //   });
  // }

}
