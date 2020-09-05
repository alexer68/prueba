import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mostrarfoto',
  templateUrl: './mostrarfoto.page.html',
  styleUrls: ['./mostrarfoto.page.scss'],
})
export class MostrarfotoPage implements OnInit {


  swiperOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  @Input() fotodata;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log('>>> fotodata: ', this.fotodata );
  }

  salir() {
    this.modalCtrl.dismiss();
  }

}
