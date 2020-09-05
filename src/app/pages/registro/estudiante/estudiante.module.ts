import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstudiantePageRoutingModule } from './estudiante-routing.module';

import { EstudiantePage } from './estudiante.page';
import { IonicContextMenuModule } from 'ionic-context-menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicContextMenuModule,
    EstudiantePageRoutingModule
  ],
  declarations: [EstudiantePage]
})
export class EstudiantePageModule {}
