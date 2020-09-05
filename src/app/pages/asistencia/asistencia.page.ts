import { Component, OnInit } from '@angular/core';
import { IParameters } from '../../services/data.model';
import { IRelAlumnos } from '../../interfaces/interfaces';
import { DataService } from '../../services/data.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {

  private sParam: IParameters = new IParameters();
  relalumnos: IRelAlumnos[] = [];
  opvista = 1;
  opfoto = 0;

  constructor(private dataService: DataService,
              private toastCtrl: ToastController) { }

  ngOnInit() {
    this.loadBD();
  }

  loadBD() {
    this.sParam.op = 21;
    this.sParam.idusr = this.dataService.idusr;
    this.dataService.getDataLoad(this.sParam).subscribe( res => {
      console.log('>>>res: ', res);
      if (res.CodeNumber === 201) {
        this.relalumnos = res.Result[0].relalumnos;
      }
    });
  }

  registroAsistencia(op: number) {

  }

  activarFoto() {
    if (this.opfoto === 0) { this.opfoto = 1; } else { this.opfoto = 0; }
  }


  buscar(event) {
  }

  doRefresh(event) {
    setTimeout(() => {
      this.relalumnos = [];
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
