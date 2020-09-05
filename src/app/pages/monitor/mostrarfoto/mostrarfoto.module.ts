import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MostrarfotoPageRoutingModule } from './mostrarfoto-routing.module';

import { MostrarfotoPage } from './mostrarfoto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MostrarfotoPageRoutingModule
  ],
  declarations: [MostrarfotoPage]
})
export class MostrarfotoPageModule {}
