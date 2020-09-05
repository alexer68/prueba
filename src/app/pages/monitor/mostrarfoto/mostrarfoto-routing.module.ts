import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MostrarfotoPage } from './mostrarfoto.page';

const routes: Routes = [
  {
    path: '',
    component: MostrarfotoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MostrarfotoPageRoutingModule {}
