import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanrfidPageRoutingModule } from './scanrfid-routing.module';

import { ScanrfidPage } from './scanrfid.page';
import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    ScanrfidPageRoutingModule
  ],
  declarations: [ScanrfidPage]
})
export class ScanrfidPageModule {}
