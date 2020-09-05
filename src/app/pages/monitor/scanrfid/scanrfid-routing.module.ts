import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanrfidPage } from './scanrfid.page';

const routes: Routes = [
  {
    path: '',
    component: ScanrfidPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanrfidPageRoutingModule {}
