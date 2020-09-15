import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Prueba01PageRoutingModule } from './prueba01-routing.module';

import { Prueba01Page } from './prueba01.page';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    Prueba01PageRoutingModule
  ],
  declarations: [Prueba01Page]
})
export class Prueba01PageModule {}
