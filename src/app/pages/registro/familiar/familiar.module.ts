import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamiliarPageRoutingModule } from './familiar-routing.module';

import { FamiliarPage } from './familiar.page';
import { ComponentsModule } from '../../../components/components.module';
import { IonicContextMenuModule } from 'ionic-context-menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    IonicContextMenuModule,
    FamiliarPageRoutingModule
  ],
  declarations: [FamiliarPage]
})
export class FamiliarPageModule {}
