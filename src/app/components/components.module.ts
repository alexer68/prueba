import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SlideregistroComponent } from './slideregistro/slideregistro.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SignalrComponent } from './signalr/signalr.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SlideregistroComponent,
    SignalrComponent
  ],
  exports: [
    HeaderComponent,
    SlideregistroComponent,
    SignalrComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ]
})
export class ComponentsModule { }
