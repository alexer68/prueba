import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonitorPage } from './monitor.page';

const newLocal = 'scanqr';
const routes: Routes = [
  {
    path: '',
    redirectTo: newLocal
  },
  {
    path: '',
    component: MonitorPage,
    children: [
      {
        path: 'scanqr',
        loadChildren: () => import('./scanqr/scanqr.module').then( m => m.ScanqrPageModule)
      },
      {
        path: 'scanrfid',
        loadChildren: () => import('./scanrfid/scanrfid.module').then( m => m.ScanrfidPageModule)
      },
      {
        path: 'entrega',
        loadChildren: () => import('./entrega/entrega.module').then( m => m.EntregaPageModule)
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonitorPageRoutingModule {}
